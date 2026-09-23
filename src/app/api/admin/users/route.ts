import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const users = await db.user.findMany({
      include: {
        _count: {
          select: { folderRequests: true, folderTemplates: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const requests = await db.folderRequest.findMany({
      include: {
        user: { select: { name: true, companyName: true, email: true } },
        documentRequirements: { include: { files: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ users, requests });
  } catch (err) {
    console.error('[Admin API Error]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const { userId, subscriptionStatus } = await req.json();
    if (!userId || !subscriptionStatus) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { subscriptionStatus },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('[Admin User Update Error]', err);
    return NextResponse.json({ error: 'Erreur de mise à jour' }, { status: 500 });
  }
}
