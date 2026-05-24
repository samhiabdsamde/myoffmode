'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserDetail {
  profile: {
    id: string
    full_name: string
    email: string
    is_premium: boolean
    is_blocked: boolean
    blocked_reason: string | null
    blocked_at: string | null
    admin_role: string | null
    plan: string
    created_at: string
    families?: { name: string }
  }
  subscription: {
    stripe_subscription_id: string
    stripe_customer_id: string
    status: string
    current_period_end: string
  } | null
  stripeSubscription: {
    status: string
    current_period_end: number
    cancel_at_period_end: boolean
    items: { data: Array<{ price: { nickname: string; unit_amount: number; recurring: { interval: string } } }> }
  } | null
  tickets: Array<{ id: string; subject: string; status: string; priority: string; created_at: string }>
  actions: Array<{ action: string; details: Record<string, unknown>; created_at: string }>
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchUser = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${id}`)
    if (!res.ok) { router.push('/admin/users'); return }
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { fetchUser() }, [id])

  const doAction = async (body: Record<string, unknown>) => {
    setActionLoading(true)
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (json.error) setMessage(`Erreur: ${json.error}`)
    else { setMessage('Action effectuée avec succès'); fetchUser() }
    setActionLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!data) return null

  const { profile, subscription, stripeSubscription, tickets, actions } = data

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users" className="text-gray-500 hover:text-gray-300 transition-colors text-sm">← Retour</Link>
        <h1 className="text-2xl font-bold text-white">{profile.full_name || 'Utilisateur'}</h1>
        {profile.is_blocked && (
          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">Bloqué</span>
        )}
        {profile.admin_role && (
          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">{profile.admin_role}</span>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.startsWith('Erreur') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Informations</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Email', value: profile.email },
                { label: 'Famille', value: profile.families?.name || '—' },
                { label: 'Plan', value: profile.plan || 'free' },
                { label: 'Inscrit le', value: new Date(profile.created_at).toLocaleDateString('fr-FR') },
                ...(profile.is_blocked ? [
                  { label: 'Raison blocage', value: profile.blocked_reason || '—' },
                  { label: 'Bloqué le', value: profile.blocked_at ? new Date(profile.blocked_at).toLocaleDateString('fr-FR') : '—' },
                ] : []),
              ].map(item => (
                <div key={item.label}>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-white font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stripe subscription */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Abonnement Stripe</h2>
            {!subscription ? (
              <p className="text-gray-500 text-sm">Aucun abonnement Stripe</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Statut</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${
                      stripeSubscription?.status === 'active'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {stripeSubscription?.status || subscription.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Renouvellement</p>
                    <p className="text-white font-medium">
                      {stripeSubscription?.current_period_end
                        ? new Date(stripeSubscription.current_period_end * 1000).toLocaleDateString('fr-FR')
                        : new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {stripeSubscription && (
                    <>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Montant</p>
                        <p className="text-white font-medium">
                          {((stripeSubscription.items.data[0]?.price?.unit_amount || 0) / 100).toFixed(2)}€/
                          {stripeSubscription.items.data[0]?.price?.recurring?.interval === 'month' ? 'mois' : 'an'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Annulation prévue</p>
                        <p className={stripeSubscription.cancel_at_period_end ? 'text-amber-400' : 'text-gray-500'}>
                          {stripeSubscription.cancel_at_period_end ? 'Oui' : 'Non'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="pt-3 border-t border-gray-800 flex gap-2">
                  <a
                    href={`https://dashboard.stripe.com/customers/${subscription.stripe_customer_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Voir dans Stripe →
                  </a>
                  {stripeSubscription?.status === 'active' && (
                    <button
                      onClick={() => {
                        if (confirm('Annuler l\'abonnement de cet utilisateur ?')) {
                          doAction({ action: 'cancel_subscription' })
                        }
                      }}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      Annuler l&apos;abonnement
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Support tickets */}
          {tickets.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold text-white mb-4">Tickets support ({tickets.length})</h2>
              <div className="space-y-2">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${
                        ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        ticket.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${
                        ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — actions */}
        <div className="space-y-4">
          {/* Block / unblock */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Actions admin</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (profile.is_blocked) {
                    doAction({ is_blocked: false })
                  } else {
                    const reason = prompt('Raison du blocage ?')
                    if (reason) doAction({ is_blocked: true, reason })
                  }
                }}
                disabled={actionLoading}
                className={`w-full py-2 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                  profile.is_blocked
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                }`}
              >
                {profile.is_blocked ? '✓ Débloquer l\'utilisateur' : '✕ Bloquer l\'utilisateur'}
              </button>
            </div>
          </div>

          {/* Role management */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Rôle admin</h2>
            <div className="space-y-2">
              {['', 'support', 'admin', 'super_admin'].map(role => (
                <button
                  key={role}
                  onClick={() => doAction({ admin_role: role || null })}
                  disabled={actionLoading || profile.admin_role === (role || null)}
                  className={`w-full py-2 px-3 rounded-lg text-sm text-left transition-colors disabled:opacity-50 ${
                    profile.admin_role === (role || null)
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  {role ? role : 'Aucun rôle (utilisateur normal)'}
                  {profile.admin_role === (role || null) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Audit log */}
          {actions.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold text-white mb-4">Historique admin</h2>
              <div className="space-y-2">
                {actions.map((action, i) => (
                  <div key={i} className="text-xs">
                    <p className="text-gray-300 font-medium">{action.action}</p>
                    <p className="text-gray-600">{new Date(action.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
