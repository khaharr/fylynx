import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth';
import IntegrationsClientView from './IntegrationsClientView';

export default async function IntegrationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Redirect users who do not have the ultimate AGENCY_SCALE subscription or ADMIN role
  if (user.subscriptionStatus !== 'AGENCY_SCALE' && user.role !== 'ADMIN') {
    redirect('/dashboard/settings');
  }

  return (
    <IntegrationsClientView
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        role: user.role,
      }}
    />
  );
}
