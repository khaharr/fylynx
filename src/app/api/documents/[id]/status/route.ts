import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendReminderEmail } from '@/lib/email';
import { triggerFolderCompletedWebhook } from '@/lib/webhooks';

const updateStatusSchema = z.object({
  status: z.enum(['VALIDATED', 'REJECTED', 'WAITING']),
  rejectionReason: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, rejectionReason } = parsed.data;

    const requirement = await db.documentRequirement.update({
      where: { id: params.id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason || 'Document non conforme ou illisible' : null,
      },
      include: {
        folderRequest: {
          include: {
            user: true,
            documentRequirements: true,
          },
        },
      },
    });

    const folderRequest = requirement.folderRequest;
    const allRequirements = folderRequest.documentRequirements;

    const allValidated = allRequirements.every((r) => r.status === 'VALIDATED');
    const hasRejected = allRequirements.some((r) => r.status === 'REJECTED');

    let newFolderStatus = folderRequest.status;
    if (allValidated) {
      newFolderStatus = 'COMPLETED';
    } else if (hasRejected || allRequirements.some((r) => r.status === 'SUBMITTED')) {
      newFolderStatus = 'IN_REVIEW';
    }

    if (newFolderStatus !== folderRequest.status) {
      await db.folderRequest.update({
        where: { id: folderRequest.id },
        data: { status: newFolderStatus },
      });
    }

    if (newFolderStatus === 'COMPLETED' || allValidated) {
      triggerFolderCompletedWebhook(folderRequest.id).catch(console.error);
    }

    // Send email notification to client if rejected
    if (status === 'REJECTED') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const depositLink = `${appUrl}/d/${folderRequest.token}`;

      await sendReminderEmail({
        to: folderRequest.clientEmail,
        clientName: folderRequest.clientName,
        companyName: folderRequest.user.companyName || folderRequest.user.name,
        folderTitle: `Attention : Document à renvoyer pour votre dossier`,
        depositLink,
      });
    }

    return NextResponse.json({
      success: true,
      requirement,
      folderStatus: newFolderStatus,
    });
  } catch (err) {
    console.error('[Update Document Status Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
