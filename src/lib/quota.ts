import { db } from '@/lib/db';
import { PLANS } from '@/lib/stripe';

export async function checkUserQuota(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  activeCount: number;
  maxLimit: number;
  status: string;
  isTrialActive: boolean;
  trialDaysLeft: number;
  hasAutoReminders: boolean;
  hasAiVerification: boolean;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, role: true, trialEndsAt: true, stripeSubscriptionId: true },
  });

  if (!user) {
    return {
      allowed: false,
      reason: 'Utilisateur introuvable.',
      activeCount: 0,
      maxLimit: 0,
      status: 'UNKNOWN',
      isTrialActive: false,
      trialDaysLeft: 0,
      hasAutoReminders: false,
      hasAiVerification: false,
    };
  }

  // Admin bypass
  if (user.role === 'ADMIN') {
    return {
      allowed: true,
      activeCount: 0,
      maxLimit: Infinity,
      status: 'AI_ENTERPRISE',
      isTrialActive: false,
      trialDaysLeft: 0,
      hasAutoReminders: true,
      hasAiVerification: true,
    };
  }

  const status = user.subscriptionStatus || 'STARTER';

  if (status === 'CANCELED' || status === 'EXPIRED') {
    return {
      allowed: false,
      reason: 'Votre abonnement est inactif ou résilié. Veuillez choisir un forfait dans la section Abonnement.',
      activeCount: 0,
      maxLimit: 0,
      status,
      isTrialActive: false,
      trialDaysLeft: 0,
      hasAutoReminders: false,
      hasAiVerification: false,
    };
  }

  // 14-day trial check for STARTER without active Stripe subscription
  let isTrialActive = false;
  let trialDaysLeft = 0;

  if (status === 'STARTER' && user.trialEndsAt && !user.stripeSubscriptionId) {
    const now = Date.now();
    const endsAt = new Date(user.trialEndsAt).getTime();
    const diffMs = endsAt - now;
    trialDaysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    isTrialActive = trialDaysLeft > 0;

    if (trialDaysLeft <= 0) {
      return {
        allowed: false,
        reason: 'Votre période d\'essai gratuit de 14 jours sur le forfait Starter est terminée. Veuillez vous abonner pour continuer à créer et gérer vos dossiers.',
        activeCount: 0,
        maxLimit: 0,
        status: 'EXPIRED',
        isTrialActive: false,
        trialDaysLeft: 0,
        hasAutoReminders: false,
        hasAiVerification: false,
      };
    }
  }

  let maxLimit = PLANS.STARTER.maxFolderRequests; // 30 pour Starter
  let hasAutoReminders = false;
  let hasAiVerification = false;

  if (status === 'PRO') {
    maxLimit = PLANS.PRO.maxFolderRequests; // Illimité
    hasAutoReminders = true;
  } else if (status === 'AI_ENTERPRISE') {
    maxLimit = PLANS.AI_ENTERPRISE.maxFolderRequests; // Illimité
    hasAutoReminders = true;
    hasAiVerification = true;
  }

  const activeCount = await db.folderRequest.count({
    where: {
      userId,
      status: { in: ['PENDING', 'IN_REVIEW'] },
    },
  });

  if (activeCount >= maxLimit) {
    return {
      allowed: false,
      reason: `Quota de ${maxLimit} dossiers actifs atteint sur le forfait Starter. Passez au forfait Pro Illimité (79€/mois) pour créer des dossiers illimités.`,
      activeCount,
      maxLimit,
      status,
      isTrialActive,
      trialDaysLeft,
      hasAutoReminders,
      hasAiVerification,
    };
  }

  return {
    allowed: true,
    activeCount,
    maxLimit,
    status,
    isTrialActive,
    trialDaysLeft,
    hasAutoReminders,
    hasAiVerification,
  };
}
