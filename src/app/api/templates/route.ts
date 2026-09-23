import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    let user = await getCurrentUser();
    if (!user) {
      user = await db.user.findFirst();
    }
    if (!user) {
      return NextResponse.json({ templates: [] });
    }

    const templates = await db.folderTemplate.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = templates.map((t) => ({
      id: t.id,
      name: t.name,
      requiredDocTypes: JSON.parse(t.requiredDocTypes || '[]') as string[],
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ templates: parsed });
  } catch (err) {
    console.error('[GET Templates Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des modèles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let user = await getCurrentUser();
    if (!user) {
      user = await db.user.findFirst();
    }
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { name, requiredDocTypes } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Le nom du modèle est obligatoire' }, { status: 400 });
    }

    const template = await db.folderTemplate.create({
      data: {
        userId: user.id,
        name: name.trim(),
        requiredDocTypes: JSON.stringify(requiredDocTypes || []),
      },
    });

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        requiredDocTypes: JSON.parse(template.requiredDocTypes || '[]'),
        createdAt: template.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('[POST Template Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la création du modèle' }, { status: 500 });
  }
}
