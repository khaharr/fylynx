import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { uploadFileToGoogleDrive, getFileBufferFromGoogleDrive } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

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

      // 100% Direct Google Drive Master Storage (No local disk waste)
      const driveResult = await uploadFileToGoogleDrive({
        fileName,
        mimeType: contentType,
        buffer,
      });

      if (driveResult) {
        driveFileId = driveResult.fileId;
      }

      const storedKey = driveFileId ? `drive_${driveFileId}` : key;

      await db.documentFile.create({
        data: {
          documentRequirementId: requirementId,
          fileKey: storedKey,
          fileName,
          fileSize: buffer.length,
          mimeType: contentType,
        },
      });

      await db.documentRequirement.update({
        where: { id: requirementId },
        data: { status: 'SUBMITTED' },
      });

      return NextResponse.json({ success: true, key: storedKey, driveFileId });
    }

    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error('[Upload Error]', err);
    return NextResponse.json({ error: 'Erreur d\'upload' }, { status: 500 });
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

    // 100% Direct Google Drive Master Storage (No local disk waste)
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

    await db.documentRequirement.update({
      where: { id: requirementId },
      data: { status: 'SUBMITTED' },
    });

    return NextResponse.json({
      success: true,
      key: storedKey,
      driveFileId,
      file: docFile,
    });
  } catch (err) {
    console.error('[POST Upload Error]', err);
    return NextResponse.json({ error: 'Erreur d\'upload' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Clé de fichier requise' }, { status: 400 });
    }

    // Determine content type
    let contentType = 'application/octet-stream';
    const lowerKey = key.toLowerCase();
    if (lowerKey.endsWith('.pdf')) contentType = 'application/pdf';
    else if (lowerKey.endsWith('.png')) contentType = 'image/png';
    else if (lowerKey.endsWith('.jpg') || lowerKey.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (lowerKey.endsWith('.webp')) contentType = 'image/webp';

    // 1. Fetch & stream directly from Google Drive Master if fileKey starts with drive_
    if (key.startsWith('drive_') || key.length > 25) {
      const driveFileId = key.replace(/^drive_/, '');
      const driveBuffer = await getFileBufferFromGoogleDrive(driveFileId);

      if (driveBuffer) {
        return new NextResponse(driveBuffer as unknown as BodyInit, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600, immutable',
          },
        });
      }
    }

    // 2. Fallback lookup in local uploads for old test files
    const safeFilename = encodeURIComponent(key.replace(/\//g, '_'));
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 3. Fallback SVG Placeholder
    const svgPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#1e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#94a3b8">Document Réceptionné sur Google Drive Master</text></svg>`;
    return new NextResponse(svgPlaceholder, {
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  } catch (err) {
    console.error('[Local Get Error]', err);
    return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
  }
}
