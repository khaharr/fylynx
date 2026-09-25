import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Groq manquante dans la configuration serveur' },
        { status: 500 }
      );
    }

    const systemPrompt = `Tu es Sarah, l'assistante commerciale et technique virtuelle officielle de Fylynx (SaaS B2B de collecte & vérification automatisée de pièces justificatives).
Ton objectif est d'accueillir chaleureusement les visiteurs, d'expliquer le fonctionnement de la plateforme et d'inciter à tester gratuitement l'application pendant 14 jours sans carte bancaire.

INFORMATIONS CLÉS DE FYLYNX :
- Solution : Plateforme SaaS 100% conforme RGPD qui remplace les relances manuelles par e-mail et vérifie les pièces justificatives avec l'IA.
- Fonctionnalités : Liens uniques de dépôt mobile sans création de compte client, inspection IA des CNI/Passeports (bandes MRZ), récence des justificatifs de domicile (< 3 mois), fiches de paie, relances automatiques quotidiennes par e-mail, marque blanche, export ZIP 1-clic.
- Tarifs :
  * Starter : 29 €/mois (10 portails/mois, 1 utilisateur, 5 Go stockage)
  * Pro Illimité : 79 €/mois (Portails ILLIMITÉS, 5 utilisateurs, 500 Go, relances automatiques, marque blanche)
  * IA Enterprise : 149 €/mois (Inspection IA Vision CNI/Passeports, anti-fraude, 10 utilisateurs, 1 To)
  * Agence Scale : 247 €/mois (Contacts ILLIMITÉS, 20 utilisateurs, Zapier, Make, Notion & API Webhooks)
- Essai gratuit : 14 jours offerts sans carte bancaire à l'inscription.

RÈGLES DE RÉPONSE :
- Réponds toujours en Français parfait, de façon concise, enthousiaste et professionnelle (2 à 4 phrases grand maximum).
- Ajoute toujours une touche d'encouragement à démarrer l'essai gratuit.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history.slice(-4) : []),
      { role: 'user', content: message },
    ];

    // Active Groq models verified for this API key
    const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
    let aiResponse = '';

    for (const model of models) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.6,
            max_tokens: 350,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            aiResponse = content;
            break;
          }
        }
      } catch (e) {
        console.warn(`[Groq AI] Échec modèle ${model}, tentative modèle suivant...`);
      }
    }

    if (!aiResponse) {
      aiResponse = "Merci pour votre message ! Je suis Sarah de l'équipe Fylynx. Pour découvrir toutes nos fonctionnalités de collecte automatisée, vous pouvez démarrer votre essai gratuit de 14 jours sans carte bancaire dès maintenant.";
    }

    return NextResponse.json({
      success: true,
      reply: aiResponse,
    });
  } catch (error: any) {
    console.error('[Groq Chat API] Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors du traitement de la réponse AI',
      },
      { status: 500 }
    );
  }
}
