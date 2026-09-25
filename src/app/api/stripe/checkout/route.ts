import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { stripe, PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { plan, billingPeriod = 'monthly' } = await req.json(); // 'STARTER', 'PRO', 'AGENCY_SCALE', or 'AI_ENTERPRISE'
    
    let targetPlan = PLANS.STARTER;
    if (plan === 'PRO') targetPlan = PLANS.PRO;
    if (plan === 'AGENCY_SCALE') targetPlan = PLANS.AGENCY_SCALE;
    if (plan === 'AI_ENTERPRISE') targetPlan = PLANS.AI_ENTERPRISE;

    const isAnnual = billingPeriod === 'annual';
    const priceId = isAnnual ? targetPlan.priceIdAnnual : targetPlan.priceIdMonthly;

    const sessionUser = await getCurrentUser();
    let user = sessionUser ? await db.user.findUnique({ where: { id: sessionUser.id } }) : null;
    if (!user) {
      user = await db.user.findFirst();
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non identifié. Veuillez vous connecter.' }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer_email: user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${appUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}&success=true&plan=${plan || 'STARTER'}`,
        cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
        metadata: {
          userId: user.id,
          plan: plan || 'STARTER',
          billingPeriod: isAnnual ? 'annual' : 'monthly',
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Mock upgrade/subscription activation for testing when Stripe API key is not configured
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: plan || 'STARTER',
        trialEndsAt: null,
        stripeSubscriptionId: user.stripeSubscriptionId || 'sub_active_starter',
      },
    });

    return NextResponse.json({
      url: `${appUrl}/dashboard/settings?mock_success=true&plan=${plan}&period=${billingPeriod}`,
    });
  } catch (err) {
    console.error('[Stripe Checkout Error]', err);
    return NextResponse.json({ error: 'Erreur d\'initialisation Stripe Checkout' }, { status: 500 });
  }
}
