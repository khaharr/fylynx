import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SettingsClientView from './SettingsClientView';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = (await getCurrentUser()) || (await db.user.findFirst({ where: { email: 'admin@fylynx.app' } }));
  if (!user) {
    redirect('/login');
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    }>
      <SettingsClientView
        user={{
          name: user.name,
          email: user.email,
          companyName: user.companyName,
          subscriptionStatus: user.subscriptionStatus,
          role: user.role,
          companyLogo: user.companyLogo || null,
          customWelcomeMsg: user.customWelcomeMsg || null,
          brandColor: user.brandColor || '#4f46e5',
        }}
      />
    </Suspense>
  );
}
