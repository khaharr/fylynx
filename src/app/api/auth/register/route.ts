import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Sliding Window Rate Limiter Map for IP attempts (Max 5 registrations / 15 minutes)
const registrationIPTracker = new Map<string, { count: number; resetAt: number }>();

const registerSchema = z
  .object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Adresse email invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Za-z]/, 'Le mot de passe doit contenir au moins une lettre')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
    companyName: z.string().optional(),
    captchaVerified: z.boolean().optional(),
    honeypot: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export async function POST(req: Request) {
  try {
    // Extract Client IP for Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const nowMs = Date.now();

    // 1. Rate Limiting Check (Max 5 registration attempts per IP per 15 minutes)
    const ipData = registrationIPTracker.get(ip);
    if (ipData) {
      if (nowMs < ipData.resetAt) {
        if (ipData.count >= 5) {
          return NextResponse.json(
            {
              error: 'Trop de tentatives de création de compte depuis votre réseau. Veuillez patienter 15 minutes.',
            },
            { status: 429 }
          );
        }
        ipData.count += 1;
      } else {
        registrationIPTracker.set(ip, { count: 1, resetAt: nowMs + 15 * 60 * 1000 });
      }
    } else {
      registrationIPTracker.set(ip, { count: 1, resetAt: nowMs + 15 * 60 * 1000 });
    }

    const body = await req.json();

    // 2. Anti-Bot Honeypot Trap Check
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.warn(`[Anti-Bot Honeypot Triggered] Fake bot registration attempt from IP ${ip}`);
      // Silent fake response for bots
      return NextResponse.json({ success: true, message: 'Compte créé' });
    }

    // 3. Captcha Checkbox Verification Check
    if (body.captchaVerified !== true) {
      return NextResponse.json(
        { error: 'Veuillez cocher la case "Je ne suis pas un robot" pour valider l\'inscription.' },
        { status: 400 }
      );
    }

    // 4. Zod Schema Validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const errorMessage = firstIssue ? firstIssue.message : 'Données de formulaire invalides';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, password, companyName } = parsed.data;

    // 5. Disposable Email Blocking List
    const emailDomain = email.split('@')[1]?.toLowerCase() || '';
    const tempDomains = [
      'yopmail.com',
      'yopmail.fr',
      'mailinator.com',
      'tempmail.com',
      '10minutemail.com',
      'dispostable.com',
      'trashmail.com',
      'guerrillamail.com',
      'sharklasers.com',
      'dropmail.me',
      'getnada.com',
      'tempmailo.com',
      'temp-mail.org',
    ];
    if (tempDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Les adresses e-mail temporaires ne sont pas autorisées pour créer un compte professionnel.' },
        { status: 400 }
      );
    }

    // 6. Check existing user email
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email. Veuillez vous connecter.' },
        { status: 400 }
      );
    }

    // 7. Check if company claimed trial previously
    let isTrialEligible = true;
    if (companyName && companyName.trim().length > 2) {
      const existingCompany = await db.user.findFirst({
        where: {
          companyName: {
            equals: companyName.trim(),
            mode: 'insensitive',
          },
        },
      });
      if (existingCompany) {
        isTrialEligible = false;
      }
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();
    const trialEndsAt = isTrialEligible
      ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      : now;

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        companyName: companyName || null,
        subscriptionStatus: 'STARTER',
        trialEndsAt,
      },
    });

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
        isTrialEligible,
      },
    });
  } catch (err) {
    console.error('[Register Error]', err);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}
