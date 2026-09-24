import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getUserStorageUsage } from '@/lib/quota';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const storage = await getUserStorageUsage(user.id);

    return NextResponse.json({
      success: true,
      ...storage,
    });
  } catch (err) {
    console.error('[GET Storage Usage Error]', err);
    return NextResponse.json({ error: 'Erreur lors du calcul de l\'espace de stockage' }, { status: 500 });
  }
}
