import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@fylynx.app';

export async function sendPasswordResetEmail({
  to,
  userName,
  resetLink,
}: {
  to: string;
  userName: string;
  resetLink: string;
}) {
  const subject = `Réinitialisation de votre mot de passe - Fylynx.app`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1e293b; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="margin-bottom: 24px; border-bottom: 2px solid #026fc7; padding-bottom: 12px; text-align: center;">
        <h1 style="color: #026fc7; margin: 0; font-size: 26px; font-weight: 800;">FYLYNX<span style="color: #38bdf8;">.app</span></h1>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Vérification & Sécurité des Comptes</p>
      </div>
      
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0;">Réinitialisation de votre mot de passe</h2>
      
      <p style="font-size: 15px; line-height: 24px; color: #334155;">Bonjour <strong>${userName}</strong>,</p>
      <p style="font-size: 15px; line-height: 24px; color: #334155;">
        Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte professionnel Fylynx.
      </p>

      <div style="background-color: #f8fafc; border-left: 4px solid #026fc7; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #475569;">
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe actuel reste inchangé.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background-color: #026fc7; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; shadow: 0 4px 12px rgba(2, 111, 199, 0.25);">
          Réinitialiser mon mot de passe →
        </a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 20px;">
        Ce lien de sécurité est valide pendant <strong>1 heure</strong>.<br/>
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>
        <a href="${resetLink}" style="color: #026fc7; word-break: break-all;">${resetLink}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        Message automatique de sécurité transmis par Fylynx SaaS.
      </p>
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
}: {
  to: string;
  clientName: string;
  companyName: string;
  folderTitle: string;
  depositLink: string;
  missingDocTitles?: string[];
}) {
  const subject = `Rappel : Votre dossier pour ${companyName} est incomplet`;

  const missingListHtml =
    missingDocTitles && missingDocTitles.length > 0
      ? `
    <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 18px 20px; margin: 24px 0; border-radius: 10px;">
      <p style="margin: 0 0 10px 0; font-weight: 800; font-size: 13px; color: #1e1b4b; text-transform: uppercase; letter-spacing: 0.5px;">📋 Justificatifs manquants à transmettre :</p>
      <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 22px;">
        ${missingDocTitles.map((t) => `<li style="margin-bottom: 4px;"><strong>${t}</strong></li>`).join('')}
      </ul>
    </div>
  `
      : '';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 28px; color: #0f172a; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
      <div style="margin-bottom: 28px; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; text-align: center;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">FYLYNX<span style="color: #6366f1;">.app</span></h1>
        <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Collecte & Certification Documentaire Sécurisée</p>
      </div>
      
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">Rappel : Votre dossier pour ${companyName} est incomplet</h2>
      
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 16px;">Bonjour <strong>${clientName}</strong>,</p>
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 20px;">
        <strong>${companyName}</strong> attend l'envoi de vos pièces justificatives pour finaliser votre dossier <strong>"${folderTitle}"</strong>.
      </p>

      ${missingListHtml}

      <p style="font-size: 14px; line-height: 22px; color: #475569;">
        ⚡ <strong>Prise de vue rapide depuis votre smartphone :</strong> Cliquez sur le bouton ci-dessous pour photographier vos pièces directement, sans mot de passe ni inscription.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${depositLink}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.4);">
          Transmettre mes pièces en 1 Clic →
        </a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 20px; text-align: center;">
        Lien direct sécurisé et valide :<br/>
        <a href="${depositLink}" style="color: #4f46e5; word-break: break-all; font-weight: 600;">${depositLink}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 18px;">
        Message transmis automatiquement par Fylynx.app pour le compte de ${companyName}.<br/>Vos pièces sont chiffrées et protégées selon les normes RGPD européennes.
      </p>
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
