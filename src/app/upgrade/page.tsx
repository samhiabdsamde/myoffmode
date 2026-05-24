'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '7€',
    period: '/mois',
    desc: 'Pour maman qui veut vraiment décrocher',
    badge: '⭐ Le plus populaire',
    color: 'border-rose-300 bg-rose-50',
    badgeColor: 'bg-rose-500 text-white',
    btnClass: 'bg-rose-500 text-white hover:bg-rose-600',
    features: [
      '✅ Routines illimitées',
      '🤖 Chat IA illimité 24h/24',
      '🔴 OFF Mode complet',
      '🛒 Liste de courses intelligente',
      '👶 Jusqu\'à 3 profils enfants',
      '📊 Rapport quotidien',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    id: 'family',
    name: 'Famille',
    price: '12€',
    period: '/mois',
    desc: 'Pour les couples qui veulent tout partager',
    badge: '👨‍👩‍👧 Pour les couples',
    color: 'border-gray-800 bg-gray-900',
    badgeColor: 'bg-gray-700 text-white',
    btnClass: 'bg-rose-500 text-white hover:bg-rose-600',
    features: [
      '✅ Tout du plan Pro',
      '👫 Compte partenaire inclus',
      '👶 Jusqu\'à 5 profils enfants',
      '🔔 Notifications partenaire temps réel',
      '📈 Rapport hebdomadaire famille',
      '💬 Support prioritaire',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_FAMILY_PRICE_ID,
  },
]

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [selected, setSelected] = useState('pro')

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex flex-col">
      <div className="max-w-lg mx-auto px-6 py-12 flex flex-col flex-1 w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Choisis ton plan
          </h1>
          <p className="text-gray-500 text-sm">
            Sans engagement · Annulation en 1 clic
          </p>
        </div>

        {/* Gratuit reminder */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between mb-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-900">Gratuit</p>
            <p className="text-xs text-gray-400">3 routines · Chat IA limité</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Rester gratuit
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`rounded-3xl border-2 p-6 cursor-pointer transition-all ${
                plan.color
              } ${selected === plan.id ? 'scale-[1.01] shadow-lg' : 'opacity-90'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                  <h2 className={`text-xl font-bold mt-3 ${plan.id === 'family' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h2>
                  <p className={`text-xs mt-1 ${plan.id === 'family' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.desc}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-extrabold ${plan.id === 'family' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </div>
                  <div className={`text-xs ${plan.id === 'family' ? 'text-gray-400' : 'text-gray-400'}`}>
                    {plan.period}
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className={`text-sm ${plan.id === 'family' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold transition shadow-md ${plan.btnClass} disabled:opacity-60`}
              >
                {loading === plan.id ? '✨ Redirection...' : `Choisir ${plan.name} — ${plan.price}/mois`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          🔒 Paiement sécurisé par Stripe · Aucun frais caché
        </p>
      </div>
    </div>
  )
}
