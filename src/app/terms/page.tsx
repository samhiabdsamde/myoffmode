import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions Générales d'Utilisation de MyOffMode — droits et obligations des utilisateurs.",
  robots: { index: false, follow: false },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="text-white/60 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
)

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#12080E' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-8">
            ← Retour à l&apos;accueil
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#C4737A' }}>
            Légal
          </p>
          <h1 className="font-serif text-4xl font-black text-white mb-3">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-white/40 text-sm">
            Dernière mise à jour : 25 mai 2026 · Version 1.0
          </p>
        </div>

        <div className="prose prose-invert max-w-none">

          <Section title="1. Objet">
            <p>
              Les présentes CGU régissent l&apos;utilisation du service MyOffMode, application SaaS
              permettant aux mamans d&apos;organiser et de partager leurs routines familiales via
              une intelligence artificielle.
            </p>
            <p>
              En créant un compte, vous acceptez sans réserve les présentes conditions.
            </p>
          </Section>

          <Section title="2. Description du service">
            <p>MyOffMode propose :</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>La création et la gestion de routines familiales</li>
              <li>Un assistant IA pour répondre aux questions du partenaire</li>
              <li>Le partage d&apos;un espace famille avec le partenaire</li>
              <li>Une liste de courses collaborative</li>
              <li>Une fonctionnalité "OFF Mode" pour déléguer temporairement la gestion familiale</li>
            </ul>
          </Section>

          <Section title="3. Inscription et compte">
            <p>
              L&apos;inscription est ouverte à toute personne majeure. Vous êtes responsable de la
              confidentialité de vos identifiants. Vous vous engagez à fournir des informations
              exactes et à les mettre à jour si nécessaire.
            </p>
            <p>
              Un compte est strictement personnel et ne peut être partagé qu&apos;avec le partenaire
              invité via le système d&apos;invitation prévu à cet effet.
            </p>
          </Section>

          <Section title="4. Abonnements et paiements">
            <p>
              MyOffMode propose un plan gratuit et des plans payants (Pro à 7€/mois, Famille à 12€/mois).
              Les prix sont en euros TTC. Le paiement est effectué mensuellement via Stripe.
            </p>
            <p>
              <strong className="text-white/70">Période d&apos;essai :</strong> les plans payants bénéficient
              de 7 jours d&apos;essai gratuit sans carte bancaire requise à l&apos;inscription.
            </p>
            <p>
              <strong className="text-white/70">Résiliation :</strong> vous pouvez annuler votre abonnement
              à tout moment depuis vos paramètres. L&apos;accès reste actif jusqu&apos;à la fin de la période
              en cours. Aucun remboursement prorata n&apos;est accordé sauf obligation légale.
            </p>
          </Section>

          <Section title="5. Utilisation acceptable">
            <p>Vous vous engagez à ne pas :</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Utiliser le service à des fins illicites ou frauduleuses</li>
              <li>Partager du contenu offensant, illégal ou portant atteinte à des tiers</li>
              <li>Tenter d&apos;accéder aux données d&apos;autres utilisateurs</li>
              <li>Utiliser des robots ou scripts pour automatiser des actions non prévues</li>
              <li>Revendre ou sous-licencier l&apos;accès au service</li>
            </ul>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p>
              Le service MyOffMode, son code, son design, et son contenu éditorial sont protégés
              par les droits de propriété intellectuelle. Tout reproduction est interdite sans autorisation.
            </p>
            <p>
              Les données que vous saisissez (routines, habitudes) vous appartiennent. Vous accordez
              à MyOffMode une licence limitée pour traiter ces données aux seules fins de fournir le service.
            </p>
          </Section>

          <Section title="7. Intelligence Artificielle — Limitations">
            <p>
              L&apos;IA de MyOffMode est conçue pour répondre aux questions du partenaire sur la base
              des routines encodées. Elle peut faire des erreurs. MyOffMode ne saurait être tenu responsable
              des conséquences d&apos;une réponse incorrecte de l&apos;IA.
            </p>
            <p>
              <strong className="text-white/70">Important :</strong> MyOffMode est un outil d&apos;organisation familiale.
              Il ne constitue pas un conseil médical, psychologique ou juridique. En cas de situation
              d&apos;urgence médicale, contactez le 15 (SAMU) ou le 18 (pompiers).
            </p>
          </Section>

          <Section title="8. Disponibilité du service">
            <p>
              MyOffMode s&apos;efforce d&apos;assurer une disponibilité maximale du service (objectif 99,5%/mois).
              Des interruptions pour maintenance peuvent survenir, avec préavis autant que possible.
              Aucune indemnisation ne sera due pour des interruptions de service inférieures à 24h/mois.
            </p>
          </Section>

          <Section title="9. Résiliation et suppression de compte">
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis les paramètres. La suppression
              est irréversible. Vos données sont effacées sous 30 jours (hors données conservées par
              obligation légale — facturation : 10 ans).
            </p>
            <p>
              MyOffMode se réserve le droit de suspendre un compte en cas de violation des présentes CGU,
              avec notification préalable sauf urgence.
            </p>
          </Section>

          <Section title="10. Responsabilité">
            <p>
              Dans les limites permises par la loi, la responsabilité de MyOffMode est limitée
              aux sommes effectivement payées par l&apos;utilisateur au cours des 3 derniers mois.
              MyOffMode n&apos;est pas responsable des dommages indirects, pertes de données, ou
              interruptions d&apos;activité.
            </p>
          </Section>

          <Section title="11. Loi applicable et litiges">
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence
              exclusive des tribunaux français. Conformément à l&apos;article L.612-1 du Code de la
              consommation, vous pouvez recourir à une médiation de la consommation.
            </p>
          </Section>

          <Section title="12. Modifications des CGU">
            <p>
              Ces CGU peuvent être modifiées. Vous serez informé par email 30 jours avant toute
              modification substantielle. La poursuite de l&apos;utilisation du service vaut acceptation.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.07] flex items-center gap-4 text-xs text-white/30">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Confidentialité</Link>
          <span>·</span>
          <Link href="/mentions-legales" className="hover:text-white/60 transition-colors">Mentions légales</Link>
          <span>·</span>
          <Link href="/" className="hover:text-white/60 transition-colors">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  )
}
