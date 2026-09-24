import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { db } from '@/lib/db';
import { checkUserQuota } from '@/lib/quota';
import { sendReminderEmail } from '@/lib/email';
import { getCurrentUser } from '@/lib/auth';

const createRequestSchema = z.object({
  clientName: z.string().optional().nullable(),
  clientEmail: z.string().optional().nullable(),
  clientPhone: z.string().optional().nullable(),
  documentTitles: z.array(z.string().min(1)).min(1, 'Au moins un document doit être demandé'),
  sendNotification: z.boolean().optional().default(false),
});

export async function GET(req: Request) {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'demo@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ requests: [] });
    }

    // Check if user is a team member of an owner account
    const teamRecord = await db.teamMember.findFirst({
      where: { email: user.email.toLowerCase() },
    });

    const targetUserIds = [user.id];
    if (teamRecord) {
      targetUserIds.push(teamRecord.ownerId);
    }

    const requests = await db.folderRequest.findMany({
      where: { userId: { in: targetUserIds } },
      include: {
        documentRequirements: {
          include: { files: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (err) {
    console.error('[GET Requests Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des dossiers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let user = await getCurrentUser();

    if (!user && authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.replace('Bearer ', '').trim();
      const dbUser = await db.user.findUnique({ where: { apiKey } });
      if (dbUser) {
        user = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          subscriptionStatus: dbUser.subscriptionStatus,
          companyName: dbUser.companyName,
          companyLogo: dbUser.companyLogo,
          customWelcomeMsg: dbUser.customWelcomeMsg,
          brandColor: dbUser.brandColor,
        };
      }
    }

    if (!user) {
      user = await db.user.findFirst({ where: { email: 'demo@fylinx.com' } });
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    const quota = await checkUserQuota(user.id);
    if (!quota.allowed) {
      return NextResponse.json({ error: quota.reason }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données de formulaire invalides', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { clientName, clientEmail, clientPhone, documentTitles, sendNotification } = parsed.data;

    const token = 'req_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const shortId = token.slice(4, 9).toUpperCase();

    const finalClientName = clientName && clientName.trim().length > 0
      ? clientName.trim()
      : `Dossier Client #${shortId}`;

    const finalClientEmail = clientEmail && clientEmail.trim().length > 0
      ? clientEmail.trim()
      : `lien-direct-${token.slice(4, 8)}@fylinx.com`;

    const folderRequest = await db.folderRequest.create({
      data: {
        userId: user.id,
        clientName: finalClientName,
        clientEmail: finalClientEmail,
        clientPhone: clientPhone || null,
        token,
        status: 'PENDING',
        documentRequirements: {
          create: documentTitles.map((title) => ({
            title: title.trim(),
            isRequired: true,
            status: 'WAITING',
          })),
        },
      },
      include: {
        documentRequirements: true,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const depositLink = `${appUrl}/d/${token}`;

    const hasRealEmail = clientEmail && clientEmail.includes('@') && !clientEmail.endsWith('@fylinx.com');

    if (sendNotification && hasRealEmail) {
      await sendReminderEmail({
        to: finalClientEmail,
        clientName: finalClientName,
        companyName: user.companyName || user.name,
        folderTitle: `Dossier pour ${finalClientName}`,
        depositLink,
      });
    }

    return NextResponse.json({
      success: true,
      request: folderRequest,
      depositLink,
    });
  } catch (err) {
    console.error('[POST Request Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la création de la demande' }, { status: 500 });
  }
}
