import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

const forgotSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    // Always respond with success to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse email existe dans notre système, un lien de réinitialisation vous a été envoyé.',
      });
    }

    // Generate random reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    // Send reset email via Resend
    await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetLink,
    });

    return NextResponse.json({
      success: true,
      message: 'Un e-mail de réinitialisation de mot de passe a été envoyé avec succès.',
    });
  } catch (err) {
    console.error('[Forgot Password Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la demande de réinitialisation' }, { status: 500 });
  }
}
