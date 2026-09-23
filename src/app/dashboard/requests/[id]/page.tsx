import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import RequestDetailClientView from './RequestDetailClientView';

export const revalidate = 0;

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const request = await db.folderRequest.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, companyName: true, subscriptionStatus: true, role: true } },
      documentRequirements: {
        include: { files: true },
      },
    },
  });

  if (!request) {
    notFound();
  }

  return <RequestDetailClientView initialRequest={request} />;
}
