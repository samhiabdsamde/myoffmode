import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de MyOffMode — éditeur, hébergeur, propriété intellectuelle.',
  robots: { index: false, follow: false },
}

export default function MentionsLegalesPage() {
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
          <h1 className="font-serif text-4xl font-black text-white mb-3">Mentions légales</h1>
          <p className="text-white/40 text-sm">Conformément à la loi n° 2004-575 du 21 juin 2004</p>
        </div>

        <div className="space-y-10 text-sm">

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Éditeur du site</h2>
            <div className="text-white/60 space-y-1.5 leading-relaxed">
              <p><span className="text-white/40">Raison sociale :</span> <strong className="text-white/70">MyOffMode</strong></p>
              <p><span className="text-white/40">Forme juridique :</span> Entreprise individuelle / SAS (en cours d&apos;immatriculation)</p>
              <p><span className="text-white/40">Siège social :</span> France</p>
              <p><span className="text-white/40">Email :</span>{' '}
                <a href="mailto:contact@myoffmode.com" className="text-rose-400 underline">contact@myoffmode.com</a>
              </p>
              <p><span className="text-white/40">Directeur de la publication :</span> L&apos;équipe MyOffMode</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Hébergement</h2>
            <div className="text-white/60 space-y-3 leading-relaxed">
              <div>
                <p className="font-medium text-white/70 mb-1">Application Web</p>
                <p>Vercel Inc. · 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</p>
                <p className="text-white/40 text-xs mt-1">Données hébergées dans les data centers EU (Frankfurt)</p>
              </div>
              <div>
                <p className="font-medium text-white/70 mb-1">Base de données</p>
                <p>Supabase Inc. · 970 Toa Payoh North, Singapore</p>
                <p className="text-white/40 text-xs mt-1">Données hébergées dans les data centers EU</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Propriété intellectuelle</h2>
            <div className="text-white/60 space-y-2 leading-relaxed">
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, design, code source, logo)
                est protégé par le droit d&apos;auteur et appartient à MyOffMode ou à ses partenaires.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation,
                totale ou partielle, de l&apos;un quelconque des éléments du site est interdite
                sans autorisation écrite préalable.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Données personnelles</h2>
            <div className="text-white/60 leading-relaxed">
              <p>
                Le traitement des données personnelles est détaillé dans notre{' '}
                <Link href="/privacy" className="text-rose-400 underline">Politique de confidentialité</Link>.
                Conformément au RGPD et à la loi Informatique et Libertés, vous pouvez exercer
                vos droits en contactant :{' '}
                <a href="mailto:privacy@myoffmode.com" className="text-rose-400 underline">privacy@myoffmode.com</a>.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Cookies</h2>
            <div className="text-white/60 leading-relaxed">
              <p>
                Ce site utilise des cookies nécessaires à son fonctionnement et, avec votre
                consentement, des cookies analytiques. Vous pouvez gérer vos préférences
                via le bandeau cookies affiché lors de votre première visite.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Limitation de responsabilité</h2>
            <div className="text-white/60 space-y-2 leading-relaxed">
              <p>
                MyOffMode est un outil d&apos;organisation familiale. Il ne constitue en aucun cas
                un conseil médical, psychologique, juridique ou financier.
              </p>
              <p>
                En cas de détresse psychologique ou d&apos;urgence médicale, contactez
                le <strong className="text-white/70">15 (SAMU)</strong> ou le{' '}
                <strong className="text-white/70">3114 (numéro national de prévention du suicide)</strong>.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Droit applicable</h2>
            <div className="text-white/60 leading-relaxed">
              <p>
                Le présent site est soumis au droit français. Tout litige relatif à son
                utilisation sera soumis à la compétence exclusive des tribunaux français.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
            <div className="text-white/60 space-y-1.5">
              <p>Email général : <a href="mailto:contact@myoffmode.com" className="text-rose-400 underline">contact@myoffmode.com</a></p>
              <p>Support : <a href="mailto:support@myoffmode.com" className="text-rose-400 underline">support@myoffmode.com</a></p>
              <p>Données personnelles : <a href="mailto:privacy@myoffmode.com" className="text-rose-400 underline">privacy@myoffmode.com</a></p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.07] flex items-center gap-4 text-xs text-white/30">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Confidentialité</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-white/60 transition-colors">CGU</Link>
          <span>·</span>
          <Link href="/" className="hover:text-white/60 transition-colors">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  )
}
