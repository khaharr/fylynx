import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
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

    // Subscription check: PRO, AI_ENTERPRISE, ADMIN
    const canUseBranding =
      dbUser.subscriptionStatus === 'PRO' ||
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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validate image mime type
    const validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format de fichier non supporté. Veuillez envoyer une image (PNG, JPG, SVG, WEBP).' },
        { status: 400 }
      );
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Le fichier dépasse la taille maximale autorisée (5 Mo).' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to public/uploads/logos directory
    const logosDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
    }

    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
    const fileName = `logo_${dbUser.id}_${Date.now()}.${ext}`;
    const filePath = path.join(logosDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/logos/${fileName}`;

    // Update user record in DB
    await db.user.update({
      where: { id: dbUser.id },
      data: {
        companyLogo: publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      logoUrl: publicUrl,
    });
  } catch (error) {
    console.error('Erreur API upload logo:', error);
    return NextResponse.json({ error: 'Erreur lors du téléchargement du logo' }, { status: 500 });
  }
}
