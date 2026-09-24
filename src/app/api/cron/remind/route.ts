import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendReminderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Relances automatiques Email pour les abonnés Pro (79€) et IA Enterprise (149€)
    const pendingRequests = await db.folderRequest.findMany({
      where: {
        status: { in: ['PENDING', 'IN_REVIEW'] },
        reminderCount: { lt: 3 },
        createdAt: { lte: twentyFourHoursAgo },
        user: {
          subscriptionStatus: { in: ['PRO', 'AGENCY_SCALE', 'AI_ENTERPRISE'] },
        },
        OR: [
          { lastRemindedAt: null },
          { lastRemindedAt: { lte: twentyFourHoursAgo } },
        ],
      },
      include: {
        user: true,
        documentRequirements: {
          include: { files: true },
        },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let processedCount = 0;
    const results: Array<{ id: string; clientName: string; emailSent: boolean }> = [];

    for (const folder of pendingRequests) {
      const missingDocs = folder.documentRequirements.filter(
        (doc) => doc.isRequired && (doc.status !== 'VALIDATED' || doc.files.length === 0)
      );

      if (missingDocs.length === 0) continue;

      const missingDocTitles = missingDocs.map((d) => d.title);
      const depositLink = `${appUrl}/d/${folder.token}`;
      const companyName = folder.user.companyName || folder.user.name;

      // Envoi Email de relance automatique via Resend avec la liste des pièces manquantes
      const emailResult = await sendReminderEmail({
        to: folder.clientEmail,
        clientName: folder.clientName,
        companyName,
        folderTitle: `Rappel de dépôt de pièces`,
        depositLink,
        missingDocTitles,
        customSubject: folder.user.reminderEmailSubject,
        customBody: folder.user.reminderEmailBody,
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
      timestamp: new Date().toISOString(),
      processedCount,
      reminders: results,
    });
  } catch (err) {
    console.error('[CRON Reminder Script Error]', err);
    return NextResponse.json(
      { error: 'Erreur lors de l\'exécution du job de relance' },
      { status: 500 }
    );
  }
}
