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
  } else if (status === 'AGENCY_SCALE') {
    maxLimit = PLANS.AGENCY_SCALE.maxFolderRequests; // 300 dossiers / mois
    hasAutoReminders = true;
    hasAiVerification = true;
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
      reason: `Quota de ${maxLimit} portails de collecte actifs atteint. Passez à la formule supérieure pour étendre votre volume.`,
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

export async function getUserStorageUsage(userId: string): Promise<{
  usedBytes: number;
  maxBytes: number;
  usedFormatted: string;
  maxFormatted: string;
  percentage: number;
  allowed: boolean;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, role: true },
  });

  const status = user?.subscriptionStatus || 'STARTER';
  let maxBytes = 5 * 1024 * 1024 * 1024; // 5 Go default for Starter

  if (status === 'PRO') {
    maxBytes = 500 * 1024 * 1024 * 1024; // 500 Go
  } else if (status === 'AI_ENTERPRISE') {
    maxBytes = 1000 * 1024 * 1024 * 1024; // 1 To (1000 Go)
  } else if (status === 'AGENCY_SCALE' || user?.role === 'ADMIN') {
    maxBytes = 2000 * 1024 * 1024 * 1024; // 2 To + Google Drive Master
  }

  // Calculate sum of fileSize across all uploaded files
  const files = await db.documentFile.findMany({
    where: {
      documentRequirement: {
        folderRequest: {
          userId,
        },
      },
    },
    select: { fileSize: true },
  });

  const usedBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0);
  const percentage = Math.min(100, Math.round((usedBytes / maxBytes) * 100));

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1) + ' To';
    }
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' Go';
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
    }
    return (bytes / 1024).toFixed(1) + ' Ko';
  };

  return {
    usedBytes,
    maxBytes,
    usedFormatted: formatSize(usedBytes),
    maxFormatted: status === 'AGENCY_SCALE' || status === 'AI_ENTERPRISE' ? (status === 'AGENCY_SCALE' ? '2 To + Drive Master' : '1 To') : formatSize(maxBytes),
    percentage,
    allowed: usedBytes < maxBytes,
  };
}
