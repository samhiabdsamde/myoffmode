'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ChatModal from '@/components/ChatModal'
import GroceryList from '@/components/GroceryList'

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

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: prof } = await supabase
      .from('profiles').select('*').eq('id', user.id).single()

    if (!prof?.family_id) { router.push('/onboarding'); return }

    setProfile(prof)

    const { data: rout } = await supabase
      .from('routines')
      .select('*')
      .eq('family_id', prof.family_id)
      .eq('is_active', true)
      .order('order_index')

    setRoutines(rout || [])
    setLoading(false)
  }

  const toggleRoutine = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !profile) return

    const newCompleted = new Set(completed)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
      await supabase.from('daily_logs').insert({
        family_id: profile.family_id,
        user_id: user.id,
        routine_id: id
      })
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
    ({ morning: '☀️ Matin', afternoon: '⛅ Après-midi', evening: '🌙 Soir', anytime: '📌 Toujours' }[t] || t)

  const progress = routines.length > 0 ? Math.round((completed.size / routines.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl animate-pulse">🔴</div>
    </div>
  )

  const isMom = profile?.role === 'mom'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">
              {isMom ? `Bonjour ${profile?.full_name} 👋` : 'Tableau de bord'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isMom ? "Gère ton foyer ou active le mode OFF" : "Voici ce qu'il faut faire aujourd'hui"}
            </p>
          </div>
          <div className="text-2xl">🔴</div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* OFF MODE — pour maman */}
        {isMom && (
          <div className={`rounded-2xl p-4 ${profile?.off_mode ? 'bg-rose-50 border border-rose-200' : 'bg-white border border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {profile?.off_mode ? '✈️ Mode OFF activé' : '🔋 Mode OFF'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profile?.off_mode
                    ? 'Ton partenaire gère — tu peux vraiment déconnecter.'
                    : "Active pour déléguer à ton partenaire et te reposer."}
                </p>
              </div>
              <button
                onClick={toggleOffMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${profile?.off_mode ? 'bg-rose-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profile?.off_mode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* ALERTE pour le mari si OFF mode activé */}
        {!isMom && profile?.off_mode && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <p className="font-semibold text-rose-700 text-sm">✈️ Maman est en mode OFF</p>
            <p className="text-xs text-rose-600 mt-0.5">C'est toi qui gères aujourd'hui. Tu peux le faire ! 💪</p>
          </div>
        )}

        {/* Progression */}
        {routines.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progression du jour</span>
              <span className="text-sm font-semibold text-rose-500">{completed.size}/{routines.length}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Routines par période */}
        {['morning', 'afternoon', 'evening', 'anytime'].map(period => {
          const periodRoutines = routines.filter(r => r.time_of_day === period)
          if (!periodRoutines.length) return null
          return (
            <div key={period}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-2">
                {timeLabel(period)}
              </p>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                {periodRoutines.map(routine => (
                  <div
                    key={routine.id}
                    onClick={() => toggleRoutine(routine.id)}
                    className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${completed.has(routine.id) ? 'opacity-60' : ''}`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${completed.has(routine.id) ? 'bg-rose-400 border-rose-400' : 'border-gray-300'}`}>
                      {completed.has(routine.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${completed.has(routine.id) ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {routine.title}
                      </p>
                      {routine.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{routine.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Pas de routines */}
        {routines.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">📝</div>
            <p className="text-sm font-medium text-gray-700">Aucune routine pour l'instant</p>
            <p className="text-xs text-gray-500 mt-1">
              {isMom ? "Complète l'onboarding pour créer tes routines." : "Maman n'a pas encore créé les routines."}
            </p>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowGrocery(true)}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-xl mb-1">🛒</div>
            <p className="text-sm font-medium text-gray-900">Courses</p>
            <p className="text-xs text-gray-500">La liste de maman</p>
          </button>
          <button
            onClick={() => setShowChat(true)}
            className="bg-rose-500 rounded-2xl p-4 text-left hover:bg-rose-600 transition-colors"
          >
            <div className="text-xl mb-1">🤖</div>
            <p className="text-sm font-semibold text-white">Demander à l'IA</p>
            <p className="text-xs text-rose-100">Comment elle ferait ?</p>
          </button>
        </div>

        {/* Lien d'invitation (pour maman) */}
        {isMom && (
          <InviteCard familyId={profile?.family_id || ''} />
        )}

        {/* Upgrade si pas premium */}
        {!profile?.is_premium && (
          <div
            onClick={() => router.push('/upgrade')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 cursor-pointer"
          >
            <p className="text-sm font-semibold text-white">✨ Passer à Premium</p>
            <p className="text-xs text-rose-100 mt-0.5">Routines illimitées, IA avancée, mode OFF — 7€/mois</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showChat && profile && (
        <ChatModal familyId={profile.family_id} onClose={() => setShowChat(false)} />
      )}
      {showGrocery && profile && (
        <GroceryList familyId={profile.family_id} onClose={() => setShowGrocery(false)} />
      )}
    </div>
  )
}

// Composant lien d'invitation
function InviteCard({ familyId }: { familyId: string }) {
  const [copied, setCopied] = useState(false)
  const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${familyId}`

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <p className="text-sm font-medium text-gray-900 mb-1">💌 Inviter ton partenaire</p>
      <p className="text-xs text-gray-500 mb-3">Partage ce lien pour qu'il rejoigne ton MyOffMode.</p>
      <button
        onClick={copy}
        className="w-full border border-dashed border-gray-300 rounded-xl py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {copied ? '✓ Lien copié !' : '📋 Copier le lien d\'invitation'}
      </button>
    </div>
  )
}
