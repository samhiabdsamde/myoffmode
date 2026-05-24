'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  premiumUsers: number
  openTickets: number
  newUsersThisMonth: number
  mrr: number
  activeSubscriptions: number
  recentSignups: Array<{
    full_name: string
    email: string
    created_at: string
    is_premium: boolean
    admin_role: string | null
  }>
}

function StatCard({ label, value, sub, color = 'rose' }: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  const colors: Record<string, string> = {
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-gray-400 mt-1">Vue d&apos;ensemble de MyOffMode</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="MRR"
          value={`${stats?.mrr?.toFixed(0) || 0}€`}
          sub="Revenu mensuel récurrent"
          color="green"
        />
        <StatCard
          label="Abonnements actifs"
          value={stats?.activeSubscriptions || 0}
          sub="Clients payants Stripe"
          color="blue"
        />
        <StatCard
          label="Utilisateurs total"
          value={stats?.totalUsers || 0}
          sub={`${stats?.premiumUsers || 0} premium`}
          color="rose"
        />
        <StatCard
          label="Nouveaux ce mois"
          value={stats?.newUsersThisMonth || 0}
          sub="Inscriptions récentes"
          color="purple"
        />
        <StatCard
          label="Tickets ouverts"
          value={stats?.openTickets || 0}
          sub="Support en attente"
          color={stats?.openTickets && stats.openTickets > 5 ? 'amber' : 'gray'}
        />
        <StatCard
          label="Taux premium"
          value={stats?.totalUsers ? `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%` : '0%'}
          sub="Conversion free → payant"
          color="blue"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/admin/users', label: '👥 Gérer les users', desc: 'Bloquer, détails, rôles' },
          { href: '/admin/subscriptions', label: '💳 Abonnements', desc: 'Stripe, MRR, churn' },
          { href: '/admin/support', label: '🎫 Support', desc: 'Tickets en attente' },
          { href: '/admin/emails', label: '📧 Emails logs', desc: 'Historique envois' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 hover:bg-gray-800 transition-all group"
          >
            <p className="font-medium text-sm text-white group-hover:text-rose-400 transition-colors">{action.label}</p>
            <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent signups */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Dernières inscriptions</h2>
          <Link href="/admin/users" className="text-xs text-rose-400 hover:text-rose-300">Voir tout →</Link>
        </div>
        <div className="divide-y divide-gray-800">
          {stats?.recentSignups?.length === 0 && (
            <p className="p-5 text-gray-500 text-sm">Aucune inscription récente</p>
          )}
          {stats?.recentSignups?.map((user, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-xs text-rose-400 font-semibold">
                  {user.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.full_name || 'Sans nom'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.is_premium && (
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                    Premium
                  </span>
                )}
                {user.admin_role && (
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                    {user.admin_role}
                  </span>
                )}
                <span className="text-xs text-gray-600">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
