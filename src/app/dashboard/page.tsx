'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ChatModal from '@/components/ChatModal'
import GroceryList from '@/components/GroceryList'
import Link from 'next/link'

interface Routine { id: string; title: string; description: string; time_of_day: string }
interface Profile { full_name: string; role: string; off_mode: boolean; is_premium: boolean; family_id: string }

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [showChat, setShowChat] = useState(false)
  const [showGrocery, setShowGrocery] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!prof?.family_id) { router.push('/onboarding'); return }
    setProfile(prof)
    const { data: rout } = await supabase.from('routines').select('*').eq('family_id', prof.family_id).eq('is_active', true).order('order_index')
    setRoutines(rout || [])
    setLoading(false)
  }

  const toggleRoutine = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !profile) return
    const newCompleted = new Set(completed)
    if (newCompleted.has(id)) { newCompleted.delete(id) }
    else {
      newCompleted.add(id)
      await supabase.from('daily_logs').insert({ family_id: profile.family_id, user_id: user.id, routine_id: id })
    }
    setCompleted(newCompleted)
  }

  const toggleOffMode = async () => {
    if (!profile) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const newVal = !profile.off_mode
    await supabase.from('profiles').update({ off_mode: newVal }).eq('id', user.id)
    setProfile({ ...profile, off_mode: newVal })
  }

  const timeLabel = (t: string) =>
    ({ morning: 'Matin', afternoon: 'Après-midi', evening: 'Soir', anytime: 'Toujours' }[t] || t)
  const timeIcon = (t: string) =>
    ({ morning: '☀️', afternoon: '⛅', evening: '🌙', anytime: '📌' }[t] || '📌')

  const progress = routines.length > 0 ? Math.round((completed.size / routines.length) * 100) : 0
  const isMom = profile?.role === 'mom'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-rose-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-bold tracking-tight">MyOffMode</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings" className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:border-white/10 transition-all text-sm">
              ⚙
            </Link>
            <Link href="/support" className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:border-white/10 transition-all text-sm">
              ?
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Welcome */}
        <div>
          <p className="text-white/40 text-sm">{greeting},</p>
          <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
            {profile?.full_name || (isMom ? 'Maman' : 'Mon amour')} 👋
          </h1>
        </div>

        {/* OFF Mode card */}
        {isMom && (
          <div className={`relative overflow-hidden rounded-2xl p-5 transition-all ${
            profile?.off_mode
              ? 'bg-rose-500/10 border border-rose-500/30'
              : 'bg-white/[0.03] border border-white/[0.06]'
          }`}>
            {profile?.off_mode && (
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
            )}
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {profile?.off_mode && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                  <p className="font-bold text-white text-sm">
                    {profile?.off_mode ? 'OFF Mode activé' : 'OFF Mode'}
                  </p>
                </div>
                <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                  {profile?.off_mode
                    ? 'Ton partenaire gère. Tu peux vraiment déconnecter. 💆‍♀️'
                    : 'Active pour déléguer à ton partenaire et souffler.'}
                </p>
              </div>
              <button
                onClick={toggleOffMode}
                className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all ${
                  profile?.off_mode ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  profile?.off_mode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Partner alert */}
        {!isMom && profile?.off_mode && (
          <div className="relative overflow-hidden rounded-2xl p-5 bg-rose-500/10 border border-rose-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Maman est en OFF Mode</p>
                <p className="text-xs text-white/50 mt-0.5">C&apos;est toi qui gères aujourd&apos;hui. Tu peux le faire ! 💪</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        {routines.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-white">{routines.length}</p>
              <p className="text-xs text-white/30 mt-1">Routines</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-rose-400">{completed.size}</p>
              <p className="text-xs text-white/30 mt-1">Faites</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-white">{progress}%</p>
              <p className="text-xs text-white/30 mt-1">Progression</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {routines.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/30">
              <span>Progression du jour</span>
              <span>{completed.size}/{routines.length} routines</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Routines */}
        {['morning', 'afternoon', 'evening', 'anytime'].map(period => {
          const list = routines.filter(r => r.time_of_day === period)
          if (!list.length) return null
          return (
            <div key={period}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{timeIcon(period)}</span>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">{timeLabel(period)}</p>
              </div>
              <div className="space-y-2">
                {list.map(routine => (
                  <button
                    key={routine.id}
                    onClick={() => toggleRoutine(routine.id)}
                    className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
                      completed.has(routine.id)
                        ? 'bg-white/[0.02] border-white/[0.04] opacity-50'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      completed.has(routine.id)
                        ? 'bg-rose-500 border-rose-500'
                        : 'border-white/20'
                    }`}>
                      {completed.has(routine.id) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-all ${
                        completed.has(routine.id) ? 'line-through text-white/30' : 'text-white'
                      }`}>
                        {routine.title}
                      </p>
                      {routine.description && (
                        <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{routine.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {routines.length === 0 && (
          <div className="border border-dashed border-white/[0.08] rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-white/60 font-medium mb-1">Aucune routine pour l&apos;instant</p>
            <p className="text-white/30 text-sm mb-5">
              {isMom ? "Complète l'onboarding pour créer tes routines." : "Maman n'a pas encore créé les routines."}
            </p>
            {isMom && (
              <Link href="/onboarding"
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all">
                Compléter l&apos;onboarding →
              </Link>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowGrocery(true)}
            className="bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] rounded-2xl p-5 text-left transition-all group"
          >
            <div className="text-2xl mb-3">🛒</div>
            <p className="text-sm font-semibold text-white">Liste de courses</p>
            <p className="text-xs text-white/30 mt-0.5">La liste de maman</p>
          </button>
          <button
            onClick={() => setShowChat(true)}
            className="relative overflow-hidden bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-500/15 rounded-2xl p-5 text-left transition-all group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="text-2xl mb-3">🤖</div>
              <p className="text-sm font-semibold text-white">Demander à l&apos;IA</p>
              <p className="text-xs text-rose-300/50 mt-0.5">Comment elle ferait ?</p>
            </div>
          </button>
        </div>

        {/* Invite card */}
        {isMom && <InviteCard familyId={profile?.family_id || ''} />}

        {/* Upgrade banner */}
        {!profile?.is_premium && (
          <button onClick={() => router.push('/upgrade')}
            className="relative w-full overflow-hidden rounded-2xl p-5 text-left group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">✨ Passer à Premium</p>
                <p className="text-xs text-white/70 mt-0.5">Routines illimitées · IA avancée · 7€/mois</p>
              </div>
              <span className="text-white/70 group-hover:translate-x-1 transition-transform">→</span>
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
  const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${familyId}`
  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-sm font-semibold text-white mb-1">💌 Inviter ton partenaire</p>
      <p className="text-xs text-white/30 mb-4">Partage ce lien pour qu&apos;il rejoigne ton espace famille.</p>
      <button
        onClick={copy}
        className={`w-full border border-dashed rounded-xl py-3 text-xs font-medium transition-all ${
          copied
            ? 'border-green-500/40 text-green-400 bg-green-500/5'
            : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
        }`}
      >
        {copied ? '✓ Lien copié !' : '📋 Copier le lien d\'invitation'}
      </button>
    </div>
  )
}
