import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { stripe, PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json(); // 'STARTER' or 'PRO'
    const targetPlan = plan === 'PRO' ? PLANS.PRO : PLANS.STARTER;

    const user = await db.user.findFirst({ where: { email: 'demo@fylynx.app' } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non identifié' }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer_email: user.email,
        line_items: [
          {
            price: targetPlan.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${appUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
        metadata: {
          userId: user.id,
          plan: plan || 'STARTER',
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Mock upgrade for testing when Stripe API key is not configured
    await db.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: plan || 'STARTER' },
    });

    return NextResponse.json({
      url: `${appUrl}/dashboard/settings?mock_success=true&plan=${plan}`,
    });
  } catch (err) {
    console.error('[Stripe Checkout Error]', err);
    return NextResponse.json({ error: 'Erreur d\'initialisation Stripe Checkout' }, { status: 500 });
  }
}
