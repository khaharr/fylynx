import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { processAiVerificationForRequirement } from '@/lib/ai-verifier';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { documentRequirementId, fileName, mimeType, fileSize } = await req.json();

    if (!documentRequirementId) {
      return NextResponse.json({ error: 'documentRequirementId requis' }, { status: 400 });
    }

    const requirement = await db.documentRequirement.findUnique({
      where: { id: documentRequirementId },
      include: {
        folderRequest: {
          include: { user: true },
        },
      },
    });

    if (!requirement) {
      return NextResponse.json({ error: 'Exigence introuvable' }, { status: 404 });
    }

    const userStatus = requirement.folderRequest.user.subscriptionStatus;
    const userRole = requirement.folderRequest.user.role;

    // Seuls les abonnés AI_ENTERPRISE ou ADMIN bénéficient du traitement d'analyse IA automatique
    if (userStatus !== 'AI_ENTERPRISE' && userRole !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'L\'analyse par IA automatique est réservée au forfait IA Enterprise (149 €/mois).',
      });
    }

    const res = await processAiVerificationForRequirement(
      documentRequirementId,
      fileName || 'document.pdf',
      mimeType || 'application/pdf',
      fileSize || 500000
    );

    return NextResponse.json({ success: true, data: res });
  } catch (err) {
    console.error('[AI Verification Route Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la vérification IA' }, { status: 500 });
  }
}
