'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// BUG FIX #4 — Les price IDs Stripe sont SERVER-SIDE uniquement (pas NEXT_PUBLIC_)
// L'upgrade page n'a pas besoin des price IDs côté client — l'API /checkout les gère
const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '7€',
    period: '/mois',
    trial: '7 jours gratuits · Sans CB',
    desc: 'Pour la maman qui veut vraiment décrocher',
    badge: '✦ Le plus populaire',
    featured: true,
    features: [
      'Routines illimitées',
      'Chat IA 24h/24',
      "Jusqu'à 3 enfants",
      'OFF Mode complet',
      'Liste de courses IA',
      'Rapport quotidien partenaire',
    ],
  },
  {
    id: 'family',
    name: 'Famille',
    price: '12€',
    period: '/mois',
    trial: null,
    desc: 'Pour les couples qui partagent tout',
    badge: '👨‍👩‍👧 Pour les couples',
    featured: false,
    features: [
      'Tout du plan Pro',
      'Partenaire inclus',
      "Jusqu'à 5 enfants",
      'Notifications temps réel',
      'Rapport hebdomadaire famille',
      'Support prioritaire',
    ],
  },
]

const C = '#C4737A'
const BG = '#12080E'
const CardBG = 'rgba(245,238,232,0.03)'
const Border = 'rgba(245,238,232,0.07)'
const CBorder = 'rgba(196,115,122,0.25)'
const CSoft = 'rgba(196,115,122,0.12)'
const TextPri = '#F5EEE8'
const TextSec = 'rgba(245,238,232,0.55)'
const TextTer = 'rgba(245,238,232,0.25)'

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Une erreur est survenue. Réessaie.')
        setLoading(null)
      }
    } catch {
      setError('Connexion impossible. Vérifie ta connexion internet.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG, color: TextPri }}>

      {/* Header */}
      <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: Border }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C }}>
            <div className="w-3 h-3 rounded-full bg-white opacity-90" />
          </div>
          <span className="font-bold tracking-tight" style={{ color: TextPri }}>MyOffMode</span>
        </Link>
        <Link href="/dashboard" className="text-sm transition-colors hover:opacity-70" style={{ color: TextTer }}>
          ← Retour
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-6 py-12 flex flex-col flex-1 w-full">

        {/* Titre */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: C }}>Premium</p>
          <h1 className="font-serif text-3xl font-black tracking-tight mb-2" style={{ color: TextPri }}>
            Choisis ton plan
          </h1>
          <p className="text-sm" style={{ color: TextSec }}>
            Sans engagement · Annulation en 1 clic
          </p>
        </div>

        {/* Plan gratuit rappel */}
        <div className="rounded-2xl p-4 flex items-center justify-between mb-5 border" style={{ background: CardBG, borderColor: Border }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: TextPri }}>Gratuit</p>
            <p className="text-xs" style={{ color: TextTer }}>3 routines · Chat IA limité</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs underline hover:opacity-70 transition-opacity"
            style={{ color: TextTer }}>
            Rester gratuit
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl border text-sm" style={{ background: 'rgba(196,115,122,0.1)', borderColor: CBorder, color: '#F0D4D6' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map(plan => (
            <div key={plan.id}
              className="rounded-2xl border overflow-hidden transition-all"
              style={plan.featured
                ? { background: CSoft, borderColor: CBorder, boxShadow: `0 16px 48px rgba(196,115,122,0.15)` }
                : { background: CardBG, borderColor: Border }
              }>

              {/* Top bar featured */}
              {plan.featured && (
                <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${C}, transparent)` }} />
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border"
                      style={plan.featured
                        ? { background: CSoft, borderColor: CBorder, color: C }
                        : { background: 'rgba(245,238,232,0.04)', borderColor: Border, color: TextTer }
                      }>
                      {plan.badge}
                    </span>
                    <h2 className="text-xl font-bold mt-3" style={{ color: TextPri }}>{plan.name}</h2>
                    <p className="text-xs mt-1" style={{ color: TextSec }}>{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black" style={{ color: TextPri }}>{plan.price}</div>
                    <div className="text-xs" style={{ color: TextTer }}>{plan.period}</div>
                  </div>
                </div>

                {plan.trial && (
                  <div className="mb-4 px-3 py-2 rounded-lg text-xs text-center border"
                    style={{ background: 'rgba(107,158,125,0.08)', borderColor: 'rgba(107,158,125,0.2)', color: '#8BC4A0' }}>
                    🎁 {plan.trial}
                  </div>
                )}

                <ul className="space-y-2 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: TextSec }}>
                      <span style={{ color: C }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!!loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 hover:opacity-90"
                  style={plan.featured
                    ? { background: C, color: 'white', boxShadow: `0 8px 24px rgba(196,115,122,0.25)` }
                    : { background: 'rgba(245,238,232,0.06)', color: TextPri, border: `1px solid ${Border}` }
                  }>
                  {loading === plan.id
                    ? '✦ Redirection...'
                    : `Choisir ${plan.name} — ${plan.price}/mois`
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs" style={{ color: TextTer }}>
          🔒 Paiement sécurisé par Stripe · Aucun frais caché · Annulation immédiate
        </p>
      </div>
    </div>
  )
}
