import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { generatePresignedUploadUrl } from '@/lib/storage';
import { db } from '@/lib/db';

const presignedUrlSchema = z.object({
  documentRequirementId: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().max(25 * 1024 * 1024, 'La taille du fichier ne peut excéder 25 Mo'),
  mimeType: z.string().refine(
    (type) =>
      ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'image/heic'].includes(type),
    'Type de fichier non autorisé (JPEG, PNG, WebP, PDF uniquement)'
  ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = presignedUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { documentRequirementId, fileName, fileSize, mimeType } = parsed.data;

    // Verify document requirement exists
    const requirement = await db.documentRequirement.findUnique({
      where: { id: documentRequirementId },
      include: { folderRequest: true },
    });

    if (!requirement) {
      return NextResponse.json({ error: 'Exigence de document introuvable' }, { status: 404 });
    }

    if (requirement.folderRequest.status === 'COMPLETED' || requirement.folderRequest.status === 'EXPIRED') {
      return NextResponse.json(
        { error: 'Ce dossier n\'est plus modifiable' },
        { status: 400 }
      );
    }

    // Generate unique S3/R2 key
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `folders/${requirement.folderRequestId}/req_${documentRequirementId}/${Date.now()}_${sanitizedFileName}`;

    const { uploadUrl, isLocal } = await generatePresignedUploadUrl({
      fileKey,
      mimeType,
    });

    return NextResponse.json({
      uploadUrl,
      fileKey,
      isLocal,
      documentRequirementId,
    });
  } catch (error) {
    console.error('[Presigned URL Error]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'URL d\'upload' },
      { status: 500 }
    );
  }
}
