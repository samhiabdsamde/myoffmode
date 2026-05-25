'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ChatModal from '@/components/ChatModal'
import GroceryList from '@/components/GroceryList'
import Link from 'next/link'

interface Routine { id: string; title: string; description: string; time_of_day: string }
interface Profile { full_name: string; role: string; off_mode: boolean; is_premium: boolean; family_id: string }

const C = '#C4737A'
const BG = '#12080E'
const CardBG = 'rgba(245,238,232,0.03)'
const Border = 'rgba(245,238,232,0.07)'
const CBorder = 'rgba(196,115,122,0.25)'
const CSoft = 'rgba(196,115,122,0.12)'
const TextPri = '#F5EEE8'
const TextSec = 'rgba(245,238,232,0.55)'
const TextTer = 'rgba(245,238,232,0.25)'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [showChat, setShowChat] = useState(false)
  const [showGrocery, setShowGrocery] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)

    const { data: prof } = await supabase
      .from('profiles').select('*').eq('id', user.id).single()
    if (!prof?.family_id) { router.push('/onboarding'); return }
    setProfile(prof)

    // BUG FIX #1 — charger les routines ET les completions du jour en parallèle
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [{ data: rout }, { data: logs }] = await Promise.all([
      supabase
        .from('routines')
        .select('*')
        .eq('family_id', prof.family_id)
        .eq('is_active', true)
        .order('order_index'),
      supabase
        .from('daily_logs')
        .select('routine_id')
        .eq('user_id', user.id)
        .eq('family_id', prof.family_id)
        .gte('created_at', todayStart.toISOString()),  // seulement aujourd'hui
    ])

    setRoutines(rout || [])
    // Restaurer l'état "coché" depuis la DB
    setCompleted(new Set((logs || []).map(l => l.routine_id)))
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const toggleRoutine = async (id: string) => {
    if (!userId || !profile) return
    const newCompleted = new Set(completed)

    if (newCompleted.has(id)) {
      // Décocher — supprimer le log du jour
      newCompleted.delete(id)
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      await supabase
        .from('daily_logs')
        .delete()
        .eq('user_id', userId)
        .eq('routine_id', id)
        .gte('created_at', todayStart.toISOString())
    } else {
      // BUG FIX #2 — upsert pour éviter les doublons si double-click
      newCompleted.add(id)
      await supabase.from('daily_logs').upsert(
        { family_id: profile.family_id, user_id: userId, routine_id: id },
        { onConflict: 'user_id,routine_id,created_at', ignoreDuplicates: true }
      )
    }
    setCompleted(newCompleted)
  }

  const toggleOffMode = async () => {
    if (!profile || !userId) return
    const newVal = !profile.off_mode
    await supabase.from('profiles').update({ off_mode: newVal }).eq('id', userId)
    setProfile({ ...profile, off_mode: newVal })
  }

  const timeLabel = (t: string) =>
    ({ morning: 'Matin', afternoon: 'Après-midi', evening: 'Soir', anytime: 'Toujours' }[t] || t)
  const timeIcon = (t: string) =>
    ({ morning: '☀️', afternoon: '⛅', evening: '🌙', anytime: '✦' }[t] || '✦')

  const progress = routines.length > 0 ? Math.round((completed.size / routines.length) * 100) : 0
  const isMom = profile?.role === 'mom'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${C}33`, borderTopColor: C }} />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: BG, color: TextPri }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b" style={{ borderColor: Border, backdropFilter: 'blur(20px)', background: 'rgba(18,8,14,0.90)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C }}>
              <div className="w-3 h-3 rounded-full bg-white opacity-90" />
            </div>
            <span className="font-bold tracking-tight" style={{ color: TextPri }}>MyOffMode</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings"
              className="w-8 h-8 rounded-full flex items-center justify-center border text-sm transition-all hover:border-opacity-50"
              style={{ background: CardBG, borderColor: Border, color: TextSec }}>
              ⚙
            </Link>
            <Link href="/support"
              className="w-8 h-8 rounded-full flex items-center justify-center border text-sm transition-all hover:border-opacity-50"
              style={{ background: CardBG, borderColor: Border, color: TextSec }}>
              ?
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Bienvenue */}
        <div>
          <p className="text-sm" style={{ color: TextTer }}>{greeting},</p>
          <h1 className="font-serif text-2xl font-black tracking-tight mt-0.5" style={{ color: TextPri }}>
            {profile?.full_name || (isMom ? 'Maman' : 'Mon amour')} ✦
          </h1>
        </div>

        {/* OFF Mode card — maman seulement */}
        {isMom && (
          <div className={`relative overflow-hidden rounded-2xl p-5 transition-all border`}
            style={profile?.off_mode
              ? { background: CSoft, borderColor: CBorder }
              : { background: CardBG, borderColor: Border }
            }>
            {profile?.off_mode && (
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(90deg, ${CSoft}, transparent)` }} />
            )}
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {profile?.off_mode && (
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C }} />
                  )}
                  <p className="font-bold text-sm" style={{ color: TextPri }}>
                    {profile?.off_mode ? 'OFF Mode activé ✦' : 'OFF Mode'}
                  </p>
                </div>
                <p className="text-xs max-w-xs leading-relaxed" style={{ color: TextTer }}>
                  {profile?.off_mode
                    ? 'Ton partenaire gère. Tu peux vraiment déconnecter.'
                    : 'Active pour déléguer à ton partenaire et souffler.'}
                </p>
              </div>
              <button
                onClick={toggleOffMode}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all"
                style={{ background: profile?.off_mode ? C : 'rgba(245,238,232,0.10)' }}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  profile?.off_mode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Alerte partenaire */}
        {!isMom && profile?.off_mode && (
          <div className="relative overflow-hidden rounded-2xl p-5 border" style={{ background: CSoft, borderColor: CBorder }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: C }} />
              <div>
                <p className="font-bold text-sm" style={{ color: TextPri }}>Maman est en OFF Mode</p>
                <p className="text-xs mt-0.5" style={{ color: TextSec }}>C&apos;est toi qui gères aujourd&apos;hui. Tu peux le faire !</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {routines.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: routines.length, label: 'Routines', color: TextPri },
              { value: completed.size, label: 'Faites', color: C },
              { value: `${progress}%`, label: 'Progression', color: TextPri },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 text-center border" style={{ background: CardBG, borderColor: Border }}>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: TextTer }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {routines.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs" style={{ color: TextTer }}>
              <span>Progression du jour</span>
              <span>{completed.size}/{routines.length} routines</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(245,238,232,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: C }} />
            </div>
          </div>
        )}

        {/* Routines par période */}
        {(['morning', 'afternoon', 'evening', 'anytime'] as const).map(period => {
          const list = routines.filter(r => r.time_of_day === period)
          if (!list.length) return null
          return (
            <div key={period}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{timeIcon(period)}</span>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: TextTer }}>
                  {timeLabel(period)}
                </p>
              </div>
              <div className="space-y-2">
                {list.map(routine => {
                  const done = completed.has(routine.id)
                  return (
                    <button
                      key={routine.id}
                      onClick={() => toggleRoutine(routine.id)}
                      className="w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all"
                      style={{
                        background: done ? 'rgba(245,238,232,0.01)' : CardBG,
                        borderColor: done ? 'rgba(245,238,232,0.04)' : Border,
                        opacity: done ? 0.5 : 1,
                      }}>
                      <div className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                        style={{ background: done ? C : 'transparent', borderColor: done ? C : 'rgba(245,238,232,0.20)' }}>
                        {done && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium transition-all"
                          style={{ color: done ? TextTer : TextPri, textDecoration: done ? 'line-through' : 'none' }}>
                          {routine.title}
                        </p>
                        {routine.description && (
                          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: TextTer }}>
                            {routine.description}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {routines.length === 0 && (
          <div className="rounded-2xl p-10 text-center border border-dashed" style={{ borderColor: Border }}>
            <div className="text-4xl mb-4">✦</div>
            <p className="font-medium mb-1" style={{ color: TextSec }}>Aucune routine pour l&apos;instant</p>
            <p className="text-sm mb-5" style={{ color: TextTer }}>
              {isMom
                ? "Complète l'onboarding pour créer tes routines."
                : "Maman n'a pas encore créé les routines."}
            </p>
            {isMom && (
              <Link href="/onboarding"
                className="inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-full text-sm text-white transition-all hover:opacity-90"
                style={{ background: C }}>
                Compléter l&apos;onboarding →
              </Link>
            )}
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowGrocery(true)}
            className="rounded-2xl p-5 text-left transition-all border hover:border-opacity-50"
            style={{ background: CardBG, borderColor: Border }}>
            <div className="text-2xl mb-3">🛒</div>
            <p className="text-sm font-semibold" style={{ color: TextPri }}>Liste de courses</p>
            <p className="text-xs mt-0.5" style={{ color: TextTer }}>La liste de maman</p>
          </button>

          <button
            onClick={() => setShowChat(true)}
            className="relative overflow-hidden rounded-2xl p-5 text-left transition-all border hover:border-opacity-50"
            style={{ background: CSoft, borderColor: CBorder }}>
            <div className="text-2xl mb-3">🤖</div>
            <p className="text-sm font-semibold" style={{ color: TextPri }}>Demander à l&apos;IA</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(196,115,122,0.7)' }}>Comment elle ferait ?</p>
          </button>
        </div>

        {/* Carte invitation */}
        {isMom && <InviteCard familyId={profile?.family_id || ''} />}

        {/* Banner upgrade */}
        {!profile?.is_premium && (
          <button
            onClick={() => router.push('/upgrade')}
            className="relative w-full overflow-hidden rounded-2xl p-5 text-left group border transition-all hover:border-opacity-50"
            style={{ background: CSoft, borderColor: CBorder }}>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="font-bold text-sm" style={{ color: TextPri }}>✦ Passer à Premium</p>
                <p className="text-xs mt-0.5" style={{ color: TextSec }}>Routines illimitées · IA avancée · 7€/mois</p>
              </div>
              <span className="group-hover:translate-x-1 transition-transform" style={{ color: TextTer }}>→</span>
            </div>
          </button>
        )}

      </div>

      {/* Modals */}
      {showChat && profile && <ChatModal familyId={profile.family_id} onClose={() => setShowChat(false)} />}
      {showGrocery && profile && <GroceryList familyId={profile.family_id} onClose={() => setShowGrocery(false)} />}
    </div>
  )
}

function InviteCard({ familyId }: { familyId: string }) {
  const [copied, setCopied] = useState(false)
  const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://myoffmode.com'}/join/${familyId}`

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl p-5 border" style={{ background: 'rgba(245,238,232,0.03)', borderColor: 'rgba(245,238,232,0.07)' }}>
      <p className="text-sm font-semibold mb-1" style={{ color: '#F5EEE8' }}>✉️ Inviter ton partenaire</p>
      <p className="text-xs mb-4" style={{ color: 'rgba(245,238,232,0.25)' }}>
        Partage ce lien pour qu&apos;il rejoigne ton espace famille.
      </p>
      <button
        onClick={copy}
        className="w-full border border-dashed rounded-xl py-3 text-xs font-medium transition-all"
        style={copied
          ? { borderColor: 'rgba(107,158,125,0.5)', color: '#6B9E7D', background: 'rgba(107,158,125,0.05)' }
          : { borderColor: 'rgba(245,238,232,0.10)', color: 'rgba(245,238,232,0.40)' }
        }>
        {copied ? '✓ Lien copié !' : '📋 Copier le lien d\'invitation'}
      </button>
    </div>
  )
}
