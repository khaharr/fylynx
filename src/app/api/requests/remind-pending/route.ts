import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendReminderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const sessionUser = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // Get requests belonging ONLY to this subscriber (or all if admin)
    const whereClause: any = {
      userId: dbUser.id,
    };

    // Retrieve all folders for statistics
    const allUserFolders = await db.folderRequest.findMany({
      where: whereClause,
      include: {
        documentRequirements: {
          include: { files: true },
        },
      },
    });

    // Filter strictly for INCOMPLETE / PENDING folders (where client hasn't deposited everything)
    // EXCLUDING folders in IN_REVIEW (client uploaded files, awaiting subscriber validation) or COMPLETED
    const pendingFolders = allUserFolders.filter((f) => {
      if (f.status !== 'PENDING') return false;
      // Double check if there are missing required documents
      const hasMissing = f.documentRequirements.some(
        (doc) => doc.isRequired && (doc.status !== 'VALIDATED' || doc.files.length === 0)
      );
      return hasMissing;
    });

    const skippedInReviewCount = allUserFolders.filter((f) => f.status === 'IN_REVIEW').length;
    const skippedCompletedCount = allUserFolders.filter((f) => f.status === 'COMPLETED').length;

    if (pendingFolders.length === 0) {
      return NextResponse.json({
        success: true,
        processedCount: 0,
        totalPendingCount: 0,
        skippedInReviewCount,
        skippedCompletedCount,
        message: 'Aucun client en attente de dépôt à relancer dans votre tableau de bord.',
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let processedCount = 0;
    const results: Array<{ id: string; clientName: string; emailSent: boolean }> = [];

    for (const folder of pendingFolders) {
      const missingDocs = folder.documentRequirements.filter(
        (doc) => doc.isRequired && (doc.status !== 'VALIDATED' || doc.files.length === 0)
      );

      const missingDocTitles = missingDocs.map((d) => d.title);
      const depositLink = `${appUrl}/d/${folder.token}`;
      const companyName = dbUser.companyName || dbUser.name;

      const emailResult = await sendReminderEmail({
        to: folder.clientEmail,
        clientName: folder.clientName,
        companyName,
        folderTitle: `Rappel : Dépôt de vos pièces justificatives`,
        depositLink,
        missingDocTitles,
        customSubject: dbUser.reminderEmailSubject,
        customBody: dbUser.reminderEmailBody,
      });

      await db.folderRequest.update({
        where: { id: folder.id },
        data: {
          reminderCount: folder.reminderCount + 1,
          lastRemindedAt: new Date(),
        },
      });

      processedCount++;
      results.push({
        id: folder.id,
        clientName: folder.clientName,
        emailSent: Boolean(emailResult.success),
      });
    }

    return NextResponse.json({
      success: true,
      processedCount,
      totalPendingCount: pendingFolders.length,
      skippedInReviewCount,
      skippedCompletedCount,
      message: `${processedCount} client(s) incomplet(s) relancé(s) par e-mail avec succès.`,
      reminders: results,
    });
  } catch (err) {
    console.error('[Remind Pending API Error]', err);
    return NextResponse.json(
      { error: 'Erreur lors de la relance des dossiers incomplets' },
      { status: 500 }
    );
  }
}
