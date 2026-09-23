import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth';
import { checkUserQuota } from '@/lib/quota';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const quota = await checkUserQuota(user.id);

  return NextResponse.json({
    user: {
      ...user,
      isTrialActive: quota.isTrialActive,
      trialDaysLeft: quota.trialDaysLeft,
      activeCount: quota.activeCount,
      maxLimit: quota.maxLimit,
    },
  });
}
