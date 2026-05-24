'use client'

import { useEffect, useState } from 'react'

interface StripeSubscription {
  id: string
  status: string
  cancel_at_period_end: boolean
  current_period_end: number
  customer: string
  customer_email?: string
  amount: number
  interval: string
  plan_name: string
}

interface SubscriptionData {
  subscriptions: StripeSubscription[]
  mrr: number
  totalActive: number
  cancelingCount: number
}

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/subscriptions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Abonnements Stripe</h1>
        <p className="text-gray-400 mt-1">Vue en temps réel depuis Stripe</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-green-400 opacity-70">MRR</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{data?.mrr?.toFixed(0) || 0}€</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-400 opacity-70">Actifs</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{data?.totalActive || 0}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-amber-400 opacity-70">En annulation</p>
          <p className="text-3xl font-bold text-amber-400 mt-1">{data?.cancelingCount || 0}</p>
        </div>
      </div>

      {/* Subscriptions table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">Abonnements actifs</h2>
        </div>
        {!data?.subscriptions?.length ? (
          <p className="p-6 text-center text-gray-500 text-sm">Aucun abonnement actif (Stripe non configuré ou aucune souscription)</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Montant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Renouvellement</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{sub.customer_email || sub.customer}</p>
                    <p className="text-xs text-gray-600 font-mono">{sub.id}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-300">{sub.plan_name || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">
                      {sub.amount.toFixed(2)}€/{sub.interval === 'month' ? 'mois' : 'an'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-gray-400">
                      {new Date(sub.current_period_end * 1000).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${
                        sub.status === 'active' && !sub.cancel_at_period_end
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : sub.cancel_at_period_end
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {sub.cancel_at_period_end ? 'Annulation prévue' : sub.status}
                      </span>
                      <a
                        href={`https://dashboard.stripe.com/subscriptions/${sub.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        Stripe →
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
