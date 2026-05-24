import Link from 'next/link'
import Image from 'next/image'

const steps = [
  {
    emoji: '📝',
    title: 'Maman encode ses routines',
    desc: "En 10 minutes, elle décrit sa façon de faire — comme si elle l'expliquait à une personne de confiance.",
  },
  {
    emoji: '🧠',
    title: "L'IA mémorise tout",
    desc: "MyOffMode apprend les méthodes, recettes, habitudes et petits détails de maman. Chaque famille est unique.",
  },
  {
    emoji: '💪',
    title: 'Papa gère — vraiment',
    desc: "Checklist du jour, liste de courses, réponses IA instantanées. Plus aucune raison d'appeler.",
  },
]

const testimonials = [
  {
    name: 'Sofia M.',
    role: 'Maman de 2 enfants',
    quote: "J'ai enfin passé un weekend entier sans un seul appel. MyOffMode a tout expliqué à mon mari mieux que moi.",
    stars: 5,
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Karim B.',
    role: 'Papa impliqué',
    quote: "Je savais jamais comment faire les choses comme elle. Maintenant je demande à l'IA — c'est bluffant.",
    stars: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Amina R.',
    role: 'Maman de 3 enfants',
    quote: "La première fois que j'ai vraiment décroché depuis des années. Mon seul regret ? Ne pas l'avoir eu plus tôt.",
    stars: 5,
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '',
    desc: 'Pour découvrir',
    color: 'bg-white border border-gray-200',
    textColor: 'text-gray-900',
    btnClass: 'bg-gray-900 text-white hover:bg-black',
    features: ['3 routines', 'Chat IA — 5 msg/jour', '1 profil enfant', 'OFF Mode basique'],
    cta: 'Commencer gratuitement',
    href: '/login',
    badge: null,
  },
  {
    name: 'Pro',
    price: '7€',
    period: '/mois',
    desc: 'Le plus populaire',
    color: 'bg-rose-500',
    textColor: 'text-white',
    btnClass: 'bg-white text-rose-600 hover:bg-rose-50',
    features: ['Routines illimitées', 'Chat IA illimité 24h/24', 'Jusqu\'à 3 enfants', 'OFF Mode complet', 'Liste de courses IA', 'Rapport quotidien'],
    cta: 'Activer le Pro',
    href: '/login',
    badge: '⭐ Populaire',
  },
  {
    name: 'Famille',
    price: '12€',
    period: '/mois',
    desc: 'Pour les couples',
    color: 'bg-gray-900',
    textColor: 'text-white',
    btnClass: 'bg-rose-500 text-white hover:bg-rose-600',
    features: ['Tout du plan Pro', 'Compte partenaire inclus', 'Jusqu\'à 5 enfants', 'Notifications partenaire', 'Rapport hebdomadaire', 'Support prioritaire'],
    cta: 'Activer Famille',
    href: '/login',
    badge: '👨‍👩‍👧 Couple',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔴</span>
          <span className="font-bold text-gray-900 text-lg">MyOffMode</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:block">
            Tarifs
          </Link>
          <Link href="/login" className="bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-rose-600 transition">
            Commencer →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-0 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-rose-100">
          🔴 N°1 des applis anti charge mentale avec IA
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.1] mb-5 tracking-tight">
          Ton premier vrai<br />
          <span className="text-rose-500">OFF Mode.</span>
        </h1>
        <p className="text-gray-500 text-lg mb-3 leading-relaxed max-w-lg mx-auto">
          Encode tes routines une fois.
          L'IA explique ta façon de faire à ton partenaire.
          La maison tourne — même quand tu décroches.
        </p>
        <p className="text-sm text-gray-400 italic mb-8">"The home handles itself."</p>
        <Link
          href="/login"
          className="inline-block bg-rose-500 text-white px-10 py-4 rounded-2xl text-base font-bold hover:bg-rose-600 transition shadow-xl shadow-rose-200"
        >
          Activer mon OFF Mode — Gratuit →
        </Link>
        <p className="text-xs text-gray-400 mt-3">Sans carte bancaire · 2 minutes pour démarrer</p>

        {/* Hero image */}
        <div className="mt-12 relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop&crop=center"
            alt="Maman qui se repose enfin"
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-semibold">OFF Mode activé — La maison est gérée 💪</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problème */}
      <section className="px-6 py-16 mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop&crop=center"
                alt="Maman stressée par les appels"
                className="w-full h-64 object-cover"
              />
            </div>
            <div>
              <p className="text-3xl mb-4">😩</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Tu te reconnais dans ça ?
              </h2>
              <div className="space-y-3">
                {[
                  '"Chérie, c\'est où les médicaments ?"',
                  '"La routine du bain, c\'est comment ?"',
                  '"Je fais quoi pour le dîner ?"',
                ].map(q => (
                  <div key={q} className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                    <p className="text-sm font-medium text-rose-800">{q}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Ton jour off vient de se terminer. <strong className="text-gray-900">Encore.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">MyOffMode change ça</h2>
            <p className="text-gray-500">Simple. Puissant. Fait pour toi.</p>
          </div>
          <div className="grid gap-4">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 flex gap-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="text-3xl flex-shrink-0">{s.emoji}</div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{s.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual lifestyle */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Imagine ton prochain weekend.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                Téléphone posé. Silence. Un café chaud.<br />
                Ton partenaire gère — et il sait comment faire.<br />
                Parce que l'IA lui a tout expliqué, à ta façon.
              </p>
              <div className="bg-gray-900 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">OFF Mode activé</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  "Elle est en OFF Mode. Tu gères — l'IA t'aide. 💪"<br />
                  <span className="text-white">Notification envoyée à ton partenaire.</span>
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=500&fit=crop&crop=center"
                alt="Maison organisée, famille heureuse"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="px-6 py-16 bg-rose-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Elles ont activé leur OFF Mode</h2>
            <p className="text-gray-500 text-sm">Des vraies familles. Des vrais week-ends.</p>
          </div>
          <div className="grid gap-4">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple et transparent</h2>
            <p className="text-gray-500">Commence gratuitement. Upgrade quand tu es prête.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p.name} className={`${p.color} rounded-3xl p-6 flex flex-col relative overflow-hidden`}>
                {p.badge && (
                  <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {p.badge}
                  </div>
                )}
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 opacity-60 ${p.textColor}`}>{p.desc}</p>
                <p className={`text-xl font-bold mb-1 ${p.textColor}`}>{p.name}</p>
                <div className={`flex items-end gap-1 mb-5 ${p.textColor}`}>
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  <span className="text-sm opacity-60 pb-1">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map(f => (
                    <li key={f} className={`text-xs flex items-start gap-2 ${p.textColor}`}>
                      <span className="mt-0.5 opacity-70">✓</span>
                      <span className="opacity-90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`${p.btnClass} text-center py-3 rounded-2xl text-sm font-bold transition shadow-sm`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Sans engagement · Annulation en 1 clic · Paiement sécurisé Stripe</p>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20 text-center bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=400&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="text-5xl mb-6">🔴</div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Tu mérites de vraiment décrocher.
          </h2>
          <p className="text-gray-400 mb-8 text-base leading-relaxed">
            10 minutes pour configurer.<br />Une vie entière pour en profiter.
          </p>
          <Link
            href="/login"
            className="inline-block bg-rose-500 text-white px-10 py-4 rounded-2xl text-base font-bold hover:bg-rose-600 transition shadow-xl shadow-rose-900/30"
          >
            Activer mon OFF Mode gratuit 🔴
          </Link>
          <p className="text-xs text-gray-500 mt-4">Sans carte bancaire · 2 minutes pour démarrer</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🔴</span>
          <span className="font-bold text-white">MyOffMode</span>
        </div>
        <p className="text-xs text-gray-500">© 2026 MyOffMode · myoffmode.com · Fait avec ❤️ pour toutes les mamans</p>
      </footer>
    </div>
  )
}
