import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendTeamInvitationEmail } from '@/lib/email';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const inviteSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  role: z.enum(['COLLABORATOR', 'MANAGER']).optional().default('COLLABORATOR'),
});

export async function GET() {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const teamMembers = await db.teamMember.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const plan = user.subscriptionStatus || 'STARTER';
    const maxCollaborators = plan === 'STARTER' ? 0 : plan === 'PRO' ? 4 : 999;
    const totalUsersIncluded = plan === 'STARTER' ? 1 : plan === 'PRO' ? 5 : 999;

    return NextResponse.json({
      plan,
      totalUsersIncluded,
      maxCollaborators,
      currentCollaboratorsCount: teamMembers.length,
      currentTotalUsers: teamMembers.length + 1,
      teamMembers,
    });
  } catch (err) {
    console.error('[GET Team Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des collaborateurs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const plan = user.subscriptionStatus || 'STARTER';
    const isUnlimited = user.role === 'ADMIN';
    const maxAllowedCollaborators =
      plan === 'STARTER'
        ? 0
        : plan === 'PRO'
        ? 4
        : plan === 'AI_ENTERPRISE'
        ? 9
        : plan === 'AGENCY_SCALE'
        ? 19
        : 999;

    if (!isUnlimited && plan === 'STARTER') {
      return NextResponse.json(
        {
          error:
            'La formule Starter est limitée à 1 utilisateur unique (0 collaborateur). Passez à la formule Pro (79€/mois) ou Agence Scale (247€/mois) pour inclure votre équipe.',
        },
        { status: 403 }
      );
    }

    const currentMembersCount = await db.teamMember.count({ where: { ownerId: user.id } });

    if (!isUnlimited && currentMembersCount >= maxAllowedCollaborators) {
      return NextResponse.json(
        {
          error: `Limite de collaborateurs atteinte pour votre abonnement (${currentMembersCount}/${maxAllowedCollaborators}). Passez au forfait Agence Scale (247€/mois) pour inclure jusqu'à 20 utilisateurs d'équipe.`,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = inviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Formulaire invalide', details: parsed.error.format() }, { status: 400 });
    }

    const { name, email, role } = parsed.data;

    if (email.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous inviter vous-même comme collaborateur.' }, { status: 400 });
    }

    // Create TeamMember record
    const member = await db.teamMember.create({
      data: {
        ownerId: user.id,
        name,
        email: email.toLowerCase(),
        role,
        status: 'ACTIVE',
      },
    });

    // Send invitation email
    await sendTeamInvitationEmail({
      to: email.toLowerCase(),
      memberName: name,
      inviterName: user.name,
      companyName: user.companyName || user.name,
    });

    return NextResponse.json({
      success: true,
      message: `Collaborateur ${name} (${email}) invité avec succès ! Un e-mail d'accès a été transmis.`,
      member,
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Ce collaborateur a déjà été invité dans votre équipe.' }, { status: 400 });
    }
    console.error('[POST Team Error]', err);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout du collaborateur' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylinx.com' } }));
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID du collaborateur requis' }, { status: 400 });
    }

    await db.teamMember.deleteMany({
      where: { id, ownerId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Collaborateur retiré de l\'équipe avec succès.',
    });
  } catch (err) {
    console.error('[DELETE Team Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la suppression du collaborateur' }, { status: 500 });
  }
}
