'use client'

import { useEffect, useState, useCallback } from 'react'

interface EmailLog {
  id: string
  to_email: string
  subject: string
  type: string
  status: string
  resend_id: string | null
  created_at: string
  profiles?: { full_name: string }
}

const statusColors: Record<string, string> = {
  sent: 'bg-green-500/10 text-green-400 border-green-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  bounced: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function AdminEmailsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (filter !== 'all') params.set('status', filter)
    const res = await fetch(`/api/admin/emails?${params}`)
    const data = await res.json()
    setLogs(data.logs || [])
    setTotal(data.total || 0)
    setTotalPages(data.totalPages || 1)
    setLoading(false)
  }, [page, filter])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const typeLabels: Record<string, string> = {
    welcome: '👋 Bienvenue',
    login_notification: '🔐 Connexion',
    reset_password: '🔑 Réinitialisation',
    payment_success: '✅ Paiement réussi',
    payment_failed: '❌ Paiement échoué',
    renewal_reminder: '🔔 Rappel renouvellement',
    subscription_canceled: '⚠️ Abonnement annulé',
    off_mode_activated: '🌙 OffMode activé',
    partner_invite: '📩 Invitation partenaire',
    support_confirmation: '🎫 Ticket support',
    support_reply: '💬 Réponse support',
    account_blocked: '🚫 Compte bloqué',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Logs emails</h1>
        <p className="text-gray-400 mt-1">{total} email(s) envoyés</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'sent', 'failed', 'bounced'].map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === s
                ? 'bg-rose-500 text-white'
                : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
          >
            {s === 'all' ? 'Tous' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Destinataire</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Sujet</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">Aucun log email</td>
                </tr>
              )}
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-300">{typeLabels[log.type] || log.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-white">{log.profiles?.full_name || log.to_email}</p>
                      {log.profiles?.full_name && <p className="text-xs text-gray-600">{log.to_email}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-gray-400 truncate max-w-xs">{log.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[log.status]}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-600">
                      {new Date(log.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
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
