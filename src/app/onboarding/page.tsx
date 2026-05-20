'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, title: "Ton foyer", emoji: "🏠" },
  { id: 2, title: "La routine du matin", emoji: "🌅" },
  { id: 3, title: "La routine du soir", emoji: "🌙" },
  { id: 4, title: "Les petits détails", emoji: "💛" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    momName: '',
    childrenCount: '1',
    childrenNames: '',
    morningRoutine: '',
    eveningRoutine: '',
    importantDetails: '',
    groceryItems: '',
  })

  const update = (key: string, val: string) =>
    setData(prev => ({ ...prev, [key]: val }))

  const handleFinish = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Créer la famille
    const { data: family } = await supabase
      .from('families')
      .insert({ name: `Famille ${data.momName}` })
      .select().single()

    if (!family) return

    // 2. Lier le profil à la famille
    await supabase.from('profiles').update({
      family_id: family.id,
      full_name: data.momName,
      role: 'mom'
    }).eq('id', user.id)

    // 3. Sauvegarder les routines
    const routines = [
      {
        family_id: family.id,
        title: 'Routine du matin',
        description: data.morningRoutine,
        time_of_day: 'morning',
        order_index: 1
      },
      {
        family_id: family.id,
        title: 'Routine du soir',
        description: data.eveningRoutine,
        time_of_day: 'evening',
        order_index: 2
      }
    ]
    await supabase.from('routines').insert(routines)

    // 4. Sauvegarder les memories (détails importants)
    const memories = [
      {
        family_id: family.id,
        category: 'routine',
        content: `Routine matin: ${data.morningRoutine}`
      },
      {
        family_id: family.id,
        category: 'routine',
        content: `Routine soir: ${data.eveningRoutine}`
      },
      {
        family_id: family.id,
        category: 'preference',
        content: data.importantDetails
      }
    ]
    await supabase.from('memories').insert(memories)

    // 5. Sauvegarder les courses
    if (data.groceryItems) {
      const items = data.groceryItems.split('\n')
        .filter(Boolean)
        .map(item => ({
          family_id: family.id,
          name: item.trim(),
          is_recurring: true
        }))
      await supabase.from('grocery_items').insert(items)
    }

    // 6. Sauvegarder les enfants
    if (data.childrenNames) {
      const children = data.childrenNames.split(',')
        .filter(Boolean)
        .map(name => ({
          family_id: family.id,
          name: name.trim()
        }))
      await supabase.from('children').insert(children)
    }

    setLoading(false)
    router.push('/dashboard?onboarded=true')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header progress */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-6">
          {steps.map(s => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s.id <= step ? 'bg-rose-400' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Étape {step} sur {steps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">

        {/* STEP 1 — Foyer */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="text-3xl mb-2">🏠</div>
              <h2 className="text-xl font-semibold text-gray-900">Parle-moi de ton foyer</h2>
              <p className="text-gray-500 text-sm mt-1">Pour personnaliser MyOffMode à ta famille.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Ton prénom</label>
                <input
                  type="text"
                  placeholder="Sarah"
                  value={data.momName}
                  onChange={e => update('momName', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Prénom(s) des enfants <span className="text-gray-400">(séparés par virgule)</span></label>
                <input
                  type="text"
                  placeholder="Lina, Youssef"
                  value={data.childrenNames}
                  onChange={e => update('childrenNames', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Routine matin */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="text-3xl mb-2">🌅</div>
              <h2 className="text-xl font-semibold text-gray-900">La routine du matin</h2>
              <p className="text-gray-500 text-sm mt-1">Décris ta routine comme si tu l'expliquais à quelqu'un. Sois précise — c'est ce que l'IA transmettra à ton partenaire.</p>
            </div>
            <textarea
              rows={8}
              placeholder={`Exemple :\n- Réveil à 7h, je fais les céréales de Lina avec du lait chaud\n- Youssef préfère les tartines avec confiture (pas de beurre)\n- On part à l'école à 8h15, Lina a son sac rose\n- Le carnet de liaison doit être signé chaque lundi`}
              value={data.morningRoutine}
              onChange={e => update('morningRoutine', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
          </div>
        )}

        {/* STEP 3 — Routine soir */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="text-3xl mb-2">🌙</div>
              <h2 className="text-xl font-semibold text-gray-900">La routine du soir</h2>
              <p className="text-gray-500 text-sm mt-1">Goûter, devoirs, bain, dîner, coucher — à ta façon.</p>
            </div>
            <textarea
              rows={8}
              placeholder={`Exemple :\n- Goûter à 17h : fruit + gâteau (max 1)\n- Devoirs avant les écrans, Lina a besoin d'aide en lecture\n- Bain à 19h30, Youssef en premier\n- Dîner à 20h, pas de télé à table\n- Coucher à 21h, 2 pages d'Astérix pour Youssef`}
              value={data.eveningRoutine}
              onChange={e => update('eveningRoutine', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
          </div>
        )}

        {/* STEP 4 — Détails + courses */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <div className="text-3xl mb-2">💛</div>
              <h2 className="text-xl font-semibold text-gray-900">Les petits détails qui comptent</h2>
              <p className="text-gray-500 text-sm mt-1">Allergies, préférences, habitudes importantes. Ces détails sont stockés dans la mémoire de l'IA.</p>
            </div>
            <textarea
              rows={4}
              placeholder={`Exemple :\n- Lina est allergique aux arachides\n- Youssef n'aime pas dormir sans sa peluche bleue\n- Médicaments de Lina dans le placard de la cuisine en haut`}
              value={data.importantDetails}
              onChange={e => update('importantDetails', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Liste de courses habituelle <span className="text-gray-400">(1 produit par ligne)</span>
              </label>
              <textarea
                rows={4}
                placeholder={`Lait demi-écrémé\nPain de mie\nYaourts nature\nBananes\nPâtes Barilla`}
                value={data.groceryItems}
                onChange={e => update('groceryItems', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="px-6 pb-8 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 border border-gray-200 rounded-xl py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Retour
          </button>
        )}
        {step < steps.length ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && !data.momName}
            className="flex-1 bg-rose-500 text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-rose-600 disabled:opacity-40 transition-colors"
          >
            Continuer →
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={loading}
            className="flex-1 bg-rose-500 text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-rose-600 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Sauvegarde...' : 'Terminer et créer mon MyOffMode 🔴'}
          </button>
        )}
      </div>
    </div>
  )
}
