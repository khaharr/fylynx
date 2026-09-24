import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await db.user.findFirst({ where: { email: 'demo@fylinx.com' } });
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (user.stripeCustomerId && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${appUrl}/dashboard/settings`,
      });
      return NextResponse.json({ url: portalSession.url });
    }

    return NextResponse.json({ url: `${appUrl}/dashboard/settings` });
  } catch (err) {
    console.error('[Stripe Portal Error]', err);
    return NextResponse.json({ error: 'Erreur portail abonné' }, { status: 500 });
  }
}
