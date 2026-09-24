import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadFileToGoogleDrive, getFileBufferFromGoogleDrive } from '@/lib/google-drive';
import { getUserStorageUsage } from '@/lib/quota';
import { sendDocumentDepositNotificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Clé de fichier requise' }, { status: 400 });
    }

    const buffer = Buffer.from(await req.arrayBuffer());
    const reqMatch = key.match(/req_([^/]+)/);

    let driveFileId: string | null = null;

    if (reqMatch && reqMatch[1]) {
      const requirementId = reqMatch[1];
      const fileName = key.split('_').slice(1).join('_') || 'document.pdf';
      const contentType = req.headers.get('content-type') || 'application/pdf';

      // Check storage quota of request owner
      const reqDoc = await db.documentRequirement.findUnique({
        where: { id: requirementId },
        include: { folderRequest: true },
      });

      if (reqDoc) {
        const storage = await getUserStorageUsage(reqDoc.folderRequest.userId);
        if (!storage.allowed || storage.usedBytes + buffer.length > storage.maxBytes) {
          return NextResponse.json(
            {
              error: `Espace de stockage cloud saturé pour le propriétaire de ce dossier (${storage.usedFormatted} / ${storage.maxFormatted}). Passez au forfait supérieur (500 Go sur Pro ou 2 To sur IA Enterprise) pour autoriser de nouveaux dépôts.`,
            },
            { status: 403 }
          );
        }
      }

      // 100% Direct Google Drive Master Storage (No local disk public/uploads storage)
      const driveResult = await uploadFileToGoogleDrive({
        fileName,
        mimeType: contentType,
        buffer,
      });

      if (driveResult) {
        driveFileId = driveResult.fileId;
      }

      const storedKey = driveFileId ? `drive_${driveFileId}` : key;

      const docFile = await db.documentFile.create({
        data: {
          documentRequirementId: requirementId,
          fileKey: storedKey,
          fileName,
          fileSize: buffer.length,
          mimeType: contentType,
        },
      });

      const updatedReq = await db.documentRequirement.update({
        where: { id: requirementId },
        data: { status: 'SUBMITTED' },
        include: { folderRequest: { include: { user: true } } },
      });

      if (updatedReq.folderRequest.status === 'PENDING') {
        await db.folderRequest.update({
          where: { id: updatedReq.folderRequestId },
          data: { status: 'IN_REVIEW' },
        });
      }

      const subscriber = updatedReq.folderRequest.user;
      if (subscriber && subscriber.email) {
        sendDocumentDepositNotificationEmail({
          to: subscriber.email,
          subscriberName: subscriber.name,
          subscriberStatus: subscriber.subscriptionStatus,
          clientName: updatedReq.folderRequest.clientName,
          clientEmail: updatedReq.folderRequest.clientEmail,
          folderTitle: updatedReq.folderRequest.clientName,
          requestId: updatedReq.folderRequestId,
          documentTitle: updatedReq.title,
          fileName: docFile.fileName,
        }).catch((err) => console.error('[Deposit Email Error]', err));
      }

      return NextResponse.json({ success: true, key: storedKey, driveFileId, file: docFile });
    }

    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error('[Google Drive PUT Upload Error]', err);
    return NextResponse.json({ error: 'Erreur d\'upload vers Google Drive' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const requirementId = formData.get('documentRequirementId') as string | null;

    if (!file || !requirementId) {
      return NextResponse.json({ error: 'Fichier et documentRequirementId requis' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check storage quota of request owner
    const reqDoc = await db.documentRequirement.findUnique({
      where: { id: requirementId },
      include: { folderRequest: true },
    });

    if (reqDoc) {
      const storage = await getUserStorageUsage(reqDoc.folderRequest.userId);
      if (!storage.allowed || storage.usedBytes + buffer.length > storage.maxBytes) {
        return NextResponse.json(
          {
            error: `Espace de stockage cloud saturé pour le propriétaire de ce dossier (${storage.usedFormatted} / ${storage.maxFormatted}). Passez au forfait supérieur (500 Go sur Pro ou 2 To sur IA Enterprise) pour autoriser de nouveaux dépôts.`,
          },
          { status: 403 }
        );
      }
    }

    // 100% Direct Google Drive Master Storage
    const driveResult = await uploadFileToGoogleDrive({
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      buffer,
    });

    const driveFileId = driveResult?.fileId || null;
    const storedKey = driveFileId ? `drive_${driveFileId}` : `folders/req_${requirementId}/${Date.now()}_${file.name}`;

    const docFile = await db.documentFile.create({
      data: {
        documentRequirementId: requirementId,
        fileKey: storedKey,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
      },
    });

    const updatedReq = await db.documentRequirement.update({
      where: { id: requirementId },
      data: { status: 'SUBMITTED' },
      include: { folderRequest: { include: { user: true } } },
    });

    if (updatedReq.folderRequest.status === 'PENDING') {
      await db.folderRequest.update({
        where: { id: updatedReq.folderRequestId },
        data: { status: 'IN_REVIEW' },
      });
    }

    const subscriber = updatedReq.folderRequest.user;
    if (subscriber && subscriber.email) {
      sendDocumentDepositNotificationEmail({
        to: subscriber.email,
        subscriberName: subscriber.name,
        subscriberStatus: subscriber.subscriptionStatus,
        clientName: updatedReq.folderRequest.clientName,
        clientEmail: updatedReq.folderRequest.clientEmail,
        folderTitle: updatedReq.folderRequest.clientName,
        requestId: updatedReq.folderRequestId,
        documentTitle: updatedReq.title,
        fileName: docFile.fileName,
      }).catch((err) => console.error('[Deposit Email Error]', err));
    }

    return NextResponse.json({
      success: true,
      key: storedKey,
      driveFileId,
      file: docFile,
    });
  } catch (err) {
    console.error('[Google Drive POST Upload Error]', err);
    return NextResponse.json({ error: 'Erreur d\'upload vers Google Drive' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const isDownload = searchParams.get('download') === '1' || searchParams.get('download') === 'true';

    if (!key) {
      return NextResponse.json({ error: 'Clé de fichier requise' }, { status: 400 });
    }

    // Query database for real file metadata (fileName and mimeType)
    const dbFile = await db.documentFile.findFirst({
      where: {
        OR: [
          { fileKey: key },
          { id: key },
          { fileKey: { contains: key } },
        ],
      },
    });

    let fileName = dbFile?.fileName || searchParams.get('fileName') || 'document.pdf';
    let contentType = dbFile?.mimeType || 'application/pdf';

    // Fallback MIME detection if missing or generic octet-stream
    if (!dbFile || contentType === 'application/octet-stream') {
      const lowerName = (fileName || key).toLowerCase();
      if (lowerName.endsWith('.pdf')) contentType = 'application/pdf';
      else if (lowerName.endsWith('.png')) contentType = 'image/png';
      else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (lowerName.endsWith('.webp')) contentType = 'image/webp';
    }

    const dispositionType = isDownload ? 'attachment' : 'inline';
    const encodedFileName = encodeURIComponent(fileName);

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `${dispositionType}; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
      'Cache-Control': 'public, max-age=3600, immutable',
    };

    // 1. Fetch & stream directly from Google Drive Master using driveFileId
    const driveFileId = key.replace(/^drive_/, '');
    const driveBuffer = await getFileBufferFromGoogleDrive(driveFileId);

    if (driveBuffer) {
      return new NextResponse(driveBuffer as unknown as BodyInit, { headers });
    }

    // 2. If driveBuffer is unavailable, return SVG preview placeholder without disk fallback
    const svgPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#1e293b"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">Document Sécurisé Google Drive Master</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#94a3b8">${fileName}</text></svg>`;
    return new NextResponse(svgPlaceholder, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `inline; filename="${encodedFileName}"`,
      },
    });
  } catch (err) {
    console.error('[Google Drive GET Error]', err);
    return NextResponse.json({ error: 'Fichier non trouvé sur Google Drive' }, { status: 404 });
  }
}
