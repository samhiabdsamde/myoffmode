'use client'
import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'assistant'; content: string }

const C = '#C4737A'
const CSoft = 'rgba(196,115,122,0.12)'
const CBorder = 'rgba(196,115,122,0.25)'
const Border = 'rgba(245,238,232,0.07)'
const TextPri = '#F5EEE8'
const TextSec = 'rgba(245,238,232,0.55)'
const TextTer = 'rgba(245,238,232,0.25)'

export default function ChatModal({ familyId, onClose }: { familyId: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    // BUG FIX #5 — Suppression emoji 🔴, message d'accueil plus chaleureux
    {
      role: 'assistant',
      content: "Bonjour ✦ Je connais les habitudes de ta famille. Pose-moi n'importe quelle question — la routine du bain, où sont les médicaments, ce qu'on mange ce soir..."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          familyId,
          history: messages.slice(-6)
        })
      })

      if (res.status === 401) {
        setError('Tu dois être connecté pour utiliser le chat.')
        setLoading(false)
        return
      }
      if (res.status === 403) {
        setError('Accès refusé à cette famille.')
        setLoading(false)
        return
      }

      const { reply, error: apiError } = await res.json()
      if (apiError) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, une erreur s'est produite. Réessaie." }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connexion impossible. Vérifie ta connexion internet." }])
    }
    setLoading(false)
  }

  const suggestions = [
    "La routine du bain des enfants ?",
    "Comment elle prépare le petit-déj ?",
    "Où sont les médicaments ?",
    "Qu'est-ce qu'on mange ce soir ?"
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden"
        style={{ background: '#1A0C14', border: `1px solid ${CBorder}`, borderBottom: 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: Border }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: CSoft }}>
              <span style={{ color: C }}>🤖</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: TextPri }}>Assistant MyOffMode</p>
              <p className="text-xs" style={{ color: TextTer }}>Connaît les habitudes de ta famille</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:opacity-70"
            style={{ color: TextTer }}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed`}
                style={msg.role === 'user'
                  ? { background: C, color: 'white', borderBottomRightRadius: '4px' }
                  : { background: CSoft, color: TextPri, borderBottomLeftRadius: '4px', border: `1px solid ${CBorder}` }
                }>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3" style={{ background: CSoft, border: `1px solid ${CBorder}` }}>
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(delay => (
                    <span key={delay}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: C, animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-xs py-2" style={{ color: 'rgba(196,115,122,0.7)' }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions rapides */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="flex-shrink-0 text-xs rounded-full px-3 py-1.5 border transition-colors hover:opacity-80"
                style={{ borderColor: CBorder, color: TextSec, background: CSoft }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-6 pt-2 flex gap-2 border-t flex-shrink-0" style={{ borderColor: Border }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Pose ta question..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            style={{
              background: 'rgba(245,238,232,0.05)',
              border: `1px solid ${Border}`,
              color: TextPri,
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ background: C }}>
            ↑
          </button>
        </div>

      </div>
    </div>
  )
}
