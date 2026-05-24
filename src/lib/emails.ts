import { Resend } from 'resend'
import { logger } from './logger'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'MyOffMode <noreply@myoffmode.com>'
const FROM_SUPPORT = 'Support MyOffMode <support@myoffmode.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://myoffmode.com'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Template de base ─────────────────────────────────────────
function baseTemplate(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MyOffMode</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background: #f9fafb; color: #111; }
  .preheader { display:none;max-height:0;overflow:hidden; }
  .wrap { max-width:560px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #f0f0f0; }
  .header { background:#f43f5e;padding:24px 32px;text-align:center; }
  .header .logo { color:#fff;font-size:22px;font-weight:800;text-decoration:none; }
  .body { padding:36px 32px; }
  h1 { font-size:22px;font-weight:800;color:#111;margin-bottom:12px;line-height:1.3; }
  p { font-size:15px;color:#374151;line-height:1.7;margin-bottom:12px; }
  .btn { display:inline-block;background:#f43f5e;color:#fff!important;text-decoration:none;
         padding:14px 28px;border-radius:14px;font-weight:700;font-size:15px;margin:20px 0; }
  .btn-gray { background:#111; }
  .box { background:#fff9f9;border:1px solid #fecdd3;border-radius:14px;padding:18px;margin:20px 0; }
  .box-gray { background:#f9fafb;border-color:#e5e7eb; }
  .box-green { background:#f0fdf4;border-color:#bbf7d0; }
  .box-amber { background:#fffbeb;border-color:#fde68a; }
  .divider { height:1px;background:#f0f0f0;margin:24px 0; }
  .meta { font-size:13px;color:#9ca3af; }
  .footer { padding:20px 32px;border-top:1px solid #f0f0f0;text-align:center; }
  .footer p { font-size:12px;color:#9ca3af;margin:4px 0; }
  .footer a { color:#9ca3af;text-decoration:underline; }
  table.invoice { width:100%;border-collapse:collapse;margin:16px 0; }
  table.invoice td { padding:10px 12px;font-size:14px;border-bottom:1px solid #f0f0f0; }
  table.invoice .total td { font-weight:700;border-bottom:none;color:#f43f5e; }
</style>
</head>
<body>
<span class="preheader">${preheader}</span>
<div class="wrap">
  <div class="header"><a href="${APP_URL}" class="logo">🔴 MyOffMode</a></div>
  <div class="body">${content}</div>
  <div class="footer">
    <p>© 2026 MyOffMode · <a href="${APP_URL}">myoffmode.com</a></p>
    <p><a href="${APP_URL}/settings">Paramètres</a> · <a href="${APP_URL}/unsubscribe">Se désabonner</a> · <a href="${APP_URL}/privacy">Confidentialité</a></p>
  </div>
</div>
</body></html>`
}

// ─── Emails ───────────────────────────────────────────────────
export const emails = {

  // WELCOME — à l'inscription
  async welcome(to: string, name: string) {
    const html = baseTemplate(`
      <h1>Bienvenue ${name} 👋</h1>
      <p>Tu viens de faire le premier pas vers de vrais moments de repos. <strong>MyOffMode</strong> va t'aider à déléguer sans tout réexpliquer.</p>
      <div class="box">
        <p style="margin:0"><strong>🔴 Prochaine étape :</strong> Configure tes routines en 10 minutes — tes enfants, tes habitudes, ta façon de faire.</p>
      </div>
      <a href="${APP_URL}/onboarding" class="btn">Configurer mon OFF Mode →</a>
      <p class="meta">Tu peux aussi partager le lien de ta famille à ton partenaire depuis le dashboard.</p>
    `, 'Bienvenue ! Ton OFF Mode t\'attend.')
    return send({ to, subject: '🔴 Bienvenue sur MyOffMode !', html, type: 'welcome' })
  },

  // LOGIN NOTIFICATION — nouvelle connexion depuis appareil inconnu
  async loginNotification(to: string, name: string, ip: string, device: string, time: string) {
    const html = baseTemplate(`
      <h1>Nouvelle connexion détectée 🔐</h1>
      <p>Bonjour ${name}, une connexion à ton compte MyOffMode vient d'être effectuée.</p>
      <div class="box-gray box">
        <p style="margin:0 0 6px"><strong>📍 IP :</strong> ${ip}</p>
        <p style="margin:0 0 6px"><strong>💻 Appareil :</strong> ${device}</p>
        <p style="margin:0"><strong>🕐 Date :</strong> ${time}</p>
      </div>
      <p>Si c'est toi, ignore ce message. Si ce n'est <strong>pas toi</strong>, sécurise ton compte immédiatement.</p>
      <a href="${APP_URL}/settings" class="btn">Sécuriser mon compte →</a>
      <p class="meta">Tu peux activer la double authentification (2FA) dans les paramètres de sécurité.</p>
    `, 'Nouvelle connexion à ton compte MyOffMode')
    return send({ to, subject: '🔐 Nouvelle connexion à ton compte', html, type: 'login_notification' })
  },

  // RESET PASSWORD
  async resetPassword(to: string, resetUrl: string) {
    const html = baseTemplate(`
      <h1>Réinitialise ton mot de passe 🔑</h1>
      <p>Tu as demandé à réinitialiser ton mot de passe MyOffMode. Clique sur le bouton ci-dessous pour en choisir un nouveau.</p>
      <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe →</a>
      <div class="box-gray box">
        <p style="margin:0;font-size:13px">⏱️ Ce lien expire dans <strong>1 heure</strong>. Si tu n'as pas fait cette demande, ignore cet email — ton mot de passe reste inchangé.</p>
      </div>
    `, 'Réinitialise ton mot de passe MyOffMode')
    return send({ to, subject: '🔑 Réinitialisation de ton mot de passe', html, type: 'reset_password' })
  },

  // OFF MODE — notif partenaire
  async offModeActivated(to: string, partnerName: string, momName: string) {
    const html = baseTemplate(`
      <h1>${momName} est en OFF Mode 🔴</h1>
      <p>Bonjour ${partnerName},</p>
      <div class="box">
        <p style="margin:0;font-weight:700">🔴 ${momName} vient d'activer son OFF Mode.</p>
        <p style="margin:8px 0 0;color:#6b7280">C'est toi qui gères aujourd'hui. Tu peux le faire 💪</p>
      </div>
      <p>L'IA MyOffMode connaît toutes les routines, les habitudes des enfants, les médicaments et les informations importantes. N'hésite pas à lui poser toutes tes questions.</p>
      <a href="${APP_URL}/dashboard" class="btn">Ouvrir le dashboard →</a>
    `, `${momName} est en OFF Mode — tu gères !`)
    return send({ to, subject: `🔴 ${momName} est en OFF Mode — tu gères !`, html, type: 'off_mode_activated' })
  },

  // PAIEMENT RÉUSSI + FACTURE
  async paymentSuccess(to: string, name: string, plan: string, amount: string, invoiceUrl?: string, invoiceNumber?: string) {
    const html = baseTemplate(`
      <h1>Paiement confirmé ✅</h1>
      <p>Bonjour ${name}, ton paiement a bien été reçu. Bienvenue dans le plan <strong>${plan}</strong> !</p>
      <table class="invoice">
        <tr><td>Plan</td><td style="text-align:right;font-weight:600">${plan}</td></tr>
        ${invoiceNumber ? `<tr><td>N° Facture</td><td style="text-align:right">${invoiceNumber}</td></tr>` : ''}
        <tr><td>Date</td><td style="text-align:right">${new Date().toLocaleDateString('fr-FR')}</td></tr>
        <tr class="total"><td>Total TTC</td><td style="text-align:right">${amount}</td></tr>
      </table>
      <div class="box-green box">
        <p style="margin:0">✨ Toutes les fonctionnalités premium sont maintenant actives sur ton compte.</p>
      </div>
      <a href="${APP_URL}/dashboard" class="btn">Accéder au dashboard →</a>
      ${invoiceUrl ? `<p style="margin-top:16px"><a href="${invoiceUrl}" style="color:#9ca3af;font-size:13px">📄 Télécharger la facture PDF</a></p>` : ''}
      <p class="meta">Pour gérer ton abonnement, changer de carte ou voir tes factures : <a href="${APP_URL}/api/stripe/portal">Portail de facturation</a></p>
    `, `Paiement de ${amount} confirmé — MyOffMode ${plan}`)
    return send({ to, subject: `✅ Confirmation de paiement — MyOffMode ${plan}`, html, type: 'payment_success' })
  },

  // PAIEMENT ÉCHOUÉ
  async paymentFailed(to: string, name: string, attemptCount = 1, nextRetry?: string) {
    const html = baseTemplate(`
      <h1>Paiement échoué ⚠️</h1>
      <p>Bonjour ${name},</p>
      <div class="box">
        <p style="margin:0">Nous n'avons pas pu débiter ta carte. <strong>Tentative ${attemptCount}/4</strong>.</p>
        ${nextRetry ? `<p style="margin:8px 0 0;color:#6b7280;font-size:13px">Prochain essai automatique : ${nextRetry}</p>` : ''}
      </div>
      <p>Pour éviter la suspension de ton accès Premium, mets à jour ta méthode de paiement dès maintenant.</p>
      <a href="${APP_URL}/api/stripe/portal" class="btn">Mettre à jour ma carte →</a>
      <div class="box-amber box">
        <p style="margin:0;font-size:13px">⏳ Ton accès Premium sera suspendu si le paiement n'est pas régularisé sous <strong>7 jours</strong>.</p>
      </div>
    `, 'Action requise : ton paiement a échoué')
    return send({ to, subject: `⚠️ Paiement échoué — Action requise (tentative ${attemptCount}/4)`, html, type: 'payment_failed' })
  },

  // RENOUVELLEMENT À VENIR
  async renewalReminder(to: string, name: string, plan: string, amount: string, renewDate: string) {
    const html = baseTemplate(`
      <h1>Renouvellement dans 3 jours 📅</h1>
      <p>Bonjour ${name},</p>
      <p>Ton abonnement <strong>${plan}</strong> sera renouvelé automatiquement le <strong>${renewDate}</strong>.</p>
      <table class="invoice">
        <tr><td>Plan</td><td style="text-align:right">${plan}</td></tr>
        <tr><td>Date de renouvellement</td><td style="text-align:right">${renewDate}</td></tr>
        <tr class="total"><td>Montant</td><td style="text-align:right">${amount}</td></tr>
      </table>
      <p>Aucune action n'est requise si tu souhaites continuer. Pour annuler ou modifier :</p>
      <a href="${APP_URL}/api/stripe/portal" class="btn btn-gray">Gérer mon abonnement →</a>
    `, `Renouvellement de ton abonnement le ${renewDate}`)
    return send({ to, subject: `📅 Renouvellement de ton abonnement le ${renewDate}`, html, type: 'renewal_reminder' })
  },

  // ABONNEMENT ANNULÉ
  async subscriptionCanceled(to: string, name: string, endDate: string) {
    const html = baseTemplate(`
      <h1>Abonnement annulé</h1>
      <p>Bonjour ${name},</p>
      <p>Ton abonnement Premium a bien été annulé. Tu garderas l'accès à toutes les fonctionnalités jusqu'au <strong>${endDate}</strong>.</p>
      <div class="box-gray box">
        <p style="margin:0">Après cette date, ton compte repassera automatiquement en plan gratuit (3 routines, chat IA limité).</p>
      </div>
      <p>Tu peux réactiver ton abonnement à tout moment.</p>
      <a href="${APP_URL}/upgrade" class="btn">Réactiver mon abonnement →</a>
      <p class="meta">Tu as des questions ? Réponds directement à cet email — notre équipe te répond sous 24h.</p>
    `, 'Ton abonnement a été annulé')
    return send({ to, subject: 'Confirmation d\'annulation — MyOffMode', html, type: 'subscription_canceled' })
  },

  // INVITATION PARTENAIRE
  async partnerInvite(to: string, momName: string, familyId: string) {
    const html = baseTemplate(`
      <h1>${momName} t'invite sur MyOffMode 👨‍👩‍👧</h1>
      <p>Bonjour,</p>
      <p><strong>${momName}</strong> t'invite à rejoindre sa famille sur MyOffMode.</p>
      <div class="box">
        <p style="margin:0">En rejoignant, tu auras accès aux routines familiales, à la liste de courses et à l'IA qui connaît tous les détails importants.</p>
      </div>
      <a href="${APP_URL}/join/${familyId}" class="btn">Rejoindre la famille →</a>
      <p class="meta">⏰ Ce lien expire dans 7 jours.</p>
    `, `${momName} t'invite à gérer la maison intelligemment`)
    return send({ to, subject: `👨‍👩‍👧 ${momName} t'invite sur MyOffMode`, html, type: 'partner_invite' })
  },

  // SUPPORT — confirmation ticket
  async supportTicketConfirmation(to: string, name: string, ticketId: string, subject: string) {
    const html = baseTemplate(`
      <h1>Ticket reçu ✅</h1>
      <p>Bonjour ${name},</p>
      <p>Nous avons bien reçu ton message concernant : <strong>"${subject}"</strong></p>
      <div class="box-gray box">
        <p style="margin:0"><strong>Référence :</strong> #${ticketId.slice(0, 8).toUpperCase()}</p>
        <p style="margin:8px 0 0;color:#6b7280;font-size:13px">⏱️ Délai de réponse habituel : 24h ouvrées</p>
      </div>
      <p>Notre équipe va examiner ta demande et te répondre dans les meilleurs délais.</p>
    `, 'Ton message a bien été reçu')
    return send({ to, from: FROM_SUPPORT, subject: `Re: ${subject} [#${ticketId.slice(0, 8).toUpperCase()}]`, html, type: 'support_confirmation' })
  },

  // SUPPORT — réponse admin
  async supportReply(to: string, name: string, ticketId: string, subject: string, message: string) {
    const html = baseTemplate(`
      <h1>Réponse à ton ticket 💬</h1>
      <p>Bonjour ${name}, voici la réponse de notre équipe :</p>
      <div class="box-gray box">
        <p style="white-space:pre-wrap;font-size:14px">${message}</p>
      </div>
      <a href="${APP_URL}/support/tickets/${ticketId}" class="btn">Voir le ticket complet →</a>
      <p class="meta">Référence : #${ticketId.slice(0, 8).toUpperCase()}</p>
    `, 'L\'équipe MyOffMode t\'a répondu')
    return send({ to, from: FROM_SUPPORT, subject: `Re: ${subject} [#${ticketId.slice(0, 8).toUpperCase()}]`, html, type: 'support_reply' })
  },

  // COMPTE BLOQUÉ
  async accountBlocked(to: string, name: string, reason: string) {
    const html = baseTemplate(`
      <h1>Compte suspendu ⛔</h1>
      <p>Bonjour ${name},</p>
      <p>Ton compte MyOffMode a été temporairement suspendu.</p>
      <div class="box">
        <p style="margin:0"><strong>Raison :</strong> ${reason}</p>
      </div>
      <p>Si tu penses qu'il s'agit d'une erreur, contacte notre support.</p>
      <a href="mailto:support@myoffmode.com" class="btn">Contacter le support →</a>
    `, 'Ton compte MyOffMode a été suspendu')
    return send({ to, from: FROM_SUPPORT, subject: '⛔ Compte suspendu — MyOffMode', html, type: 'account_blocked' })
  },
}

// ─── Send helper avec log ──────────────────────────────────────
async function send({
  to, subject, html, type, from = FROM,
}: {
  to: string; subject: string; html: string; type: string; from?: string
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_...') {
    logger.warn('[Email] Non configuré', { to, subject })
    return { success: false }
  }
  try {
    const { data, error } = await resend.emails.send({ from, to, subject, html })
    if (error) {
      logger.error('[Email] Erreur envoi', { error, to, subject })
      await logEmail({ to, subject, type, status: 'failed' })
      return { success: false, error }
    }
    logger.info('[Email] Envoyé', { to, subject, id: data?.id })
    await logEmail({ to, subject, type, status: 'sent', resendId: data?.id })
    return { success: true, id: data?.id }
  } catch (err: any) {
    logger.error('[Email] Exception', { err: err.message })
    return { success: false }
  }
}

async function logEmail({ to, subject, type, status, resendId }: {
  to: string; subject: string; type: string; status: string; resendId?: string
}) {
  try {
    await admin.from('email_logs').insert({
      to_email: to, subject, type, status, resend_id: resendId,
    })
  } catch { /* ignore log errors */ }
}
