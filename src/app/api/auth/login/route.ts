import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Rate Limiter Map for IP login attempts (Max 10 attempts / 15 minutes)
const loginIPTracker = new Map<string, { count: number; resetAt: number }>();

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const nowMs = Date.now();

    // 1. Anti Brute-Force Rate Limiting (Max 10 attempts per IP per 15 minutes)
    const ipData = loginIPTracker.get(ip);
    if (ipData) {
      if (nowMs < ipData.resetAt) {
        if (ipData.count >= 10) {
          return NextResponse.json(
            {
              error: 'Trop de tentatives de connexion échouées. Veuillez patienter 15 minutes avant de réessayer.',
            },
            { status: 429 }
          );
        }
        ipData.count += 1;
      } else {
        loginIPTracker.set(ip, { count: 1, resetAt: nowMs + 15 * 60 * 1000 });
      }
    } else {
      loginIPTracker.set(ip, { count: 1, resetAt: nowMs + 15 * 60 * 1000 });
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Identifiants invalides', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user.id);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}
