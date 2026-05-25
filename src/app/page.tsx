import Link from 'next/link'
import type { Metadata } from 'next'
import MobileNav from '@/components/MobileNav'

export const metadata: Metadata = {
  title: 'MyOffMode — La charge mentale posée. Toi, tu souffles.',
  description: "MyOffMode est l'espace où tu déposes ta charge mentale une fois pour toutes. L'IA transmet ton expertise de maman à ton partenaire. Tu décroches vraiment. Sans culpabilité.",
  alternates: { canonical: 'https://myoffmode.com' },
}

// ── Design tokens ──────────────────────────────────────────────────
// BG:        #12080E  — bordeaux presque noir, très chaud
// Signature: #C4737A  — dusty rose poudré, LA couleur unique
// SigHover:  #A85963  — dusty rose profond
// SigSoft:   rgba(196,115,122,0.12) — pour les cards/accents doux
// TextPri:   #F5EEE8  — blanc cassé chaud
// TextSec:   rgba(245,238,232,0.55)
// TextTer:   rgba(245,238,232,0.25)
// Border:    rgba(245,238,232,0.07)
// ──────────────────────────────────────────────────────────────────

const C = '#C4737A'
const CSoft = 'rgba(196,115,122,0.12)'
const CSofter = 'rgba(196,115,122,0.06)'
const CBorder = 'rgba(196,115,122,0.25)'
const BG = '#12080E'
const TextPri = '#F5EEE8'
const TextSec = 'rgba(245,238,232,0.55)'
const TextTer = 'rgba(245,238,232,0.25)'
const Border = 'rgba(245,238,232,0.07)'
const CardBG = 'rgba(245,238,232,0.03)'

const testimonials = [
  {
    initials: 'SM',
    color: '#C4737A',
    name: 'Sofia M.',
    role: 'Maman de 2 · Paris',
    quote: "J'ai enfin passé un weekend entier sans un seul appel. Mon mari avait toutes les réponses — sans m'appeler une seule fois.",
  },
  {
    initials: 'KB',
    color: '#8B6B8F',
    name: 'Karim B.',
    role: 'Papa impliqué · Lyon',
    quote: "Je savais jamais comment faire les choses comme elle. Maintenant je consulte l'IA — et je me trompe beaucoup moins. Elle aussi est plus sereine.",
  },
  {
    initials: 'AR',
    color: '#7A8B6B',
    name: 'Amina R.',
    role: 'Maman de 3 · Marseille',
    quote: "La première fois que j'ai vraiment décroché depuis des années. Mon seul regret ? Ne pas l'avoir eu bien plus tôt.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: BG }}>

      {/* ── Ambient light ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: `radial-gradient(circle, ${C}, transparent 70%)`, filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #8B6B8F, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ backdropFilter: 'blur(24px)', background: 'rgba(18,8,14,0.88)', borderColor: Border }}>

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C }}>
            <div className="w-3 h-3 rounded-full bg-white opacity-90" />
          </div>
          <span className="font-bold tracking-tight" style={{ color: TextPri }}>MyOffMode</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          {[
            ['#fonctionnalites', 'Fonctionnalités'],
            ['#temoignages', 'Témoignages'],
            ['#tarifs', 'Tarifs'],
            ['/blog', 'Blog'],
          ].map(([href, label]) => (
            <a key={href} href={href}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: TextSec }}>{label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-sm transition-colors hidden sm:block hover:opacity-80"
            style={{ color: TextSec }}>
            Connexion
          </Link>
          <Link href="/login"
            className="hidden sm:block text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90"
            style={{ background: C }}>
            Essai gratuit →
          </Link>
          {/* Mobile nav component */}
          <MobileNav />
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">

        <div className="relative z-10 max-w-2xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium mb-10 border"
            style={{ background: CSoft, borderColor: CBorder, color: TextSec }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C }} />
            La charge mentale des mamans, enfin prise au sérieux ✦
          </div>

          {/* Headline — Playfair Display */}
          <h1 className="font-serif font-black tracking-tight leading-[1.05] mb-6"
            style={{ color: TextPri, fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
            Tu n&apos;as pas<br />
            <span style={{ color: C, fontStyle: 'italic' }}>à tout porter.</span>
          </h1>

          <p className="text-lg leading-relaxed mb-3 mx-auto max-w-lg" style={{ color: TextSec }}>
            Ce que tu sais — les routines, les habitudes, les petits secrets —
            posé quelque part de sûr.
          </p>
          <p className="text-lg font-semibold mb-12 mx-auto max-w-lg" style={{ color: 'rgba(245,238,232,0.80)' }}>
            Ton partenaire gère. Toi, tu souffles. Vraiment.
          </p>

          {/* CTA unique */}
          <div className="flex flex-col items-center gap-4">
            <Link href="/login"
              className="w-full sm:w-auto font-bold px-10 py-4 rounded-full text-white text-base transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: C, boxShadow: `0 16px 48px rgba(196,115,122,0.35)` }}>
              Je veux enfin souffler — c&apos;est gratuit ✦
            </Link>
            <a href="#fonctionnalites"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: TextTer }}>
              Voir comment ça marche ↓
            </a>
          </div>

          {/* Trust micro-signals */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-10 text-xs"
            style={{ color: TextTer }}>
            <span style={{ color: '#fbbf24' }}>★★★★★</span>
            <span style={{ color: TextTer }}>|</span>
            <span>Sans carte bancaire</span>
            <span style={{ color: TextTer }}>|</span>
            <span>2 minutes pour démarrer</span>
            <span style={{ color: TextTer }}>|</span>
            <span>Données hébergées en EU</span>
          </div>
        </div>

        {/* Chat preview — plus épuré */}
        <div className="relative z-10 mt-20 w-full max-w-md mx-auto">
          <div className="rounded-2xl overflow-hidden border" style={{ background: CardBG, borderColor: Border, backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: Border }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(196,115,122,0.5)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(245,238,232,0.15)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(245,238,232,0.08)' }} />
              </div>
              <div className="flex-1 mx-4 rounded-md px-3 py-1 text-xs text-center border"
                style={{ background: 'rgba(245,238,232,0.03)', borderColor: Border, color: TextTer }}>
                Chat IA MyOffMode
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%] border"
                  style={{ background: 'rgba(245,238,232,0.06)', borderColor: Border, color: TextSec }}>
                  Routine du bain de Lucas ?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[85%] leading-relaxed border"
                  style={{ background: CSoft, borderColor: CBorder, color: '#F0D4D6' }}>
                  Bain tiède à 18h30 ✦ Son canard jaune, shampoing doux sur les tempes. Pyjama bleu étoiles après. Il aime qu&apos;on lui chante &ldquo;Bonne nuit&rdquo; 🌙
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%] border"
                  style={{ background: 'rgba(245,238,232,0.06)', borderColor: Border, color: TextSec }}>
                  Et s&apos;il ne veut pas sortir du bain ?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[85%] leading-relaxed border"
                  style={{ background: CSoft, borderColor: CBorder, color: '#F0D4D6' }}>
                  Elle dit toujours &ldquo;on compte jusqu&apos;à 3 et le canard sort en premier&rdquo; — ça marche à tous les coups 🦆
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="rounded-xl border px-4 py-3 flex items-center gap-3"
                style={{ background: 'rgba(245,238,232,0.02)', borderColor: Border }}>
                <span className="text-sm flex-1" style={{ color: TextTer }}>Pose ta question...</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: CSoft }}>
                  <span style={{ color: C, fontSize: 12 }}>↑</span>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-6 inset-x-20 h-12 rounded-full opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${C}, transparent)`, filter: 'blur(16px)' }} />
        </div>
      </section>

      {/* ── PROBLÈME ───────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: C }}>Le problème</p>
            <h2 className="font-serif font-black tracking-tight leading-tight mb-4"
              style={{ color: TextPri, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Ce n&apos;est pas de la fatigue.<br />
              <span style={{ color: C, fontStyle: 'italic' }}>C&apos;est la charge mentale.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: TextSec }}>
              Tu portes tout dans ta tête — même quand tu essaies de te reposer.
              Et même quand tu t&apos;accordes un moment, il suffit d&apos;un message pour que tout revienne.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { quote: '"Chérie, c\'est où les médicaments ?"', time: '8h12 — samedi matin', icon: '💊' },
              { quote: '"La routine du bain, c\'est comment ?"', time: '18h47 — dimanche soir', icon: '🛁' },
              { quote: '"Je fais quoi pour le dîner ?"', time: '12h03 — ton jour de repos', icon: '🍽️' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 border transition-all hover:border-opacity-50"
                style={{ background: CardBG, borderColor: Border }}>
                <div className="text-2xl mb-4">{item.icon}</div>
                <p className="font-medium mb-3 leading-relaxed text-sm" style={{ color: 'rgba(245,238,232,0.70)' }}>
                  {item.quote}
                </p>
                <p className="text-xs" style={{ color: TextTer }}>{item.time}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-base" style={{ color: TextSec }}>
              Ton jour off vient de se terminer.{' '}
              <span className="font-semibold" style={{ color: TextPri }}>Encore.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ───────────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: C }}>Comment ça marche</p>
            <h2 className="font-serif font-black tracking-tight leading-tight mb-4"
              style={{ color: TextPri, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Dis-nous ce que tu sais.<br />
              <span style={{ color: C, fontStyle: 'italic' }}>On s&apos;occupe du reste.</span>
            </h2>
            <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: TextSec }}>
              10 minutes une fois. Et ta façon de faire, tes petits secrets de maman,
              tes routines — tout ça disponible pour toujours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Card 1 — grande */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-8 border transition-all hover:border-opacity-50 group"
              style={{ background: `linear-gradient(135deg, ${CSoft} 0%, ${CSofter} 100%)`, borderColor: CBorder }}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${C}, transparent)`, filter: 'blur(50px)' }} />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl mb-5 border"
                  style={{ background: CSoft, borderColor: CBorder }}>💭</div>
                <h3 className="font-serif text-xl font-bold mb-2" style={{ color: TextPri }}>
                  Pose ce que tu portes dans ta tête
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: TextSec }}>
                  Routines matin et soir, repas, médicaments, habitudes des enfants,
                  urgences, liste de courses, tes petits secrets de maman.
                  Tu le dis une fois. L&apos;IA s&apos;en souvient pour toujours.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['Routines', 'Repas', 'Médicaments', 'Enfants', 'Urgences', 'Secrets'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs border"
                      style={{ background: 'rgba(245,238,232,0.04)', borderColor: Border, color: TextTer }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — OFF Mode */}
            <div className="relative overflow-hidden rounded-2xl p-8 border transition-all hover:border-opacity-60"
              style={{ background: `linear-gradient(135deg, ${CSoft} 0%, rgba(139,107,143,0.08) 100%)`, borderColor: CBorder }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-50"
                style={{ background: `linear-gradient(90deg, transparent, ${C}, transparent)` }} />
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C }} />
                <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: C }}>OFF Mode</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: TextPri }}>
                1 bouton.<br />Tu décroches.
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: TextSec }}>
                Ton partenaire est notifié. L&apos;IA prend le relais.
                Tu poses le téléphone. <em>Vraiment.</em>
              </p>
            </div>

            {/* Card 3 */}
            <div className="relative overflow-hidden rounded-2xl p-8 border transition-all"
              style={{ background: CardBG, borderColor: Border }}>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl mb-5 border"
                style={{ background: 'rgba(139,107,143,0.1)', borderColor: 'rgba(139,107,143,0.2)' }}>🧠</div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: TextPri }}>IA contextuelle — 24h/24</h3>
              <p className="text-sm leading-relaxed" style={{ color: TextSec }}>
                L&apos;IA répond <em>comme toi</em> — avec tes mots, tes habitudes, ton affection.
                Ton partenaire n&apos;a plus d&apos;excuse pour t&apos;appeler.
              </p>
            </div>

            {/* Card 4 */}
            <div className="relative overflow-hidden rounded-2xl p-8 border transition-all"
              style={{ background: CardBG, borderColor: Border }}>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl mb-5 border"
                style={{ background: 'rgba(122,139,107,0.1)', borderColor: 'rgba(122,139,107,0.2)' }}>✓</div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: TextPri }}>Il gère — vraiment</h3>
              <p className="text-sm leading-relaxed" style={{ color: TextSec }}>
                Checklist du jour, courses, réponses instantanées.
                Ton partenaire devient autonome. Sans que tu aies à tout réexpliquer.
              </p>
            </div>

            {/* Card 5 */}
            <div className="relative overflow-hidden rounded-2xl p-8 border transition-all"
              style={{ background: CardBG, borderColor: Border }}>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl mb-5 border"
                style={{ background: CSofter, borderColor: 'rgba(196,115,122,0.15)' }}>✉️</div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: TextPri }}>Invitation en 1 clic</h3>
              <p className="text-sm leading-relaxed" style={{ color: TextSec }}>
                Un lien. Ton partenaire rejoint ta famille.
                Accès immédiat à tout ce que tu as partagé.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ────────────────────────────────────────── */}
      <section id="temoignages" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: C }}>Elles ont osé</p>
            <h2 className="font-serif font-black tracking-tight leading-tight"
              style={{ color: TextPri, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              &ldquo;Finalement, quelqu&apos;un<br />
              <span style={{ color: C, fontStyle: 'italic' }}>me comprend.&rdquo;</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border flex flex-col h-full transition-all"
                style={{ background: CardBG, borderColor: Border }}>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-sm" style={{ color: '#fbbf24' }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-6 italic"
                  style={{ color: 'rgba(245,238,232,0.65)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: Border }}>
                  {/* Initiales colorées — pas de photo stock */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TextPri }}>{t.name}</p>
                    <p className="text-xs" style={{ color: TextTer }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof bar */}
          <div className="mt-10 rounded-2xl p-6 border text-center"
            style={{ background: CSofter, borderColor: CBorder }}>
            <p className="text-sm" style={{ color: TextSec }}>
              Rejoins les mamans qui ont retrouvé leur espace ✦
            </p>
            <p className="text-xs mt-1" style={{ color: TextTer }}>
              Sans engagement · Données protégées · RGPD compliant
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="tarifs" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: C }}>Tarifs</p>
            <h2 className="font-serif font-black tracking-tight mb-3"
              style={{ color: TextPri, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Simple. Transparent.
            </h2>
            <p className="text-base" style={{ color: TextSec }}>
              Commence gratuitement. Upgrade quand tu te sens prête.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">

            {/* Gratuit */}
            <div className="rounded-2xl p-7 border flex flex-col transition-all hover:border-opacity-50"
              style={{ background: CardBG, borderColor: Border }}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: TextTer }}>Gratuit</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black" style={{ color: TextPri }}>0€</span>
                <span className="text-sm pb-1" style={{ color: TextTer }}>/mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['3 routines', 'Chat IA — 5 messages/jour', '1 enfant', 'OFF Mode basique'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: TextSec }}>
                    <span style={{ color: C }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login"
                className="w-full py-3 rounded-xl text-sm font-semibold text-center border transition-all hover:border-opacity-50"
                style={{ background: 'rgba(245,238,232,0.04)', borderColor: Border, color: TextSec }}>
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro — recommandé */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col shadow-2xl"
              style={{ boxShadow: `0 24px 64px rgba(196,115,122,0.25)` }}>
              <div className="absolute inset-0" style={{ background: C }} />
              <div className="absolute inset-0 opacity-15"
                style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
              <div className="relative p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">Pro</p>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-white/20">
                    ✦ Populaire
                  </span>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white">7€</span>
                  <span className="text-white/60 text-sm pb-1">/mois</span>
                </div>
                <p className="text-white/50 text-xs mb-6">7 jours d&apos;essai gratuit — sans CB</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Routines illimitées', 'Chat IA 24h/24', "Jusqu'à 3 enfants", 'OFF Mode complet', 'Liste de courses IA', 'Rapport quotidien partenaire'].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white">
                      <span className="text-white/60">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login"
                  className="w-full py-3 rounded-xl text-sm font-bold text-center bg-white hover:bg-white/90 transition-all"
                  style={{ color: '#9B4A52' }}>
                  Essayer 7 jours gratuitement →
                </Link>
              </div>
            </div>

            {/* Famille */}
            <div className="rounded-2xl p-7 border flex flex-col transition-all hover:border-opacity-50"
              style={{ background: CardBG, borderColor: Border }}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: TextTer }}>Famille</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black" style={{ color: TextPri }}>12€</span>
                <span className="text-sm pb-1" style={{ color: TextTer }}>/mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Tout du plan Pro", "Partenaire inclus", "Jusqu'à 5 enfants", "Notifications push", "Rapport hebdomadaire", "Support prioritaire"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: TextSec }}>
                    <span style={{ color: C }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login"
                className="w-full py-3 rounded-xl text-sm font-semibold text-center border transition-all hover:border-opacity-50"
                style={{ background: 'rgba(245,238,232,0.04)', borderColor: Border, color: TextSec }}>
                Choisir le plan Famille
              </Link>
            </div>
          </div>

          {/* Garantie */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: TextTer }}>
              Sans engagement · Annulation en 1 clic · Paiement sécurisé Stripe
            </p>
            <p className="text-xs mt-2" style={{ color: TextTer }}>
              Si dans 7 jours tu ne te sens pas allégée — tu annules. Aucune question posée.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ rapide ─────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif font-bold text-center mb-8 text-2xl" style={{ color: TextPri }}>
            Questions fréquentes
          </h2>
          {[
            {
              q: "Est-ce que mon partenaire doit s'inscrire ?",
              a: "Oui, ton partenaire crée un compte gratuit et rejoint ton espace famille en 1 clic via un lien d'invitation. Il accède ensuite à toutes les routines et peut poser ses questions à l'IA.",
            },
            {
              q: "Mes données sont-elles protégées ?",
              a: "Absolument. Toutes les données sont hébergées en Europe (RGPD compliant), chiffrées, et ne sont jamais partagées. Tu peux supprimer ton compte à tout moment.",
            },
            {
              q: "Est-ce que ça fonctionne si mon partenaire n'est pas à la maison ?",
              a: "Oui ! L'IA est accessible partout, 24h/24. Même si ton partenaire est au bureau, il peut consulter les routines et poser ses questions depuis son téléphone.",
            },
            {
              q: "Est-ce que MyOffMode remplace un thérapeute ?",
              a: "Non. MyOffMode est un outil d'organisation familiale pour réduire la charge logistique. Il ne se substitue pas à un suivi médical ou psychologique. En cas de détresse sérieuse, consulte un professionnel de santé.",
            },
          ].map((item, i) => (
            <details key={i} className="group rounded-xl border overflow-hidden"
              style={{ background: CardBG, borderColor: Border }}>
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium"
                style={{ color: TextPri }}>
                {item.q}
                <span className="text-white/30 ml-4 group-open:rotate-45 transition-transform duration-200 flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed border-t" style={{ color: TextSec, borderColor: Border }}>
                <div className="pt-3">{item.a}</div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-14 border"
            style={{ background: `linear-gradient(135deg, ${CSoft} 0%, rgba(139,107,143,0.08) 50%, ${CSofter} 100%)`, borderColor: CBorder }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${C}, transparent)` }} />
            <div className="relative">
              <p className="text-4xl mb-6" aria-hidden>✦</p>
              <h2 className="font-serif font-black tracking-tight leading-tight mb-4"
                style={{ color: TextPri, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                Tu mérites de<br />
                <span style={{ color: C, fontStyle: 'italic' }}>vraiment décrocher.</span>
              </h2>
              <p className="text-base mb-10 leading-relaxed" style={{ color: TextSec }}>
                10 minutes pour configurer.<br />
                <span className="font-semibold" style={{ color: 'rgba(245,238,232,0.80)' }}>
                  Une vie entière pour en profiter.
                </span>
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-3 font-bold px-10 py-4 rounded-full text-white text-base transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: C, boxShadow: `0 16px 48px rgba(196,115,122,0.35)` }}>
                Je veux enfin souffler ✦
              </Link>
              <p className="text-xs mt-5" style={{ color: TextTer }}>
                Sans carte bancaire · 2 minutes pour démarrer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: Border }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C }}>
                  <div className="w-3 h-3 rounded-full bg-white opacity-90" />
                </div>
                <span className="font-bold" style={{ color: TextPri }}>MyOffMode</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: TextTer }}>
                L&apos;espace où les mamans déposent leur charge mentale.<br />
                Fait avec soin pour les familles d&apos;aujourd&apos;hui.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: TextTer }}>
                  Produit
                </p>
                <div className="space-y-2">
                  <a href="#fonctionnalites" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Fonctionnalités</a>
                  <a href="#tarifs" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Tarifs</a>
                  <Link href="/blog" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Blog</Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: TextTer }}>
                  Support
                </p>
                <div className="space-y-2">
                  <Link href="/support" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Aide</Link>
                  <Link href="/login" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Connexion</Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: TextTer }}>
                  Légal
                </p>
                <div className="space-y-2">
                  <Link href="/privacy" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Confidentialité</Link>
                  <Link href="/terms" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>CGU</Link>
                  <Link href="/mentions-legales" className="block hover:opacity-80 transition-opacity" style={{ color: TextSec }}>Mentions légales</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: Border }}>
            <p className="text-xs" style={{ color: TextTer }}>
              © 2026 MyOffMode · Fait avec soin pour les mamans ✦
            </p>
            <p className="text-xs text-center" style={{ color: TextTer }}>
              MyOffMode est un outil d&apos;organisation familiale.
              Il ne remplace pas un professionnel de santé.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
