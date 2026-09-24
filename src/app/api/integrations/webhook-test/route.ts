import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { webhookUrl } = await req.json();

    if (!webhookUrl || typeof webhookUrl !== 'string' || !webhookUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Veuillez saisir une URL de Webhook valide (http://... ou https://...)' }, { status: 400 });
    }

    const testPayload = {
      event: 'request.completed.test',
      timestamp: new Date().toISOString(),
      message: 'Ceci est un test d\'intégration Webhook depuis Fylynx.',
      data: {
        requestId: 'req_demo_test_123456',
        clientName: 'Jean Dupont (Exemple Test)',
        clientEmail: 'jean.dupont.test@fylinx.com',
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        companyName: sessionUser.companyName || sessionUser.name,
        documents: [
          { title: 'Carte Nationale d\'Identité (CNI)', status: 'VALIDATED', aiVerified: true },
          { title: 'Justificatif de domicile', status: 'VALIDATED', aiVerified: true },
        ],
      },
    };

    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Fylynx-Webhook-Engine/1.0',
        'X-Fylynx-Event': 'request.completed.test',
      },
      body: JSON.stringify(testPayload),
    });

    if (res.ok) {
      return NextResponse.json({
        success: true,
        message: `Webhook test envoyé avec succès ! Code HTTP retourné par votre serveur : ${res.status}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Votre serveur Webhook a retourné une erreur HTTP ${res.status}. Vérifiez votre endpoint.`,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({
      success: false,
      message: `Impossible de contacter l'URL du Webhook : ${errorMsg}`,
    });
  }
}
