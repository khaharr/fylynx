import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { getFileBufferFromGoogleDrive } from '@/lib/google-drive';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const folderRequest = await db.folderRequest.findUnique({
      where: { id: params.id },
      include: {
        documentRequirements: {
          include: { files: true },
        },
      },
    });

    if (!folderRequest) {
      return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 });
    }

    const zip = new JSZip();
    const folderName = `Dossier_${folderRequest.clientName.replace(/\s+/g, '_')}`;
    const mainZipFolder = zip.folder(folderName);

    let hasFiles = false;
    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

    for (const reqItem of folderRequest.documentRequirements) {
      const sanitizedTitle = reqItem.title.replace(/[^a-zA-Z0-9.-]/g, '_');
      for (const file of reqItem.files) {
        hasFiles = true;
        const zipFileName = `${sanitizedTitle}_${file.fileName}`;

        // 1. Google Drive Master Storage Lookup
        if (file.fileKey.startsWith('drive_') || file.fileKey.length > 25) {
          const driveFileId = file.fileKey.replace(/^drive_/, '');
          const driveBuffer = await getFileBufferFromGoogleDrive(driveFileId);
          if (driveBuffer) {
            mainZipFolder?.file(zipFileName, driveBuffer);
            continue;
          }
        }

        // 2. Local storage lookup fallback
        const safeLocalName = encodeURIComponent(file.fileKey.replace(/\//g, '_'));
        const localPath = path.join(UPLOAD_DIR, safeLocalName);

        if (fs.existsSync(localPath)) {
          const fileData = fs.readFileSync(localPath);
          mainZipFolder?.file(zipFileName, fileData);
        } else {
          // If remote mock file
          const mockContent = `[Fylynx Document Exporte]\nTitre: ${reqItem.title}\nNom Fichier: ${file.fileName}\nKey: ${file.fileKey}\nStatut: ${reqItem.status}\nDate: ${file.uploadedAt.toISOString()}\n`;
          mainZipFolder?.file(`${sanitizedTitle}_info.txt`, mockContent);
        }
      }
    }

    if (!hasFiles) {
      mainZipFolder?.file(
        'RECAPITULATIF_DOSSIER.txt',
        `Dossier: ${folderRequest.clientName}\nEmail: ${folderRequest.clientEmail}\nStatut: ${folderRequest.status}\nAucun fichier soumis pour le moment.\n`
      );
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${folderName}.zip"`,
      },
    });
  } catch (err) {
    console.error('[ZIP Export Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la création du fichier ZIP' }, { status: 500 });
  }
}
