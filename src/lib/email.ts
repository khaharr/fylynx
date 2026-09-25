import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const isDummyKey =
  !resendApiKey ||
  resendApiKey.includes('your_') ||
  resendApiKey.includes('placeholder') ||
  resendApiKey === 're_123456789' ||
  resendApiKey.length < 15;

const resend = !isDummyKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@fylinx.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function getEmailHeaderHtml() {
  return `
    <div style="text-align: center; padding: 24px 0 20px 0; border-bottom: 2px solid #026fc7; margin-bottom: 28px;">
      <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
        <tr>
          <td align="center" style="vertical-align: middle;">
            <img src="${appUrl}/fylynx-logo.png" alt="Fylynx Logo" height="52" style="display: block; max-height: 52px; width: auto; border: 0; outline: none; text-decoration: none; margin: 0 auto;" />
          </td>
          <td align="left" style="vertical-align: middle; padding-left: 14px;">
            <div style="font-size: 26px; font-weight: 900; color: #026fc7; letter-spacing: -0.5px; line-height: 1.1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">FYLYNX<span style="color: #38bdf8;">.app</span></div>
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Collecte & Certification Documentaire Sécurisée</div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function getEmailFooterHtml(companyName = 'fylinx.com') {
  return `
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 24px 0;" />
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="font-size: 12px; color: #94a3b8; line-height: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <p style="margin: 0 0 6px 0;">Message automatique haute sécurité transmis par <strong>Fylynx SaaS</strong>.</p>
          <p style="margin: 0; color: #cbd5e1; font-size: 11px;">Vos pièces documentaires sont chiffrées en AES-256 et stockées conformément au RGPD Européen.</p>
        </td>
      </tr>
    </table>
  `;
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetLink,
}: {
  to: string;
  userName: string;
  resetLink: string;
}) {
  const subject = `Réinitialisation de votre mot de passe - fylinx.com`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 28px; color: #0f172a; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px -5px rgba(2, 111, 199, 0.08);">
      ${getEmailHeaderHtml()}
      
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 14px;">Réinitialisation de votre mot de passe</h2>
      
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 16px;">Bonjour <strong>${userName}</strong>,</p>
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 20px;">
        Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte professionnel Fylynx.
      </p>

      <div style="background-color: #f8fafc; border-left: 4px solid #026fc7; padding: 18px 20px; margin: 24px 0; border-radius: 10px;">
        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 20px;">
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe actuel reste inchangé.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background-color: #026fc7; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(2, 111, 199, 0.35);">
          Réinitialiser mon mot de passe →
        </a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 20px; text-align: center;">
        Ce lien de sécurité est valide pendant <strong>1 heure</strong>.<br/>
        Lien direct : <a href="${resetLink}" style="color: #026fc7; word-break: break-all; font-weight: 600;">${resetLink}</a>
      </p>

      ${getEmailFooterHtml()}
    </div>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });

      if (response.error) {
        if (response.error.message?.includes('testing emails to your own email address') || (response.error as any).statusCode === 403) {
          console.log(`[Resend Test Mode] Email de réinitialisation simulé pour ${to}. Lien: ${resetLink}`);
          return { success: true, simulated: true };
        }

        console.error('[Resend Error]', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[Resend Success] Email de réinitialisation envoyé à ${to}`);
      return { success: true, id: response.data?.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Resend Exception]', msg);
      return { success: false, error: msg };
    }
  }

  console.log('----------------------------------------------------');
  console.log(`[PASSWORD RESET EMAIL SIMULATION] Sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log('----------------------------------------------------');
  return { success: true, simulated: true };
}

export async function sendReminderEmail({
  to,
  clientName,
  companyName,
  folderTitle,
  depositLink,
  missingDocTitles,
  customSubject,
  customBody,
}: {
  to: string;
  clientName: string;
  companyName: string;
  folderTitle: string;
  depositLink: string;
  missingDocTitles?: string[];
  customSubject?: string | null;
  customBody?: string | null;
}) {
  const subject = customSubject
    ? customSubject
        .replace('{company_name}', companyName)
        .replace('{client_name}', clientName)
    : `Rappel : Votre dossier pour ${companyName} est incomplet`;

  const missingListHtml =
    missingDocTitles && missingDocTitles.length > 0
      ? `
    <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 18px 20px; margin: 24px 0; border-radius: 12px; border: 1px solid #e2e8f0; border-left-width: 4px;">
      <p style="margin: 0 0 10px 0; font-weight: 800; font-size: 13px; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Justificatifs manquants à transmettre :</p>
      <ul style="margin: 0; padding-left: 18px; color: #1e293b; font-size: 14px; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${missingDocTitles.map((t) => `<li style="margin-bottom: 6px;"><strong>${t}</strong></li>`).join('')}
      </ul>
    </div>
  `
      : '';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 36px 28px; color: #0f172a; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 20px 40px -15px rgba(79, 70, 229, 0.12);">
      ${getEmailHeaderHtml()}
      
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 14px; letter-spacing: -0.3px;">Rappel : Votre dossier pour ${companyName} est incomplet</h2>
      
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 14px;">Bonjour <strong>${clientName}</strong>,</p>
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 20px;">
        <strong>${companyName}</strong> vous invite à transmettre directement vos pièces justificatives pour finaliser votre dossier <strong>"${folderTitle}"</strong>.
      </p>

      ${missingListHtml}

      <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; padding: 14px 16px; border-radius: 12px; margin-bottom: 24px;">
        <p style="font-size: 13px; line-height: 20px; color: #3730a3; margin: 0; font-weight: 600;">
          📱 <strong>Dépôt mobile rapide :</strong> Prenez simplement vos pièces en photo avec votre smartphone en 1 clic. Aucun mot de passe ni création de compte nécessaire.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${depositLink}" style="background-color: #4f46e5; background-image: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 14px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4); text-align: center; width: 85%; max-width: 320px;">
          Transmettre mes pièces en 1 Clic →
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 18px; text-align: center; word-break: break-all;">
        Lien direct sécurisé et réutilisable :<br/>
        <a href="${depositLink}" style="color: #4f46e5; font-weight: 600; text-decoration: underline;">${depositLink}</a>
      </p>

      ${getEmailFooterHtml(companyName)}
    </div>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });

      if (response.error) {
        if (response.error.message?.includes('testing emails to your own email address') || (response.error as any).statusCode === 403) {
          console.log(`[Resend Test Mode] Email de relance simulé pour ${to}. Fichiers manquants: ${missingDocTitles?.join(', ') || 'N/A'}`);
          return { success: true, simulated: true };
        }

        console.error('[Resend Error]', response.error);
        return {
          success: false,
          error: response.error.message || 'Erreur d\'envoi Resend',
        };
      }

      console.log(`[Resend Success] Email de relance envoyé à ${to} (ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Resend Exception]', msg);
      return { success: false, error: msg };
    }
  }

  console.log('----------------------------------------------------');
  console.log(`[REMINDER EMAIL SIMULATION] Sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Missing docs: ${missingDocTitles?.join(', ') || 'N/A'}`);
  console.log(`Link: ${depositLink}`);
  console.log('----------------------------------------------------');
  return { success: true, simulated: true };
}

export async function sendTeamInvitationEmail({
  to,
  memberName,
  inviterName,
  companyName,
}: {
  to: string;
  memberName: string;
  inviterName: string;
  companyName: string;
}) {
  const joinLink = `${appUrl}/register?email=${encodeURIComponent(to)}&invitedBy=${encodeURIComponent(inviterName)}`;
  const subject = `${inviterName} vous invite à rejoindre l'équipe ${companyName} sur Fylynx`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 28px; color: #0f172a; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px -5px rgba(2, 111, 199, 0.08);">
      ${getEmailHeaderHtml()}

      <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 14px;">Invitation à rejoindre l'équipe ${companyName}</h2>

      <p style="font-size: 15px; line-height: 24px; color: #334155;">Bonjour <strong>${memberName}</strong>,</p>
      <p style="font-size: 15px; line-height: 24px; color: #334155;">
        <strong>${inviterName}</strong> vous invite à collaborer sur l'espace <strong>${companyName}</strong> pour gérer les demandes de pièces justificatives et suivre l'avancement des dossiers clients.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${joinLink}" style="background-color: #026fc7; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(2, 111, 199, 0.35);">
          Accepter l'invitation & Accéder à l'espace →
        </a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 20px; text-align: center;">
        Lien d'accès direct à votre compte collaborateur :<br/>
        <a href="${joinLink}" style="color: #026fc7; word-break: break-all; font-weight: 600;">${joinLink}</a>
      </p>

      ${getEmailFooterHtml()}
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });
      return { success: true };
    } catch (err: unknown) {
      console.error('[Resend Team Invite Exception]', err);
    }
  }

  console.log(`[TEAM INVITATION SIMULATION] Sent to: ${to}, Link: ${joinLink}`);
  return { success: true, simulated: true };
}

/**
 * Notifie l'abonné dès qu'un client dépose un document.
 * Si l'abonné dispose de la formule IA (AI_ENTERPRISE, AGENCY_SCALE ou ADMIN), le rapport d'analyse IA est inclus directement dans le mail !
 */
export async function sendDocumentDepositNotificationEmail({
  to,
  subscriberName,
  subscriberStatus,
  clientName,
  clientEmail,
  folderTitle,
  requestId,
  documentTitle,
  fileName,
  aiResult,
}: {
  to: string;
  subscriberName: string;
  subscriberStatus: string;
  clientName: string;
  clientEmail?: string;
  folderTitle: string;
  requestId: string;
  documentTitle: string;
  fileName?: string;
  aiResult?: {
    confidenceScore?: number;
    status?: string;
    documentCategory?: string;
    summary?: string;
    checks?: Array<{ label: string; passed: boolean; details?: string }>;
    rejectionReason?: string;
  } | null;
}) {
  const isAiPlan =
    subscriberStatus === 'AI_ENTERPRISE' ||
    subscriberStatus === 'AGENCY_SCALE' ||
    subscriberStatus === 'ADMIN';

  const subject = `[Document reçu] ${clientName} a déposé "${documentTitle}" (${folderTitle})`;

  const detailUrl = `${appUrl}/dashboard/requests/${requestId}`;

  let aiBlockHtml = '';

  if (isAiPlan && aiResult) {
    const score = aiResult.confidenceScore ?? 0;
    const isPassed = aiResult.status === 'PASSED' || score >= 80;
    const isWarning = aiResult.status === 'WARNING' || (score >= 40 && score < 80);

    const badgeBg = isPassed ? '#059669' : isWarning ? '#d97706' : '#dc2626';
    const badgeLabel = isPassed ? '✅ Certifié Conforme' : isWarning ? '⚠️ Contrôle Requis' : '❌ Non Conforme';

    const checksList =
      aiResult.checks && aiResult.checks.length > 0
        ? `
      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #334155;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Points de contrôle automatique :</p>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #e2e8f0; line-height: 20px;">
          ${aiResult.checks
            .map(
              (c) =>
                `<li style="margin-bottom: 4px;">${c.passed ? '<span style="color:#34d399;">✓</span>' : '<span style="color:#f87171;">✗</span>'} <strong>${c.label}</strong> ${c.details ? `— <span style="color:#94a3b8;">${c.details}</span>` : ''}</li>`
            )
            .join('')}
        </ul>
      </div>
    `
        : '';

    const rejectionReasonHtml = aiResult.rejectionReason
      ? `
      <div style="margin-top: 12px; padding: 10px 14px; background-color: rgba(220,38,38,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 8px; color: #fca5a5; font-size: 12px; line-height: 18px;">
        <strong>Motif du rejet détecté :</strong> ${aiResult.rejectionReason}
      </div>
    `
      : '';

    aiBlockHtml = `
      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; margin: 24px 0; color: #f8fafc; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
          <tr>
            <td align="left" style="font-size: 13px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">
              🤖 Rapport d'Analyse IA Automatique (Fylynx Vision)
            </td>
            <td align="right">
              <span style="background-color: ${badgeBg}; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px;">
                Score: ${score}% — ${badgeLabel}
              </span>
            </td>
          </tr>
        </table>

        <div style="font-size: 13px; line-height: 20px; color: #cbd5e1; margin-bottom: 8px;">
          <strong>Catégorie identifiée par l'IA :</strong> <span style="color: #38bdf8; font-weight: 700;">${aiResult.documentCategory || 'Document Officiel'}</span>
        </div>

        <div style="font-size: 13px; line-height: 20px; color: #e2e8f0; background-color: #1e293b; padding: 12px; border-radius: 8px; border-left: 3px solid #026fc7;">
          <strong>Diagnostic de l'IA :</strong> ${aiResult.summary || 'Analyse effectuée avec succès.'}
        </div>

        ${checksList}
        ${rejectionReasonHtml}
      </div>
    `;
  } else if (!isAiPlan) {
    aiBlockHtml = `
      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin: 24px 0; color: #0369a1; font-size: 13px; line-height: 18px;">
        💡 <strong>Détection automatique Anti-Fraude :</strong> Passez au forfait <strong style="color: #0284c7;">IA Enterprise</strong> ou <strong style="color: #0284c7;">Agence Scale</strong> pour visualiser la certification IA automatique, la détection des fausses pièces et le rapport anti-fraude directement dans vos e-mails.
      </div>
    `;
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 28px; color: #0f172a; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px -5px rgba(2, 111, 199, 0.08);">
      ${getEmailHeaderHtml()}

      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; color: #065f46; font-size: 14px; font-weight: 700;">
        📩 Nouveaux justificatifs reçus et prêts pour vérification !
      </div>

      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 16px;">Bonjour <strong>${subscriberName}</strong>,</p>
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 20px;">
        Votre client <strong>${clientName}</strong> ${clientEmail ? `(<a href="mailto:${clientEmail}" style="color:#026fc7;">${clientEmail}</a>)` : ''} a déposé un nouveau document pour le dossier <strong>"${folderTitle}"</strong>.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="font-size: 13px; color: #64748b; font-weight: 600; padding-bottom: 6px;">Document demandé :</td>
            <td style="font-size: 14px; color: #0f172a; font-weight: 800; padding-bottom: 6px;" align="right">${documentTitle}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #64748b; font-weight: 600;">Nom du fichier :</td>
            <td style="font-size: 13px; color: #3b82f6; font-family: monospace; font-weight: 700;" align="right">${fileName || 'document.pdf'}</td>
          </tr>
        </table>
      </div>

      ${aiBlockHtml}

      <div style="text-align: center; margin: 32px 0;">
        <a href="${detailUrl}" style="background-color: #026fc7; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(2, 111, 199, 0.35);">
          Examiner & Valider le Dossier →
        </a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 20px; text-align: center;">
        Lien direct vers votre tableau de bord admin :<br/>
        <a href="${detailUrl}" style="color: #026fc7; word-break: break-all; font-weight: 600;">${detailUrl}</a>
      </p>

      ${getEmailFooterHtml()}
    </div>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });

      if (response.error) {
        if (
          response.error.message?.includes('testing emails to your own email address') ||
          response.error.message?.includes('API key is invalid') ||
          response.error.name === 'validation_error' ||
          (response.error as any).statusCode === 403 ||
          (response.error as any).statusCode === 400
        ) {
          console.log(`[Resend Mode Simulation] Notification de dépôt enregistrée pour ${to} (Client: ${clientName}). Ajoutez votre clé RESEND_API_KEY dans .env pour l'envoi réel d'emails.`);
          return { success: true, simulated: true };
        }
        console.error('[Resend Error]', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[Resend Success] Email de notification de dépôt envoyé à ${to}`);
      return { success: true, id: response.data?.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Resend Exception]', msg);
      return { success: false, error: msg };
    }
  }

  console.log('----------------------------------------------------');
  console.log(`[DOCUMENT DEPOSIT NOTIFICATION SIMULATION] Sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Client: ${clientName}, Document: ${documentTitle}`);
  console.log(`Link: ${detailUrl}`);
  console.log('----------------------------------------------------');
  return { success: true, simulated: true };
}
