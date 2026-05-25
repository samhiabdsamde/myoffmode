import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #1a0a14 0%, #2d0f22 25%, #1a0a2e 60%, #0f0a1a 100%)' }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.05]" style={{ backdropFilter: 'blur(20px)', background: 'rgba(26,10,20,0.85)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}>
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="font-bold text-white tracking-tight">MyOffMode</span>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          {[['#fonctionnalites', 'Fonctionnalités'], ['#temoignages', 'Témoignages'], ['#tarifs', 'Tarifs']].map(([href, label]) => (
            <a key={href} href={href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/40 hover:text-white/70 transition-colors hidden sm:block">Connexion</Link>
          <Link href="/login" className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}>
            Essai gratuit →
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden">

        {/* Warm glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/5 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 right-1/5 w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/70 mb-8 border border-white/10" style={{ background: 'rgba(244,63,94,0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            2 400 mamans ont retrouvé leur temps libre ✨
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] mb-6">
            <span className="text-white/90">Tu mérites de</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #fb7185 0%, #f97316 50%, #fb923c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              vraiment souffler.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed mb-4">
            Encode tes routines une fois.
            L&apos;IA explique ta façon de faire à ton partenaire.
          </p>
          <p className="text-lg sm:text-xl font-semibold text-white/80 max-w-xl mx-auto mb-12">
            La maison tourne — même quand tu décroches. 🔴
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/login"
              className="w-full sm:w-auto font-bold px-10 py-4 rounded-full text-white text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', boxShadow: '0 20px 60px rgba(244,63,94,0.4)' }}>
              Activer mon OFF Mode — Gratuit ✦
            </Link>
            <Link href="#fonctionnalites"
              className="w-full sm:w-auto font-medium px-10 py-4 rounded-full text-white/60 text-base border border-white/10 hover:border-white/20 hover:text-white/80 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              Voir comment ça marche
            </Link>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
            <span className="flex items-center gap-1.5">
              <span style={{ color: '#fbbf24' }}>★★★★★</span> 4.9/5
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span>Sans carte bancaire</span>
            <span className="w-px h-4 bg-white/10" />
            <span>2 minutes pour démarrer</span>
          </div>
        </div>

        {/* App mockup */}
        <div className="relative z-10 mt-20 w-full max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(244,63,94,0.5)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(251,146,60,0.5)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.4)' }} />
              </div>
              <div className="flex-1 mx-4 rounded-md px-3 py-1 text-xs text-white/20 text-center border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                myoffmode.com/dashboard
              </div>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-3">
                <div className="rounded-xl p-3 border border-rose-500/20" style={{ background: 'rgba(244,63,94,0.08)' }}>
                  <p className="text-xs text-white/30 mb-1">OFF Mode</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    <span className="text-xs font-semibold text-rose-300">Activé 🔴</span>
                  </div>
                </div>
                {['Routines', 'Enfants', 'Repas', 'Urgences'].map(item => (
                  <div key={item} className="rounded-lg px-3 py-2 text-xs text-white/30 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="col-span-2 space-y-3">
                <div className="rounded-xl p-4 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-xs text-white/20 mb-3">Chat IA</p>
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white/60 max-w-[80%] border border-white/8" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        Routine du bain de Lucas ?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-rose-200 max-w-[85%] leading-relaxed border border-rose-500/15" style={{ background: 'rgba(244,63,94,0.12)' }}>
                        Bain tiède à 18h30, son canard jaune, shampoing doux. Pyjama bleu après 🛁
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-xs text-white/20">Routines</p>
                    <p className="text-2xl font-black text-white mt-1">12</p>
                  </div>
                  <div className="rounded-xl p-3 border border-rose-500/20" style={{ background: 'rgba(244,63,94,0.08)' }}>
                    <p className="text-xs text-rose-300/40">Enfants</p>
                    <p className="text-2xl font-black text-rose-300 mt-1">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 inset-x-24 h-16 rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse, #f43f5e, transparent)', filter: 'blur(20px)' }} />
        </div>
      </section>

      {/* ── PROBLÈME ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#fb923c' }}>Le problème</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white/90 leading-tight">
              Ton jour de repos ?<br />
              <span style={{ background: 'linear-gradient(135deg, #fb7185, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Interrompu. Encore.
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { quote: '"Chérie, c\'est où les médicaments ?"', time: '8h12 · samedi matin', emoji: '💊' },
              { quote: '"La routine du bain, c\'est comment ?"', time: '18h47 · dimanche soir', emoji: '🛁' },
              { quote: '"Je fais quoi pour le dîner ?"', time: '12h03 · ton jour de repos', emoji: '🍽️' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/8 hover:border-rose-500/20 transition-all group" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-3xl mb-4">{item.emoji}</div>
                <p className="text-white/70 font-medium mb-3 leading-relaxed">{item.quote}</p>
                <p className="text-xs text-white/20">{item.time}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 mt-8 text-base">
            Ton jour off vient de se terminer.{' '}
            <span className="text-white/80 font-semibold">Encore.</span>
          </p>
        </div>
      </section>

      {/* ── SOLUTION BENTO ──────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#c084fc' }}>La solution</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white/90">
              10 minutes.<br />
              <span style={{ background: 'linear-gradient(135deg, #c084fc, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Une liberté retrouvée.
              </span>
            </h2>
            <p className="text-white/40 mt-4 text-lg">Encode une fois. L&apos;IA s&apos;occupe du reste — pour toujours.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Card 1 — big */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-8 border border-white/8 hover:border-rose-500/20 transition-all group" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}>
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #f43f5e, transparent)', filter: 'blur(60px)' }} />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-5 border border-rose-500/20" style={{ background: 'rgba(244,63,94,0.1)' }}>📝</div>
                <h3 className="text-xl font-bold text-white mb-2">Encode tout en 7 étapes guidées</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Enfants, repas, routines matin/soir, urgences, liste de courses, tes petits secrets de maman. Tout y est. Pour toujours.</p>
                <div className="flex gap-2 flex-wrap">
                  {['Enfants', 'Repas', 'Matin', 'Soir', 'Urgences', 'Secrets'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs border border-white/8 text-white/40" style={{ background: 'rgba(255,255,255,0.04)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative overflow-hidden rounded-2xl p-8 border border-white/8 hover:border-purple-500/30 transition-all" style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}>
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, #c084fc, transparent 60%)' }} />
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-5 border border-purple-500/20" style={{ background: 'rgba(192,132,252,0.1)' }}>🧠</div>
              <h3 className="text-xl font-bold text-white mb-2">IA contextuelle 24h/24</h3>
              <p className="text-white/40 text-sm leading-relaxed">Claude retient ta façon de faire. Ton partenaire pose ses questions, l&apos;IA répond <em>comme toi</em>.</p>
            </div>

            {/* Card 3 — OFF Mode */}
            <div className="relative overflow-hidden rounded-2xl p-8 border border-rose-500/25 hover:border-rose-500/40 transition-all" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(251,146,60,0.05) 100%)' }}>
              <div className="absolute top-0 left-0 w-full h-1 opacity-60" style={{ background: 'linear-gradient(90deg, #f43f5e, #fb923c)' }} />
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">OFF Mode</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1 bouton. Tu décroches.</h3>
              <p className="text-white/40 text-sm leading-relaxed">Ton partenaire est notifié. L&apos;IA prend le relais. Tu poses le téléphone. <em>Vraiment.</em></p>
            </div>

            {/* Card 4 */}
            <div className="relative overflow-hidden rounded-2xl p-8 border border-white/8 hover:border-green-500/20 transition-all" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-5 border border-green-500/15" style={{ background: 'rgba(34,197,94,0.08)' }}>💪</div>
              <h3 className="text-xl font-bold text-white mb-2">Papa gère — vraiment</h3>
              <p className="text-white/40 text-sm leading-relaxed">Checklist du jour, courses, réponses instantanées. Plus aucune raison d&apos;appeler.</p>
            </div>

            {/* Card 5 */}
            <div className="relative overflow-hidden rounded-2xl p-8 border border-white/8 hover:border-blue-500/20 transition-all" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-5 border border-blue-500/15" style={{ background: 'rgba(59,130,246,0.08)' }}>🔗</div>
              <h3 className="text-xl font-bold text-white mb-2">Invitation en 1 clic</h3>
              <p className="text-white/40 text-sm leading-relaxed">Un lien. Ton partenaire rejoint. Accès immédiat à l&apos;IA. C&apos;est tout.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ─────────────────────────────────────────── */}
      <section id="temoignages" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#fb923c' }}>Témoignages</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white/90">
              Elles ont activé
              <br />
              <span style={{ background: 'linear-gradient(135deg, #fb923c, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                leur OFF Mode.
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Sofia M.', role: 'Maman de 2 enfants · Paris', quote: "J'ai enfin passé un weekend entier sans un seul appel. MyOffMode a tout expliqué à mon mari mieux que moi.", img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face' },
              { name: 'Karim B.', role: 'Papa impliqué · Lyon', quote: "Je savais jamais comment faire les choses comme elle. Maintenant je demande à l'IA — c'est bluffant.", img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
              { name: 'Amina R.', role: 'Maman de 3 enfants · Marseille', quote: "La première fois que j'ai vraiment décroché depuis des années. Mon seul regret ? Ne pas l'avoir eu plus tôt.", img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face' },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/8 hover:border-white/12 transition-all flex flex-col h-full" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-sm" style={{ color: '#fbbf24' }}>★</span>)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                  <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/25">{t.role}</p>
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
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#c084fc' }}>Tarifs</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white/90">Simple. Transparent.</h2>
            <p className="text-white/40 mt-4">Commence gratuitement. Upgrade quand tu es prête.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Free */}
            <div className="rounded-2xl p-7 border border-white/8 flex flex-col hover:border-white/12 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Gratuit</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">0€</span>
                <span className="text-white/25 text-sm pb-1">/mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['3 routines', 'Chat IA · 5 msg/jour', '1 enfant', 'OFF Mode basique'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/40">
                    <span className="text-white/20">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3 rounded-xl text-sm font-semibold text-center border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all" style={{ background: 'rgba(255,255,255,0.04)' }}>
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #c026d3 100%)' }} />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
              <div className="relative p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">Pro</p>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>⭐ Populaire</span>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white">7€</span>
                  <span className="text-white/50 text-sm pb-1">/mois</span>
                </div>
                <p className="text-white/50 text-xs mb-6">7 jours d&apos;essai gratuit</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Routines illimitées', 'Chat IA 24h/24', "Jusqu'à 3 enfants", 'OFF Mode complet', 'Liste de courses IA', 'Rapport quotidien'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white">
                      <span className="text-white/60">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="w-full py-3 rounded-xl text-sm font-bold text-center bg-white hover:bg-white/90 transition-all shadow-lg" style={{ color: '#e11d48' }}>
                  Activer le Pro →
                </Link>
              </div>
            </div>

            {/* Famille */}
            <div className="rounded-2xl p-7 border border-white/10 flex flex-col hover:border-white/20 transition-all" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Famille</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">12€</span>
                <span className="text-white/25 text-sm pb-1">/mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Tout du Pro', 'Partenaire inclus', "Jusqu'à 5 enfants", 'Notifications', 'Rapport hebdo', 'Support prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                    <span className="text-white/25">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3 rounded-xl text-sm font-semibold text-center border border-white/10 text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.04)' }}>
                Activer Famille
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-white/20 mt-8">
            Sans engagement · Annulation en 1 clic · Paiement sécurisé Stripe
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-14 border border-white/8">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(192,132,252,0.08) 50%, rgba(251,146,60,0.1) 100%)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.6), transparent)' }} />
            <div className="relative">
              <div className="text-5xl mb-6">🔴</div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white/90 mb-4 leading-tight">
                Tu mérites de
                <br />
                <span style={{ background: 'linear-gradient(135deg, #fb923c, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  vraiment décrocher.
                </span>
              </h2>
              <p className="text-white/40 text-lg mb-10 leading-relaxed">
                10 minutes pour configurer.<br />
                <span className="text-white/70 font-medium">Une vie entière pour en profiter.</span>
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-3 font-bold px-10 py-5 rounded-full text-white text-lg transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', boxShadow: '0 20px 60px rgba(244,63,94,0.35)' }}>
                Activer mon OFF Mode gratuit 🔴
              </Link>
              <p className="text-xs text-white/20 mt-5">Sans carte bancaire · 2 minutes pour démarrer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}>
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-bold text-white tracking-tight">MyOffMode</span>
          </div>
          <div className="flex gap-6 text-sm text-white/25">
            <Link href="/blog" className="hover:text-white/50 transition-colors">Blog</Link>
            <Link href="/support" className="hover:text-white/50 transition-colors">Support</Link>
            <a href="#tarifs" className="hover:text-white/50 transition-colors">Tarifs</a>
          </div>
          <p className="text-xs text-white/15">© 2026 MyOffMode · Fait avec ❤️ pour les mamans</p>
        </div>
      </footer>

    </div>
  )
}
