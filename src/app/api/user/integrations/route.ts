import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        subscriptionStatus: true,
        role: true,
        apiKey: true,
        webhookUrl: true,
        webhookEvents: true,
        notionToken: true,
        notionDatabaseId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const canUseIntegrations =
      user.subscriptionStatus === 'AGENCY_SCALE' ||
      user.role === 'ADMIN';

    return NextResponse.json({
      canUseIntegrations,
      apiKey: user.apiKey || null,
      webhookUrl: user.webhookUrl || '',
      webhookEvents: user.webhookEvents || 'request.completed',
      hasNotionToken: Boolean(user.notionToken),
      notionDatabaseId: user.notionDatabaseId || '',
    });
  } catch (err) {
    console.error('[GET Integrations Error]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const canUseIntegrations =
      user.subscriptionStatus === 'AGENCY_SCALE' ||
      user.role === 'ADMIN';

    if (!canUseIntegrations) {
      return NextResponse.json(
        { error: 'Les intégrations Zapier, Webhooks et Notion sont réservées exclusivement au forfait Agence Scale (247€/mois).' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { webhookUrl, webhookEvents, notionToken, notionDatabaseId, generateApiKey } = body;

    const dataToUpdate: Record<string, string | null> = {};

    if (typeof webhookUrl === 'string') {
      dataToUpdate.webhookUrl = webhookUrl.trim().length > 0 ? webhookUrl.trim() : null;
    }

    if (typeof webhookEvents === 'string') {
      dataToUpdate.webhookEvents = webhookEvents.trim();
    }

    if (typeof notionToken === 'string') {
      dataToUpdate.notionToken = notionToken.trim().length > 0 ? notionToken.trim() : null;
    }

    if (typeof notionDatabaseId === 'string') {
      dataToUpdate.notionDatabaseId = notionDatabaseId.trim().length > 0 ? notionDatabaseId.trim() : null;
    }

    if (generateApiKey) {
      dataToUpdate.apiKey = 'fy_live_' + crypto.randomBytes(16).toString('hex');
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: {
        apiKey: true,
        webhookUrl: true,
        webhookEvents: true,
        notionToken: true,
        notionDatabaseId: true,
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: updatedUser.apiKey,
      webhookUrl: updatedUser.webhookUrl || '',
      webhookEvents: updatedUser.webhookEvents || 'request.completed',
      hasNotionToken: Boolean(updatedUser.notionToken),
      notionDatabaseId: updatedUser.notionDatabaseId || '',
    });
  } catch (err) {
    console.error('[PATCH Integrations Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour des intégrations' }, { status: 500 });
  }
}
