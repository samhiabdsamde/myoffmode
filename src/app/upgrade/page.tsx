'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const features = [
  { icon: '✅', text: 'Routines illimitées' },
  { icon: '🤖', text: 'Chat IA illimité — méthode de maman 24h/24' },
  { icon: '✈️', text: 'Mode OFF — déconnecte vraiment' },
  { icon: '🛒', text: 'Liste de courses intelligente' },
  { icon: '👶', text: 'Profils enfants détaillés' },
  { icon: '📊', text: 'Rapport quotidien pour maman' },
]

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-sm mx-auto px-6 py-10 flex flex-col flex-1">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-2xl font-bold text-gray-900">Passe à Premium</h1>
          <p className="text-gray-500 text-sm mt-2">
            Donne-toi le droit de vraiment décrocher.
          </p>
        </div>

        {/* Prix */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center mb-6">
          <div className="flex items-end justify-center gap-1 mb-1">
            <span className="text-4xl font-bold text-rose-600">7€</span>
            <span className="text-gray-500 text-sm pb-1">/mois</span>
          </div>
          <p className="text-xs text-gray-500">Sans engagement · Annuler à tout moment</p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {features.map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <span className="text-lg">{f.icon}</span>
              <span className="text-sm text-gray-700">{f.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-rose-500 text-white rounded-2xl py-4 text-base font-semibold hover:bg-rose-600 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Redirection...' : 'Commencer — 7€/mois'}
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full text-center text-sm text-gray-400 mt-4 hover:text-gray-600"
        >
          Continuer avec la version gratuite
        </button>
      </div>
    </div>
  )
}
