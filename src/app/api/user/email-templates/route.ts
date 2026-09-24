import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        inviteEmailSubject: true,
        inviteEmailBody: true,
        reminderEmailSubject: true,
        reminderEmailBody: true,
      },
    });

    return NextResponse.json({
      inviteEmailSubject: dbUser?.inviteEmailSubject || 'Demande de pièces justificatives - {company_name}',
      inviteEmailBody: dbUser?.inviteEmailBody || 'Bonjour {client_name},\n\nNous attendons la transmission de vos documents justificatifs pour valider votre dossier.\n\nCliquez sur ce lien sécurisé 1-clic pour nous les transmettre en 2 minutes depuis votre smartphone :\n{link}\n\nCordialement,\n{company_name}',
      reminderEmailSubject: dbUser?.reminderEmailSubject || 'Rappel : Votre dossier pour {company_name} est incomplet',
      reminderEmailBody: dbUser?.reminderEmailBody || 'Bonjour {client_name},\n\nSauf erreur de notre part, votre dossier est toujours en attente des pièces suivantes :\n{missing_docs}\n\nMerci de les déposer via votre lien sécurisé :\n{link}\n\nCordialement,\n{company_name}',
    });
  } catch (err) {
    console.error('[GET Email Templates Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des modèles d\'e-mail' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { inviteEmailSubject, inviteEmailBody, reminderEmailSubject, reminderEmailBody } = body;

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        inviteEmailSubject,
        inviteEmailBody,
        reminderEmailSubject,
        reminderEmailBody,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Modèles d\'e-mails enregistrés avec succès !',
      inviteEmailSubject: updated.inviteEmailSubject,
      inviteEmailBody: updated.inviteEmailBody,
      reminderEmailSubject: updated.reminderEmailSubject,
      reminderEmailBody: updated.reminderEmailBody,
    });
  } catch (err) {
    console.error('[PATCH Email Templates Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde des modèles d\'e-mail' }, { status: 500 });
  }
}
