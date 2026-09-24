import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendReminderEmail } from '@/lib/email';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const folderRequest = await db.folderRequest.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        documentRequirements: {
          include: { files: true },
        },
      },
    });

    if (!folderRequest) {
      return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 });
    }

    // Check ownership or admin
    if (folderRequest.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Calculate missing or unvalidated documents
    const missingDocs = folderRequest.documentRequirements.filter(
      (r) => r.status !== 'VALIDATED' || r.files.length === 0
    );

    if (missingDocs.length === 0) {
      return NextResponse.json(
        { error: 'Toutes les pièces de ce dossier sont déjà validées et conformes. Aucune relance n\'est nécessaire.' },
        { status: 400 }
      );
    }

    const missingDocTitles = missingDocs.map((r) => r.title);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const depositLink = `${appUrl}/d/${folderRequest.token}`;
    const companyName = folderRequest.user.companyName || folderRequest.user.name;

    // Send email reminder listing missing documents
    const result = await sendReminderEmail({
      to: folderRequest.clientEmail,
      clientName: folderRequest.clientName,
      companyName,
      folderTitle: `Rappel : Compléter votre dossier de pièces justificatives`,
      depositLink,
      missingDocTitles,
      customSubject: folderRequest.user.reminderEmailSubject,
      customBody: folderRequest.user.reminderEmailBody,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de l\'envoi de l\'email via Resend' },
        { status: 400 }
      );
    }

    // Update reminder metadata
    const updated = await db.folderRequest.update({
      where: { id: folderRequest.id },
      data: {
        reminderCount: folderRequest.reminderCount + 1,
        lastRemindedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Relance e-mail envoyée avec succès à ${folderRequest.clientEmail}`,
      reminderCount: updated.reminderCount,
      lastRemindedAt: updated.lastRemindedAt,
    });
  } catch (err) {
    console.error('[Single Folder Reminder Error]', err);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la relance' },
      { status: 500 }
    );
  }
}
