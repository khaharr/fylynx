import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import DashboardClientView from './DashboardClientView';

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const requests = await db.folderRequest.findMany({
    where: { userId: user.id },
    include: {
      documentRequirements: {
        include: { files: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const templates = await db.folderTemplate.findMany({
    where: { userId: user.id },
  });

  const parsedTemplates = templates.map((t) => ({
    id: t.id,
    name: t.name,
    requiredDocTypes: JSON.parse(t.requiredDocTypes || '[]') as string[],
  }));

  return (
    <DashboardClientView
      initialRequests={requests}
      templates={parsedTemplates}
      userPlan={user.subscriptionStatus}
      userRole={user.role}
      userName={user.name}
    />
  );
}
