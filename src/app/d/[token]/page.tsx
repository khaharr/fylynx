import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PublicDepositorView from '@/components/PublicDepositorView';

export const revalidate = 0; // Dynamic route

export default async function PublicFolderPage({ params }: { params: { token: string } }) {
  const folderRequest = await db.folderRequest.findUnique({
    where: { token: params.token },
    include: {
      user: {
        select: {
          name: true,
          companyName: true,
          subscriptionStatus: true,
          role: true,
          companyLogo: true,
          customWelcomeMsg: true,
          brandColor: true,
        },
      },
      documentRequirements: {
        include: {
          files: true,
        },
      },
    },
  });

  if (!folderRequest) {
    notFound();
  }

  return <PublicDepositorView initialFolder={folderRequest} />;
}
