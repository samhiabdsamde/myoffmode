'use client'

import { useEffect, useState, useCallback } from 'react'

interface Ticket {
  id: string
  email: string
  subject: string
  message: string
  status: string
  priority: string
  admin_notes: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  profiles?: { full_name: string; email: string }
  _replies?: Reply[]
}

interface Reply {
  id: string
  message: string
  is_admin_reply: boolean
  created_at: string
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('open')
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [replyText, setReplyText] = useState('')
  const [noteText, setNoteText] = useState('')
  const [sending, setSending] = useState(false)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/support?status=${statusFilter}`)
    const data = await res.json()
    setTickets(data.tickets || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const doAction = async (body: Record<string, unknown>) => {
    setSending(true)
    await fetch('/api/admin/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSending(false)
    setReplyText('')
    fetchTickets()
    if (selected) setSelected(prev => prev ? { ...prev, status: body.status as string || prev.status } : null)
  }

  const filters = [
    { value: 'open', label: '🔵 Ouverts' },
    { value: 'in_progress', label: '🟡 En cours' },
    { value: 'resolved', label: '🟢 Résolus' },
    { value: 'closed', label: '⚫ Fermés' },
    { value: 'all', label: 'Tous' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Support</h1>
        <p className="text-gray-400 mt-1">{total} ticket(s) dans ce filtre</p>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => { setStatusFilter(f.value); setSelected(null) }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              statusFilter === f.value
                ? 'bg-rose-500 text-white'
                : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Ticket list */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <p className="p-6 text-center text-gray-500 text-sm">Aucun ticket dans ce statut</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {tickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelected(ticket)}
                    className={`w-full text-left p-4 hover:bg-gray-800/50 transition-colors ${selected?.id === ticket.id ? 'bg-gray-800 border-l-2 border-rose-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-white truncate flex-1">{ticket.subject}</p>
                      <span className={`px-1.5 py-0.5 rounded text-xs border flex-shrink-0 ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{ticket.profiles?.full_name || ticket.email}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket detail */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex items-center justify-center h-64">
              <p className="text-gray-500 text-sm">Sélectionnez un ticket pour voir les détails</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* Ticket header */}
              <div className="p-5 border-b border-gray-800">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{selected.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selected.profiles?.full_name || selected.email} · {new Date(selected.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${priorityColors[selected.priority]}`}>
                      {selected.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[selected.status]}`}>
                      {selected.status}
                    </span>
                  </div>
                </div>

                {/* Change status */}
                <div className="flex gap-2 flex-wrap">
                  {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                    <button
                      key={s}
                      onClick={() => doAction({ action: 'update_status', ticket_id: selected.id, status: s })}
                      disabled={selected.status === s || sending}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors disabled:opacity-40 ${
                        selected.status === s
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Original message */}
              <div className="p-5 border-b border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Message original</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Admin notes */}
              <div className="p-5 border-b border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Note interne</p>
                <textarea
                  value={noteText !== '' ? noteText : (selected.admin_notes || '')}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Note interne (non visible par l'utilisateur)..."
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 resize-none"
                />
                <button
                  onClick={() => doAction({ action: 'add_note', ticket_id: selected.id, note: noteText || selected.admin_notes })}
                  disabled={sending}
                  className="mt-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                >
                  Sauvegarder la note
                </button>
              </div>

              {/* Reply */}
              <div className="p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Répondre à l&apos;utilisateur</p>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Votre réponse (envoyée par email)..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-600">📧 Un email sera envoyé à {selected.email}</p>
                  <button
                    onClick={() => {
                      if (replyText.trim()) {
                        doAction({ action: 'reply', ticket_id: selected.id, message: replyText })
                      }
                    }}
                    disabled={sending || !replyText.trim()}
                    className="px-4 py-2 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Envoi...' : 'Envoyer la réponse'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
