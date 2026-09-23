import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const PLANS = {
  STARTER: {
    name: 'Starter (14 jours d\'essai gratuit)',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_starter_29',
    maxFolderRequests: 30,
    hasAutoReminders: false,
    hasAiVerification: false,
    trialDays: 14,
    features: [
      'Jusqu\'à 30 dossiers actifs / mois',
      'Modèles de dossiers personnalisés',
      'Lien unique de dépôt mobile sans création de compte',
      'Relances manuelles par notification e-mail',
      'Exportation ZIP 1-clic des pièces',
    ],
  },
  PRO: {
    name: 'Pro Illimité',
    price: 79,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_79',
    maxFolderRequests: Infinity,
    hasAutoReminders: true, // Relances automatiques activées sur la formule 79€
    hasAiVerification: false,
    trialDays: 0,
    features: [
      'Dossiers actifs illimités',
      'Relances automatiques quotidiennes par Email (24h)',
      'Exports ZIP groupés',
      'Marque blanche / personnalisation entreprise',
      'Support prioritaire 7j/7',
      'Modèles de dossiers personnalisés',
      'Lien unique de dépôt mobile sans création de compte',

      

    ],
  },
  AI_ENTERPRISE: {
    name: 'IA Enterprise',
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AI_PRICE_ID || 'price_ai_149',
    maxFolderRequests: Infinity,
    hasAutoReminders: true,
    hasAiVerification: true, // Vérification IA automatique en temps réel
    trialDays: 0,
    features: [
      'Toutes les fonctionnalités Pro Illimité',
      'Vérification automatique par IA des cartes d\'identité (Bandes MRZ ISO 7501)',
      'Contrôle automatique de la récence des justificatifs de domicile (-3 mois)',
      'Détection automatique et extraction des bulletins de paie',
      'Score de confiance et rapport d\'audit IA en temps réel',
    ],
  },
};
