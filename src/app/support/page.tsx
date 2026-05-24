'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  created_at: string
}

export default function SupportPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<'new' | 'history'>('new')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '', priority: 'medium' })

  useEffect(() => {
    const fetchTickets = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTickets(data || [])
    }
    if (tab === 'history') fetchTickets()
  }, [tab, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', user?.id || '').single()

    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        email: profile?.email || user?.email || '',
        user_id: user?.id,
      }),
    })

    if (res.ok) {
      setSuccess(true)
      setForm({ subject: '', message: '', priority: 'medium' })
      setTimeout(() => setSuccess(false), 5000)
    }
    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
    closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }

  const statusLabels: Record<string, string> = {
    open: 'Ouvert',
    in_progress: 'En cours',
    resolved: 'Résolu',
    closed: 'Fermé',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-600 mt-1">Notre équipe vous répond dans les 24h</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl mb-6">
          {([['new', '✏️ Nouveau ticket'], ['history', '📋 Mes tickets']] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                tab === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'new' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 font-medium text-sm">✅ Ticket envoyé avec succès !</p>
                <p className="text-green-600 text-xs mt-1">Vous recevrez une réponse par email dans les 24h.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sujet *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="En quelques mots, quel est votre problème ?"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priorité</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="low">Faible — pas urgent</option>
                  <option value="medium">Normale — besoin d&apos;aide</option>
                  <option value="high">Haute — bloque mon utilisation</option>
                  <option value="urgent">Urgente — problème critique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Décrivez votre problème en détail. Plus vous donnez d'informations, plus vite on peut vous aider !"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le ticket'}
              </button>
            </form>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-3">
            {tickets.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Vous n&apos;avez pas encore de ticket support</p>
                <button
                  onClick={() => setTab('new')}
                  className="mt-4 px-4 py-2 bg-rose-500 text-white text-sm rounded-xl hover:bg-rose-600 transition-colors"
                >
                  Créer un ticket
                </button>
              </div>
            )}
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs border flex-shrink-0 ${statusColors[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(ticket.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
