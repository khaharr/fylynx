import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { processAiVerificationForRequirement } from '@/lib/ai-verifier';
import { db } from '@/lib/db';
import { sendDocumentDepositNotificationEmail } from '@/lib/email';

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

    // Seuls les abonnés AI_ENTERPRISE, AGENCY_SCALE ou ADMIN bénéficient du traitement d'analyse IA automatique
    if (userStatus !== 'AI_ENTERPRISE' && userStatus !== 'AGENCY_SCALE' && userRole !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'L\'analyse par IA automatique est réservée aux forfaits IA Enterprise (149 €/mois) et Agence Scale (247 €/mois).',
      });
    }

    const res = await processAiVerificationForRequirement(
      documentRequirementId,
      fileName || 'document.pdf',
      mimeType || 'application/pdf',
      fileSize || 500000
    );

    // Envoyer la notification email avec le rapport complet d'analyse IA à l'abonné
    const subscriber = requirement.folderRequest.user;
    if (subscriber && subscriber.email && res?.aiResult) {
      sendDocumentDepositNotificationEmail({
        to: subscriber.email,
        subscriberName: subscriber.name,
        subscriberStatus: subscriber.subscriptionStatus,
        clientName: requirement.folderRequest.clientName,
        clientEmail: requirement.folderRequest.clientEmail,
        folderTitle: requirement.folderRequest.clientName,
        requestId: requirement.folderRequestId,
        documentTitle: requirement.title,
        fileName: fileName || 'document.pdf',
        aiResult: res.aiResult,
      }).catch((err) => console.error('[AI Verification Email Error]', err));
    }

    return NextResponse.json({ success: true, data: res });
  } catch (err) {
    console.error('[AI Verification Route Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la vérification IA' }, { status: 500 });
  }
}
