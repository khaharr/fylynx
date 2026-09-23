import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    const user = await seedDatabase();
    return NextResponse.json({ success: true, message: 'Base de données initialisée', user: user.email });
  } catch (err) {
    console.error('[Seed Error]', err);
    return NextResponse.json({ error: 'Erreur d\'initialisation' }, { status: 500 });
  }
}
