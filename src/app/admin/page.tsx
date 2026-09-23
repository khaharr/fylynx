import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ensureAdminUser } from '@/lib/seed-admin';
import { db } from '@/lib/db';
import AdminClientView from './AdminClientView';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Ensure the primary admin user exists in DB
  await ensureAdminUser();

  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await db.user.findMany({
    include: {
      _count: {
        select: { folderRequests: true, folderTemplates: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const requests = await db.folderRequest.findMany({
    include: {
      user: { select: { name: true, companyName: true, email: true } },
      documentRequirements: { include: { files: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const parsedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    companyName: u.companyName,
    role: u.role,
    subscriptionStatus: u.subscriptionStatus,
    createdAt: u.createdAt.toISOString(),
    requestCount: u._count.folderRequests,
  }));

  const parsedRequests = requests.map((r) => ({
    id: r.id,
    clientName: r.clientName,
    clientEmail: r.clientEmail,
    token: r.token,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    userName: r.user.name,
    userEmail: r.user.email,
    docCount: r.documentRequirements.length,
  }));

  const googleDriveConnected = !!process.env.GOOGLE_REFRESH_TOKEN;

  return (
    <AdminClientView
      initialUsers={parsedUsers}
      initialRequests={parsedRequests}
      googleDriveConnected={googleDriveConnected}
    />
  );
}
