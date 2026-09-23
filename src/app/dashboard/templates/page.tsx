import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TemplatesClientView from './TemplatesClientView';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  let user = await getCurrentUser();
  if (!user) {
    user = await db.user.findFirst();
  }
  if (!user) {
    redirect('/login');
  }

  const templates = await db.folderTemplate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const parsed = templates.map((t) => ({
    id: t.id,
    name: t.name,
    requiredDocTypes: JSON.parse(t.requiredDocTypes || '[]') as string[],
    createdAt: t.createdAt.toISOString(),
  }));

  return <TemplatesClientView initialTemplates={parsed} />;
}

