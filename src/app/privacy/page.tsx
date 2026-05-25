import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et traitement des données personnelles de MyOffMode — conformité RGPD.',
  robots: { index: false, follow: false },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="text-white/60 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
)

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#12080E' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-8">
            ← Retour à l&apos;accueil
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#C4737A' }}>
            Légal
          </p>
          <h1 className="font-serif text-4xl font-black text-white mb-3">
            Politique de confidentialité
          </h1>
          <p className="text-white/40 text-sm">
            Dernière mise à jour : 25 mai 2026 · Version 1.0
          </p>
        </div>

        <div className="prose prose-invert max-w-none">

          <Section title="1. Qui sommes-nous ?">
            <p>
              MyOffMode est un service SaaS édité par <strong className="text-white/80">MyOffMode</strong>,
              dont le siège social est en France. Notre service permet aux mamans d&apos;encoder leurs routines
              familiales et de les partager avec leur partenaire via une intelligence artificielle.
            </p>
            <p>Contact : <a href="mailto:privacy@myoffmode.com" className="text-rose-400 underline">privacy@myoffmode.com</a></p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-white/70">Données de compte :</strong> adresse email, nom complet, rôle (maman / partenaire)</li>
              <li><strong className="text-white/70">Données de routines :</strong> les routines familiales que vous encodez (texte libre)</li>
              <li><strong className="text-white/70">Données de paiement :</strong> traitées exclusivement par Stripe — nous ne stockons jamais vos coordonnées bancaires</li>
              <li><strong className="text-white/70">Données d&apos;usage :</strong> logs de connexion, actions dans l&apos;app (avec votre consentement analytique)</li>
              <li><strong className="text-white/70">Messages IA :</strong> les messages échangés avec l&apos;IA sont stockés temporairement pour améliorer l&apos;expérience</li>
            </ul>
          </Section>

          <Section title="3. Finalités du traitement">
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Fournir et améliorer le service MyOffMode</li>
              <li>Traiter vos paiements via Stripe</li>
              <li>Envoyer des emails transactionnels (confirmation, support)</li>
              <li>Analyser l&apos;usage pour améliorer le produit (avec consentement)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </Section>

          <Section title="4. Base légale du traitement (RGPD)">
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white/70">Exécution du contrat :</strong> pour fournir le service souscrit</li>
              <li><strong className="text-white/70">Intérêt légitime :</strong> amélioration du service, sécurité</li>
              <li><strong className="text-white/70">Consentement :</strong> pour les cookies analytiques et marketing</li>
              <li><strong className="text-white/70">Obligation légale :</strong> conservation des données de facturation</li>
            </ul>
          </Section>

          <Section title="5. Hébergement et sécurité">
            <p>
              Toutes les données sont hébergées en <strong className="text-white/70">Europe (Union Européenne)</strong> via Supabase (base de données) et Vercel (application).
              Les données sont chiffrées en transit (HTTPS/TLS) et au repos.
            </p>
            <p>
              Nous appliquons des mesures de sécurité conformes aux standards du secteur :
              authentification sécurisée, accès restreint aux données, audits réguliers.
            </p>
          </Section>

          <Section title="6. Partage des données">
            <p>Nous ne vendons jamais vos données. Nous partageons uniquement :</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-white/70">Stripe</strong> — paiements (certifié PCI-DSS)</li>
              <li><strong className="text-white/70">Anthropic</strong> — traitement IA des messages (sans données personnelles identifiantes)</li>
              <li><strong className="text-white/70">Resend</strong> — envoi d&apos;emails transactionnels</li>
              <li><strong className="text-white/70">Supabase / Vercel</strong> — infrastructure hébergement EU</li>
            </ul>
          </Section>

          <Section title="7. Durée de conservation">
            <ul className="list-disc list-inside space-y-2">
              <li>Données de compte : durée du contrat + 3 ans</li>
              <li>Données de facturation : 10 ans (obligation fiscale française)</li>
              <li>Logs d&apos;usage : 12 mois</li>
              <li>Messages IA : 90 jours</li>
            </ul>
          </Section>

          <Section title="8. Vos droits (RGPD)">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-white/70">Accès</strong> — obtenir une copie de vos données</li>
              <li><strong className="text-white/70">Rectification</strong> — corriger des données inexactes</li>
              <li><strong className="text-white/70">Effacement</strong> — supprimer votre compte et vos données</li>
              <li><strong className="text-white/70">Opposition</strong> — vous opposer à certains traitements</li>
              <li><strong className="text-white/70">Portabilité</strong> — recevoir vos données dans un format lisible</li>
              <li><strong className="text-white/70">Limitation</strong> — limiter le traitement dans certains cas</li>
            </ul>
            <p className="mt-3">
              Pour exercer vos droits : <a href="mailto:privacy@myoffmode.com" className="text-rose-400 underline">privacy@myoffmode.com</a>.
              Réponse sous 30 jours. Vous pouvez également saisir la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline">CNIL</a>.
            </p>
          </Section>

          <Section title="9. Cookies">
            <p>
              Nous utilisons des cookies pour le bon fonctionnement du service (nécessaires) et,
              avec votre consentement, des cookies analytiques et marketing.
              Vous pouvez modifier vos préférences à tout moment via le bandeau cookies.
            </p>
          </Section>

          <Section title="10. Modifications">
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle,
              vous serez notifié par email avec un délai de 30 jours avant application.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.07] flex items-center gap-4 text-xs text-white/30">
          <Link href="/terms" className="hover:text-white/60 transition-colors">CGU</Link>
          <span>·</span>
          <Link href="/mentions-legales" className="hover:text-white/60 transition-colors">Mentions légales</Link>
          <span>·</span>
          <Link href="/" className="hover:text-white/60 transition-colors">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  )
}
