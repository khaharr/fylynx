import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // Only PRO, AGENCY_SCALE, AI_ENTERPRISE, or ADMIN can use custom white-label branding
    const canUseBranding =
      dbUser.subscriptionStatus === 'PRO' ||
      dbUser.subscriptionStatus === 'AGENCY_SCALE' ||
      dbUser.subscriptionStatus === 'AI_ENTERPRISE' ||
      dbUser.role === 'ADMIN';

    if (!canUseBranding) {
      return NextResponse.json(
        {
          error:
            'La personnalisation du logo et des pages de liens est réservée aux forfaits Pro Illimité (79€/mois) et IA Enterprise.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { companyLogo, customWelcomeMsg, brandColor } = body;

    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: {
        companyLogo: typeof companyLogo === 'string' ? companyLogo.trim() : null,
        customWelcomeMsg: typeof customWelcomeMsg === 'string' ? customWelcomeMsg.trim() : null,
        brandColor: typeof brandColor === 'string' && brandColor ? brandColor.trim() : '#4f46e5',
      },
      select: {
        id: true,
        companyLogo: true,
        customWelcomeMsg: true,
        brandColor: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erreur API user/branding:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour des paramètres de marque' }, { status: 500 });
  }
}
