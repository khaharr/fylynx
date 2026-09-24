import { db } from '@/lib/db';

export async function triggerFolderCompletedWebhook(folderId: string) {
  try {
    const folder = await db.folderRequest.findUnique({
      where: { id: folderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            companyName: true,
            name: true,
            subscriptionStatus: true,
            role: true,
            webhookUrl: true,
            webhookEvents: true,
            notionToken: true,
            notionDatabaseId: true,
          },
        },
        documentRequirements: {
          include: { files: true },
        },
      },
    });

    if (!folder) return;

    // Feature gating check: Only AGENCY_SCALE or ADMIN can trigger webhooks/notion integrations
    const canUseIntegrations =
      folder.user.subscriptionStatus === 'AGENCY_SCALE' ||
      folder.user.role === 'ADMIN';

    if (!canUseIntegrations) return;

    const payload = {
      event: 'request.completed',
      timestamp: new Date().toISOString(),
      data: {
        requestId: folder.id,
        clientName: folder.clientName,
        clientEmail: folder.clientEmail,
        clientPhone: folder.clientPhone,
        status: folder.status,
        completedAt: folder.updatedAt,
        companyName: folder.user.companyName || folder.user.name,
        documentRequirements: folder.documentRequirements.map((req) => ({
          id: req.id,
          title: req.title,
          status: req.status,
          aiVerified: req.aiVerified,
          files: req.files.map((f) => ({
            id: f.id,
            fileName: f.fileName,
            fileSize: f.fileSize,
            mimeType: f.mimeType,
          })),
        })),
      },
    };

    // 1. HTTP Webhook Dispatch (Zapier, Make, Hubspot, Custom Webhooks)
    if (folder.user.webhookUrl && folder.user.webhookUrl.startsWith('http')) {
      try {
        await fetch(folder.user.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Fylynx-Webhook-Engine/1.0',
            'X-Fylynx-Event': 'request.completed',
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('[Webhook Dispatch Failed]', folder.user.webhookUrl, err);
      }
    }

    // 2. Direct Notion API Integration
    if (folder.user.notionToken && folder.user.notionDatabaseId) {
      try {
        await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${folder.user.notionToken.trim()}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
          body: JSON.stringify({
            parent: { database_id: folder.user.notionDatabaseId.trim() },
            properties: {
              Name: {
                title: [
                  {
                    text: {
                      content: `[Dossier Validé] ${folder.clientName}`,
                    },
                  },
                ],
              },
              Email: {
                email: folder.clientEmail || 'client@fylinx.com',
              },
              Statut: {
                select: {
                  name: 'Complété',
                },
              },
            },
          }),
        });
      } catch (err) {
        console.error('[Notion Integration Failed]', err);
      }
    }
  } catch (err) {
    console.error('[Trigger Webhook Error]', err);
  }
}
