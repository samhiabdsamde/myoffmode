'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface User {
  id: string
  full_name: string
  email: string
  is_premium: boolean
  is_blocked: boolean
  blocked_reason: string | null
  admin_role: string | null
  plan: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), filter })
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users || [])
    setTotal(data.total || 0)
    setTotalPages(data.totalPages || 1)
    setLoading(false)
  }, [page, filter, search])

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  async function toggleBlock(user: User) {
    setActionLoading(user.id)
    const reason = user.is_blocked ? undefined : prompt('Raison du blocage ?') || 'Violation des CGU'
    if (!user.is_blocked && !reason) { setActionLoading(null); return }

    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_blocked: !user.is_blocked, reason }),
    })
    await fetchUsers()
    setActionLoading(null)
  }

  const filters = [
    { value: 'all', label: 'Tous' },
    { value: 'premium', label: 'Premium' },
    { value: 'blocked', label: 'Bloqués' },
    { value: 'admin', label: 'Admins' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
        <p className="text-gray-400 mt-1">{total} utilisateurs au total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 min-w-48 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
        />
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1) }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === f.value
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Inscrit le</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">Aucun utilisateur trouvé</td>
                </tr>
              )}
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-xs text-rose-400 font-semibold flex-shrink-0">
                        {user.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.full_name || 'Sans nom'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${
                      user.is_premium
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {user.plan || 'free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {user.is_blocked && (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
                          Bloqué
                        </span>
                      )}
                      {user.admin_role && (
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                          {user.admin_role}
                        </span>
                      )}
                      {!user.is_blocked && !user.admin_role && (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Détails
                      </Link>
                      <button
                        onClick={() => toggleBlock(user)}
                        disabled={actionLoading === user.id}
                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                          user.is_blocked
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        } disabled:opacity-50`}
                      >
                        {actionLoading === user.id ? '...' : user.is_blocked ? 'Débloquer' : 'Bloquer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg disabled:opacity-40 hover:border-gray-600 transition-colors"
          >
            ← Précédent
          </button>
          <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg disabled:opacity-40 hover:border-gray-600 transition-colors"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}
