import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const request = await db.folderRequest.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, companyName: true, email: true } },
        documentRequirements: {
          include: { files: true },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 });
    }

    return NextResponse.json({ request });
  } catch (err) {
    console.error('[GET Request Detail Error]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.folderRequest.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE Request Error]', err);
    return NextResponse.json({ error: 'Impossible de supprimer ce dossier' }, { status: 500 });
  }
}
