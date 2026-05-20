import Link from 'next/link'

const steps = [
  { n: '1', title: 'Maman encode', desc: "Elle crée ses routines en 10 min — comme expliquer à quelqu'un de confiance.", emoji: '📝' },
  { n: '2', title: "L'IA mémorise", desc: "MyOffMode apprend la façon de faire de maman. Ses recettes, ses méthodes, ses petits détails.", emoji: '🧠' },
  { n: '3', title: 'Papa gère', desc: "Checklist du jour, liste de courses, et l'IA répond à toutes ses questions.", emoji: '💪' },
]

const testimonials = [
  { name: 'Sofia M.', quote: "J'ai enfin passé un weekend entier sans un seul appel de mon mari. MyOffMode lui a tout expliqué.", avatar: '👩' },
  { name: 'Karim B.', quote: "En tant que papa, je savais jamais comment faire certaines choses. Maintenant je demande à l'IA.", avatar: '👨' },
  { name: 'Amina R.', quote: "La première fois que j'ai vraiment décroché depuis des années. Ça vaut chaque euro.", avatar: '🧕' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔴</span>
          <span className="font-bold text-gray-900 text-lg">MyOffMode</span>
        </div>
        <Link href="/login" className="text-sm font-medium text-rose-500 hover:text-rose-600">
          Se connecter →
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          🔴 Le premier SaaS anti charge mentale avec IA
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          Activate your<br />
          <span className="text-rose-500">OFF Mode.</span>
        </h1>
        <p className="text-gray-500 text-lg mb-3 leading-relaxed">
          Encode tes routines une fois.<br />
          L'IA explique ta façon de faire à ton partenaire.<br />
          La maison tourne — même quand tu décroches.
        </p>
        <p className="text-sm text-gray-400 italic mb-8">
          "The home handles itself."
        </p>
        <Link
          href="/login"
          className="inline-block bg-rose-500 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
        >
          Activer mon OFF Mode — Gratuit →
        </Link>
        <p className="text-xs text-gray-400 mt-3">Sans carte bancaire · 2 minutes pour démarrer</p>
      </section>

      {/* Le problème */}
      <section className="px-6 py-10 bg-rose-50">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-2xl mb-4">😩</p>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Tu reconnais cette scène ?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Tu es enfin au repos. Ton téléphone sonne.<br />
            <strong>"Chérie, c'est où les médicaments ?"</strong><br />
            <strong>"La routine du bain c'est comment ?"</strong><br />
            <strong>"Je fais quoi pour le dîner ?"</strong><br /><br />
            Ton jour off vient de se terminer.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">MyOffMode change ça</h2>
          <div className="space-y-4">
            {steps.map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-5 flex gap-4 shadow-sm">
                <div className="text-2xl">{s.emoji}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFF Mode feature */}
      <section className="px-6 py-12 max-w-lg mx-auto text-center">
        <div className="bg-gray-900 rounded-3xl p-8 text-white">
          <div className="text-4xl mb-4">🔴</div>
          <h2 className="text-xl font-bold mb-3">Le bouton OFF Mode</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Un seul bouton. Maman l'active quand elle veut déconnecter.<br />
            Son partenaire reçoit une notification :<br />
            <span className="text-white font-medium italic">"Elle est en OFF Mode. Tu gères — l'IA t'aide. 💪"</span>
          </p>
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-3">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">OFF Mode activé</span>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="px-6 py-12 bg-gray-50 max-w-lg mx-auto rounded-3xl">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Elles ont activé leur OFF Mode</h2>
        <div className="space-y-4">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-sm text-gray-700 italic mb-3">"{t.quote}"</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.avatar}</span>
                <span className="text-sm font-medium text-gray-900">{t.name}</span>
                <span className="text-yellow-400 text-xs ml-auto">★★★★★</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prix */}
      <section className="px-6 py-12">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Simple et transparent</h2>
          <p className="text-gray-500 text-sm mb-8">Commence gratuitement, upgrade quand tu veux.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
              <p className="font-semibold text-gray-900 mb-1">Gratuit</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">0€</p>
              <p className="text-xs text-gray-500">3 routines<br />Chat IA limité</p>
            </div>
            <div className="bg-rose-500 rounded-2xl p-5 text-center shadow-lg shadow-rose-200">
              <p className="font-semibold text-white mb-1">OFF Mode Pro</p>
              <p className="text-2xl font-bold text-white mb-3">7€<span className="text-sm font-normal">/mois</span></p>
              <p className="text-xs text-rose-100">Tout illimité<br />OFF Mode complet</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-16 text-center bg-gray-900">
        <div className="text-4xl mb-4">🔴</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Tu mérites de vraiment décrocher.
        </h2>
        <p className="text-gray-400 mb-8">10 minutes pour configurer. Une vie pour en profiter.</p>
        <Link
          href="/login"
          className="inline-block bg-rose-500 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-rose-600 transition-colors"
        >
          Activer mon OFF Mode gratuit 🔴
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        © 2026 MyOffMode · myoffmode.com · Fait avec ❤️ pour toutes les mamans
      </footer>
    </div>
  )
}
