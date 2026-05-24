'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function JoinFamilyPage() {
  const { familyId } = useParams<{ familyId: string }>()
  const supabase = createClient()
  const router = useRouter()
  const [family, setFamily] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data: fam } = await supabase.from('families').select('name').eq('id', familyId).single()
      setFamily(fam)
      setLoading(false)
    }
    init()
  }, [familyId])

  const handleJoin = async () => {
    if (!user) { router.push(`/login?redirect=/join/${familyId}`); return }
    setJoining(true)
    setError('')

    const { data: existingProfile } = await supabase
      .from('profiles').select('family_id').eq('id', user.id).single()

    if (existingProfile?.family_id && existingProfile.family_id !== familyId) {
      setError('Tu fais déjà partie d\'une autre famille. Contacte le support pour migrer.')
      setJoining(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ family_id: familyId, role: 'partner' })
      .eq('id', user.id)

    if (updateError) { setError(updateError.message); setJoining(false); return }

    // Créer une notification pour maman
    await supabase.from('notifications').insert({
      family_id: familyId,
      user_id: user.id,
      title: '👫 Ton partenaire a rejoint !',
      message: `${user.email} a rejoint ta famille sur MyOffMode.`,
      type: 'system',
    })

    router.push('/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-3xl animate-pulse">🔴</div>
    </div>
  )

  if (!family) return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900">Lien invalide</h1>
        <p className="text-gray-500 text-sm mt-2">Ce lien d'invitation n'existe pas ou a expiré.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-5xl mb-4">👨‍👩‍👧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rejoins ta famille</h1>
        <p className="text-gray-500 text-sm mb-2">Tu as été invité à rejoindre</p>
        <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 mb-6">
          <p className="text-rose-700 font-bold text-lg">{family.name}</p>
        </div>

        <p className="text-gray-500 text-xs mb-6 leading-relaxed">
          En rejoignant, tu auras accès aux routines, à la liste de courses et au chat IA de ta famille.
        </p>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2 mb-4">{error}</p>}

        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full bg-rose-500 text-white rounded-2xl py-4 text-sm font-bold hover:bg-rose-600 disabled:opacity-50 transition shadow-md shadow-rose-200 mb-3"
        >
          {joining ? 'Connexion...' : user ? '💪 Rejoindre la famille' : '🔑 Se connecter pour rejoindre'}
        </button>

        {!user && (
          <p className="text-xs text-gray-400">Tu dois avoir un compte MyOffMode pour rejoindre.</p>
        )}
      </div>
    </div>
  )
}
