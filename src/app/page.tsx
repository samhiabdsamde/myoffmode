import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="font-bold text-white tracking-tight">MyOffMode</span>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          {['Fonctionnalités', 'Témoignages', 'Tarifs'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-sm text-white/50 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
            Connexion
          </Link>
          <Link href="/login"
            className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-all">
            Essai gratuit →
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-orange-500/6 blur-[80px] pointer-events-none" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-white/70 mb-8 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            N°1 des applis anti charge mentale · Nouveau en 2026
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6">
            <span className="text-white">Ton premier</span>
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              vrai OFF Mode.
            </span>
          </h1>

          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
            Encode tes routines une fois. L&apos;IA explique ta façon de faire à ton partenaire.
            <br className="hidden sm:block" />
            <span className="text-white/80"> La maison tourne — même quand tu décroches.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/login"
              className="w-full sm:w-auto bg-rose-500 hover:bg-rose-400 text-white font-semibold px-8 py-4 rounded-full text-base transition-all shadow-2xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02]">
              Activer mon OFF Mode — Gratuit ✦
            </Link>
            <Link href="#fonctionnalités"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium px-8 py-4 rounded-full text-base transition-all backdrop-blur-sm">
              Voir comment ça marche
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <span className="text-yellow-400">★★★★★</span> 4.9/5
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span>+2 400 familles</span>
            <span className="w-px h-4 bg-white/10" />
            <span>Sans carte bancaire</span>
          </div>
        </div>

        {/* Hero visual — app mockup */}
        <div className="relative z-10 mt-20 w-full max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#111118]">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 text-center">
                myoffmode.com/dashboard
              </div>
            </div>
            {/* App preview */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Left panel */}
              <div className="col-span-1 space-y-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-white/40 mb-1">OFF Mode</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-semibold text-rose-400">Activé</span>
                  </div>
                </div>
                {['Routines', 'Enfants', 'Repas', 'Urgences'].map(item => (
                  <div key={item} className="bg-white/[0.03] rounded-lg px-3 py-2 text-xs text-white/40 hover:bg-white/[0.06] transition-colors cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
              {/* Chat panel */}
              <div className="col-span-2 space-y-3">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 mb-3">Chat avec l&apos;IA</p>
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-white/10 rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white/70 max-w-[80%]">
                        C&apos;est quoi la routine du bain de Lucas ?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-rose-500/20 border border-rose-500/20 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-rose-200 max-w-[85%] leading-relaxed">
                        Lucas (4 ans) aime un bain tiède à 18h30. Toujours son canard jaune. Shampoing doux uniquement. Après le bain, pyjama bleu en premier 🛁
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-xs text-white/30">Routines actives</p>
                    <p className="text-2xl font-bold text-white mt-1">12</p>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                    <p className="text-xs text-rose-300/60">Enfants</p>
                    <p className="text-2xl font-bold text-rose-300 mt-1">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute -bottom-10 inset-x-20 h-20 bg-rose-500/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ── LOGOS / TRUST ───────────────────────────────────────── */}
      <section className="py-10 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-xs text-white/25 uppercase tracking-widest mb-6">Elles ont récupéré leur week-end</p>
          <div className="flex flex-wrap justify-center gap-8 text-white/20 text-sm font-medium">
            {['Sofia M. · Paris', 'Amina R. · Lyon', 'Céline D. · Bordeaux', 'Julie K. · Nantes', 'Sarah T. · Toulouse'].map(name => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-4">Le problème</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Tu te reconnais dans ça ?
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { quote: '"Chérie, c\'est où les médicaments ?"', time: '8h12 un samedi matin' },
              { quote: '"La routine du bain, c\'est comment ?"', time: '18h47 le dimanche soir' },
              { quote: '"Je fais quoi pour le dîner ?"', time: '12h03 ton jour de repos' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative border border-white/[0.06] rounded-2xl p-6 bg-white/[0.02] hover:border-white/10 transition-all">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-sm font-bold mb-4">
                    ?
                  </div>
                  <p className="text-white/80 font-medium mb-3 leading-relaxed">{item.quote}</p>
                  <p className="text-xs text-white/25">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-white/40 text-base">
              Ton jour off vient de se terminer. <span className="text-white/80 font-semibold">Encore.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION — BENTO GRID ────────────────────────────────── */}
      <section id="fonctionnalités" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-4">La solution</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              MyOffMode change tout ça
            </h2>
            <p className="text-white/40 mt-4 text-lg">En 10 minutes d&apos;onboarding, tu libères des années de charge mentale.</p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Big card — Onboarding */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 group hover:border-white/10 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-2xl mb-5">
                  📝
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Encode tes routines en 7 étapes</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Enfants, repas, routines matin/soir, urgences, liste de courses, secrets de maman.
                  Ton foyer complet. Encodé une seule fois.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['Enfants', 'Repas', 'Matin', 'Soir', 'Urgences', 'Secrets'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card — IA */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 group hover:border-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-2xl mb-5">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-white mb-2">IA contextuelle 24h/24</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Claude mémorise ta façon de faire. Ton partenaire pose ses questions, l&apos;IA répond <em>à ta manière</em>.
                </p>
              </div>
            </div>

            {/* Card — Off Mode */}
            <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 group hover:border-rose-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">OFF Mode actif</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Active ton OFF Mode</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  1 bouton. Ton partenaire est notifié. L&apos;IA prend le relais. Tu décroches <em>vraiment</em>.
                </p>
              </div>
            </div>

            {/* Card — Partenaire */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 group hover:border-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-2xl mb-5">
                  💪
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Papa gère — vraiment</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Checklist du jour, liste de courses, réponses instantanées. Plus aucune raison d&apos;appeler.
                </p>
              </div>
            </div>

            {/* Card — Invitation */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 group hover:border-white/10 transition-all">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-2xl mb-5">
                  🔗
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Invitation en 1 clic</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Partage un lien. Ton partenaire rejoint ton espace famille. Accès immédiat à l&apos;IA.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ─────────────────────────────────────────── */}
      <section id="témoignages" className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-4">Témoignages</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Elles ont activé leur OFF Mode
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: 'Sofia M.', role: 'Maman de 2 enfants, Paris',
                quote: "J'ai enfin passé un weekend entier sans un seul appel. MyOffMode a tout expliqué à mon mari mieux que moi.",
                img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
              },
              {
                name: 'Karim B.', role: 'Papa impliqué, Lyon',
                quote: "Je savais jamais comment faire les choses comme elle. Maintenant je demande à l'IA — c'est bluffant.",
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
              },
              {
                name: 'Amina R.', role: 'Maman de 3 enfants, Marseille',
                quote: "La première fois que j'ai vraiment décroché depuis des années. Mon seul regret ? Ne pas l'avoir eu plus tôt.",
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
              },
            ].map((t, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative border border-white/[0.06] rounded-2xl p-6 bg-white/[0.02] hover:border-white/10 transition-all h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/30">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section id="tarifs" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-4">Tarifs</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Simple et transparent
            </h2>
            <p className="text-white/40 mt-4">Commence gratuitement. Upgrade quand tu es prête.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 flex flex-col hover:border-white/10 transition-all">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Gratuit</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">0€</span>
                <span className="text-white/30 text-sm pb-1">/mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['3 routines', 'Chat IA 5 msg/jour', '1 enfant', 'OFF Mode basique'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                    <span className="text-white/20">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login"
                className="w-full py-3 rounded-xl text-sm font-semibold text-center bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all">
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500 to-rose-600" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="relative p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">Pro</p>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Populaire</span>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white">7€</span>
                  <span className="text-white/60 text-sm pb-1">/mois</span>
                </div>
                <p className="text-white/60 text-xs mb-6">7 jours d&apos;essai gratuit</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Routines illimitées', 'Chat IA illimité 24h/24', "Jusqu'à 3 enfants", 'OFF Mode complet', 'Liste de courses IA', 'Rapport quotidien'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white">
                      <span className="text-white/60">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login"
                  className="w-full py-3 rounded-xl text-sm font-bold text-center bg-white text-rose-500 hover:bg-white/90 transition-all shadow-lg">
                  Activer le Pro →
                </Link>
              </div>
            </div>

            {/* Famille */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex flex-col hover:border-white/20 transition-all">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Famille</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">12€</span>
                <span className="text-white/30 text-sm pb-1">/mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Tout du Pro", "Compte partenaire inclus", "Jusqu'à 5 enfants", 'Notifications partenaire', 'Rapport hebdomadaire', 'Support prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="text-white/30">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login"
                className="w-full py-3 rounded-xl text-sm font-semibold text-center bg-white/5 border border-white/10 text-white/70 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-white transition-all">
                Activer Famille
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-white/25 mt-8">
            Sans engagement · Annulation en 1 clic · Paiement sécurisé Stripe
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
                <div className="w-5 h-5 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
                Tu mérites de vraiment décrocher.
              </h2>
              <p className="text-white/40 text-lg mb-10 leading-relaxed">
                10 minutes pour configurer.
                <br />
                <span className="text-white/70">Une vie entière pour en profiter.</span>
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02]">
                Activer mon OFF Mode gratuit
                <span className="text-xl">🔴</span>
              </Link>
              <p className="text-xs text-white/25 mt-4">Sans carte bancaire · 2 minutes pour démarrer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-bold text-white tracking-tight">MyOffMode</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
            <Link href="/support" className="hover:text-white/60 transition-colors">Support</Link>
            <a href="#pricing" className="hover:text-white/60 transition-colors">Tarifs</a>
          </div>
          <p className="text-xs text-white/20">© 2026 MyOffMode · Fait avec ❤️ pour toutes les mamans</p>
        </div>
      </footer>

    </div>
  )
}
