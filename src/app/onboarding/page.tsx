'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, emoji: '🏠', title: 'Ton foyer', bg: 'from-rose-50 to-orange-50' },
  { id: 2, emoji: '👶', title: 'Tes enfants', bg: 'from-blue-50 to-cyan-50' },
  { id: 3, emoji: '🍳', title: 'Les repas', bg: 'from-amber-50 to-yellow-50' },
  { id: 4, emoji: '🌅', title: 'Routine du matin', bg: 'from-orange-50 to-pink-50' },
  { id: 5, emoji: '🌙', title: 'Routine du soir', bg: 'from-indigo-50 to-purple-50' },
  { id: 6, emoji: '🏡', title: 'La maison & urgences', bg: 'from-emerald-50 to-teal-50' },
  { id: 7, emoji: '💛', title: 'Les secrets de maman', bg: 'from-yellow-50 to-lime-50' },
]

type FormData = {
  // Étape 1 — Foyer
  momName: string
  partnerName: string
  // Étape 2 — Enfants (champ texte libre structuré)
  childrenNames: string
  childrenAges: string
  childrenSchools: string
  childrenAllergies: string
  childrenMeds: string
  childrenComfort: string // doudou, rituels de réconfort
  childrenPersonality: string
  // Étape 3 — Repas
  breakfastRoutine: string
  lunchHabits: string
  dinnerFavorites: string
  foodRefusals: string
  momRecipes: string
  // Étape 4 — Matin
  wakeUpTime: string
  morningBreakfast: string
  schoolPrep: string
  departureTime: string
  morningTips: string
  // Étape 5 — Soir
  snackTime: string
  homeworkHabits: string
  bathRoutine: string
  dinnerTime: string
  bedtimeRoutine: string
  bedtimeTips: string
  // Étape 6 — Maison & urgences
  medsLocation: string
  importantDocs: string
  emergencyContacts: string
  doctorInfo: string
  houseSecrets: string
  // Étape 7 — Secrets
  importantDetails: string
  partnerWarnings: string
  groceryItems: string
  momTips: string
}

const initialData: FormData = {
  momName: '', partnerName: '',
  childrenNames: '', childrenAges: '', childrenSchools: '', childrenAllergies: '',
  childrenMeds: '', childrenComfort: '', childrenPersonality: '',
  breakfastRoutine: '', lunchHabits: '', dinnerFavorites: '', foodRefusals: '', momRecipes: '',
  wakeUpTime: '', morningBreakfast: '', schoolPrep: '', departureTime: '', morningTips: '',
  snackTime: '', homeworkHabits: '', bathRoutine: '', dinnerTime: '', bedtimeRoutine: '', bedtimeTips: '',
  medsLocation: '', importantDocs: '', emergencyContacts: '', doctorInfo: '', houseSecrets: '',
  importantDetails: '', partnerWarnings: '', groceryItems: '', momTips: '',
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2 leading-relaxed">{hint}</p>}
      {children}
    </div>
  )
}

const inputClass = "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition"
const textareaClass = `${inputClass} resize-none`

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FormData>(initialData)

  const up = (key: keyof FormData, val: string) =>
    setData(prev => ({ ...prev, [key]: val }))

  const current = steps[step - 1]
  const progress = Math.round((step / steps.length) * 100)

  const handleFinish = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: family } = await supabase
      .from('families')
      .insert({ name: `Famille ${data.momName}` })
      .select().single()

    if (!family) { setLoading(false); return }

    await supabase.from('profiles').update({
      family_id: family.id,
      full_name: data.momName,
      role: 'mom',
    }).eq('id', user.id)

    // Routines
    await supabase.from('routines').insert([
      { family_id: family.id, title: 'Routine du matin', description: [data.wakeUpTime && `Réveil : ${data.wakeUpTime}`, data.morningBreakfast, data.schoolPrep, data.departureTime && `Départ : ${data.departureTime}`, data.morningTips].filter(Boolean).join('\n'), time_of_day: 'morning', order_index: 1 },
      { family_id: family.id, title: 'Routine du soir', description: [data.snackTime, data.homeworkHabits, data.bathRoutine, data.dinnerTime, data.bedtimeRoutine, data.bedtimeTips].filter(Boolean).join('\n'), time_of_day: 'evening', order_index: 2 },
    ])

    // Memories — toute la connaissance de maman
    const memories = [
      { category: 'child', content: `Enfants : ${data.childrenNames}. Âges : ${data.childrenAges}. Écoles : ${data.childrenSchools}.` },
      { category: 'child', content: `Allergies enfants : ${data.childrenAllergies}` },
      { category: 'child', content: `Médicaments : ${data.childrenMeds}` },
      { category: 'child', content: `Réconfort & doudous : ${data.childrenComfort}` },
      { category: 'child', content: `Personnalité des enfants : ${data.childrenPersonality}` },
      { category: 'food', content: `Petit déjeuner typique : ${data.breakfastRoutine}` },
      { category: 'food', content: `Habitudes déjeuner : ${data.lunchHabits}` },
      { category: 'food', content: `Plats favoris : ${data.dinnerFavorites}` },
      { category: 'food', content: `Ce qu'ils refusent de manger : ${data.foodRefusals}` },
      { category: 'food', content: `Recettes de maman : ${data.momRecipes}` },
      { category: 'routine', content: `Routine matin complète : ${[data.wakeUpTime, data.morningBreakfast, data.schoolPrep, data.departureTime, data.morningTips].join(' | ')}` },
      { category: 'routine', content: `Routine soir complète : ${[data.snackTime, data.homeworkHabits, data.bathRoutine, data.dinnerTime, data.bedtimeRoutine, data.bedtimeTips].join(' | ')}` },
      { category: 'emergency', content: `Médicaments & localisation : ${data.medsLocation}` },
      { category: 'emergency', content: `Documents importants : ${data.importantDocs}` },
      { category: 'emergency', content: `Contacts d'urgence : ${data.emergencyContacts}` },
      { category: 'emergency', content: `Médecin/pédiatre : ${data.doctorInfo}` },
      { category: 'preference', content: `Secrets de la maison : ${data.houseSecrets}` },
      { category: 'preference', content: `Détails importants : ${data.importantDetails}` },
      { category: 'preference', content: `Attention partenaire : ${data.partnerWarnings}` },
      { category: 'preference', content: `Astuces de maman : ${data.momTips}` },
      { category: 'preference', content: `Partenaire : ${data.partnerName}` },
    ].filter(m => m.content.length > m.category.length + 5)
      .map(m => ({ ...m, family_id: family.id }))

    await supabase.from('memories').insert(memories)

    // Courses
    if (data.groceryItems) {
      await supabase.from('grocery_items').insert(
        data.groceryItems.split('\n').filter(Boolean).map(item => ({
          family_id: family.id, name: item.trim(), is_recurring: true,
        }))
      )
    }

    // Enfants
    if (data.childrenNames) {
      const names = data.childrenNames.split(',').filter(Boolean)
      const ages = data.childrenAges.split(',').filter(Boolean)
      await supabase.from('children').insert(
        names.map((name, i) => ({
          family_id: family.id,
          name: name.trim(),
          age: parseInt(ages[i]) || null,
          allergies: data.childrenAllergies || null,
          notes: data.childrenComfort || null,
        }))
      )
    }

    setLoading(false)
    router.push('/dashboard?onboarded=true')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${current.bg} flex flex-col transition-all duration-500`}>

      {/* Header */}
      <div className="px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {step} / {steps.length}
          </span>
          <span className="text-xs text-gray-400">{progress}% complété</span>
        </div>
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
          <div
            className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Steps dots */}
        <div className="flex gap-1.5 mt-3">
          {steps.map(s => (
            <div
              key={s.id}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                s.id < step ? 'bg-rose-400' : s.id === step ? 'bg-rose-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto">
        <div className="mb-6 mt-4">
          <div className="text-4xl mb-3">{current.emoji}</div>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{current.title}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-white/80 p-5 space-y-5">

          {/* ÉTAPE 1 — Foyer */}
          {step === 1 && (
            <>
              <Field label="Ton prénom" hint="Comment tu t'appelles ? C'est pour personnaliser ton espace.">
                <input type="text" placeholder="Ex : Sarah" value={data.momName}
                  onChange={e => up('momName', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Prénom de ton partenaire" hint="Comment s'appelle celui qui va gérer quand tu seras en OFF Mode ?">
                <input type="text" placeholder="Ex : Karim" value={data.partnerName}
                  onChange={e => up('partnerName', e.target.value)} className={inputClass} />
              </Field>
              {data.momName && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <p className="text-sm text-rose-700 font-medium">
                    Bonjour {data.momName} 👋 Tu mérites enfin de vraiment décrocher.
                  </p>
                  <p className="text-xs text-rose-500 mt-1">
                    En 10 minutes, on encode tout ce que {data.partnerName || 'ton partenaire'} doit savoir.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ÉTAPE 2 — Enfants */}
          {step === 2 && (
            <>
              <Field label="Prénom(s) des enfants" hint="Séparés par une virgule.">
                <input type="text" placeholder="Ex : Lina, Youssef" value={data.childrenNames}
                  onChange={e => up('childrenNames', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Leurs âges" hint="Dans le même ordre, séparés par une virgule.">
                <input type="text" placeholder="Ex : 7, 4" value={data.childrenAges}
                  onChange={e => up('childrenAges', e.target.value)} className={inputClass} />
              </Field>
              <Field label="École(s)" hint="Nom de l'école, classe, heure de sortie.">
                <textarea rows={2} placeholder="Ex : Lina — école Jules Ferry, CE1, sortie 16h30&#10;Youssef — maternelle, sortie 16h" value={data.childrenSchools}
                  onChange={e => up('childrenSchools', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Allergies & intolérances ⚠️" hint="Tout ce que papa doit absolument savoir.">
                <textarea rows={3} placeholder="Ex : Lina allergique aux arachides — EpiPen dans le sac bleu&#10;Youssef intolérant au lactose" value={data.childrenAllergies}
                  onChange={e => up('childrenAllergies', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Médicaments" hint="Quoi, quelle dose, où c'est rangé, à quelle heure.">
                <textarea rows={3} placeholder="Ex : Doliprane de Lina — placard salle de bain en haut à droite, 1 sachet si fièvre > 38.5°&#10;Ventoline de Youssef — trousse rouge dans son sac" value={data.childrenMeds}
                  onChange={e => up('childrenMeds', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Doudous, rituels de réconfort 🧸" hint="Ce qui les calme, leur objet fétiche, leurs peurs.">
                <textarea rows={3} placeholder="Ex : Youssef ne dort JAMAIS sans Bibou (peluche lapin gris, dans son lit)&#10;Lina a peur du noir — veilleuse indispensable&#10;Lina se calme avec 'La Reine des Neiges'" value={data.childrenComfort}
                  onChange={e => up('childrenComfort', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Leur caractère & particularités" hint="Ce que papa devrait savoir pour bien les comprendre.">
                <textarea rows={3} placeholder="Ex : Lina est très indépendante, ne la force pas — elle vient quand elle est prête&#10;Youssef fait des crises si trop fatigué, mets-le au lit sans négocier" value={data.childrenPersonality}
                  onChange={e => up('childrenPersonality', e.target.value)} className={textareaClass} />
              </Field>
            </>
          )}

          {/* ÉTAPE 3 — Repas */}
          {step === 3 && (
            <>
              <Field label="Petit déjeuner typique" hint="Ce que chaque enfant mange le matin, les marques si important.">
                <textarea rows={3} placeholder="Ex : Lina — céréales Chocapic avec lait chaud, 1 verre de jus d'orange&#10;Youssef — tartines avec confiture fraise (Bonne Maman), pas de beurre" value={data.breakfastRoutine}
                  onChange={e => up('breakfastRoutine', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Déjeuner / cantine" hint="Mangent-ils à la cantine ? Lunch box ? Habitudes.">
                <textarea rows={2} placeholder="Ex : Lina mange à la cantine lundi/mardi/jeudi&#10;Youssef rentre à la maison — sandwich jambon-beurre ou pâtes" value={data.lunchHabits}
                  onChange={e => up('lunchHabits', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Plats préférés 🍝" hint="Ce qu'ils adorent manger, tes recettes qui marchent à coup sûr.">
                <textarea rows={3} placeholder="Ex : Lina — pâtes carbonara (ma recette : lardons + crème + parmesan, pas d'oeuf)&#10;Youssef — fish & chips maison, nuggets Picard&#10;Les deux adorent la soupe de légumes du dimanche" value={data.dinnerFavorites}
                  onChange={e => up('dinnerFavorites', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Ce qu'ils refusent catégoriquement 🚫" hint="Les aliments à éviter absolument.">
                <textarea rows={2} placeholder="Ex : Youssef — poivrons, champignons, tout ce qui est vert&#10;Lina — poisson (sauf bâtonnets panés), olives" value={data.foodRefusals}
                  onChange={e => up('foodRefusals', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Tes recettes signatures 👩‍🍳" hint="Les plats que tu fais souvent — avec ta méthode exacte.">
                <textarea rows={4} placeholder="Ex : Spaghettis bolognaise : oignon + steak haché + coulis Heinz + 15min. Servir avec parmesan.&#10;Crêpes du dimanche : 3 oeufs, 250g farine, 500ml lait, 1 sachet vanille, beurre fondu. Repos 30min." value={data.momRecipes}
                  onChange={e => up('momRecipes', e.target.value)} className={textareaClass} />
              </Field>
            </>
          )}

          {/* ÉTAPE 4 — Matin */}
          {step === 4 && (
            <>
              <Field label="Heure de réveil" hint="À quelle heure les enfants se lèvent ? Qui se réveille seul ?">
                <input type="text" placeholder="Ex : 7h pour Lina (réveil seul), 7h30 pour Youssef (à réveiller)" value={data.wakeUpTime}
                  onChange={e => up('wakeUpTime', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Le petit déjeuner étape par étape" hint="L'ordre, les habitudes, les petits détails.">
                <textarea rows={3} placeholder="Ex : Je prépare le lait de Lina en premier (micro-ondes 1min30)&#10;Youssef veut toujours sa tartine coupée en 4 triangles&#10;Radio en fond — ils aiment Chante France le matin" value={data.morningBreakfast}
                  onChange={e => up('morningBreakfast', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Préparation pour l'école" hint="Cartable, tenue, vérifications, ce qu'on oublie souvent.">
                <textarea rows={3} placeholder="Ex : Lina — vérifier que le carnet est signé (lundi), son sac rose est toujours prêt la veille&#10;Youssef — sa gourde dans le compartiment avant du sac&#10;Gilets dans le bas du placard de l'entrée" value={data.schoolPrep}
                  onChange={e => up('schoolPrep', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Heure de départ & trajet" hint="À quelle heure on sort ? Comment on va à l'école ?">
                <input type="text" placeholder="Ex : Départ 8h10 max — 10min à pied. Lina sonne à droite à l'entrée." value={data.departureTime}
                  onChange={e => up('departureTime', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Astuces & pièges du matin ⚡" hint="Ce que papa doit savoir pour éviter les crises.">
                <textarea rows={3} placeholder="Ex : Si Youssef fait une crise, ne pas insister — lui donner 5 min seul dans sa chambre&#10;Lina ne veut PAS qu'on l'aide à s'habiller (elle est grande !)&#10;Le cartable de Lina est TOUJOURS lourd, aide-la quand même" value={data.morningTips}
                  onChange={e => up('morningTips', e.target.value)} className={textareaClass} />
              </Field>
            </>
          )}

          {/* ÉTAPE 5 — Soir */}
          {step === 5 && (
            <>
              <Field label="Le goûter 🍎" hint="Heure, quoi, les règles.">
                <textarea rows={2} placeholder="Ex : Goûter à 17h — fruit + 1 gâteau MAX (pas de négociation)&#10;Youssef peut avoir son yaourt Danone vanille en plus" value={data.snackTime}
                  onChange={e => up('snackTime', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Les devoirs 📚" hint="Qui a des devoirs ? Comment ça se passe ? Qui a besoin d'aide ?">
                <textarea rows={3} placeholder="Ex : Devoirs AVANT les écrans, obligatoire&#10;Lina a besoin d'aide en lecture — lis avec elle 10min&#10;Youssef fait ses devoirs seul mais vérifie après&#10;Durée max : 30min, pas plus" value={data.homeworkHabits}
                  onChange={e => up('homeworkHabits', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Le bain / la douche 🛁" hint="Qui en premier ? La routine exacte.">
                <textarea rows={3} placeholder="Ex : Bain à 19h30 — Youssef en premier (il est plus petit)&#10;Lina préfère la douche depuis septembre, eau pas trop chaude&#10;Shampoing 2x par semaine (mercredi + dimanche) — shampoing Tahiti dans la salle de bain" value={data.bathRoutine}
                  onChange={e => up('bathRoutine', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Le dîner 🍽️" hint="Heure, règles à table, ambiance.">
                <textarea rows={2} placeholder="Ex : Dîner à 20h — pas de télé à table, c'est la règle&#10;On mange tous ensemble, même si papa est fatigué" value={data.dinnerTime}
                  onChange={e => up('dinnerTime', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Le coucher 🌙" hint="Heure, rituels, histoire, ce qui aide à dormir.">
                <textarea rows={3} placeholder="Ex : Youssef au lit à 20h30 — 2 pages d'Astérix, puis lumière éteinte&#10;Lina au lit à 21h — elle lit seule 15min (c'est son droit !)&#10;Les deux veulent un bisou ET un câlin — dans cet ordre" value={data.bedtimeRoutine}
                  onChange={e => up('bedtimeRoutine', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Astuces du soir ⚡" hint="Les pièges à éviter, les secrets pour que ça se passe bien.">
                <textarea rows={2} placeholder="Ex : Si Youssef ne veut pas dormir, chante-lui 'Petit Papa Noël' — ça marche toujours&#10;Ne jamais laisser Lina seule si elle pleure, elle a juste besoin d'un câlin" value={data.bedtimeTips}
                  onChange={e => up('bedtimeTips', e.target.value)} className={textareaClass} />
              </Field>
            </>
          )}

          {/* ÉTAPE 6 — Maison & urgences */}
          {step === 6 && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                <p className="text-xs text-amber-700 font-medium">⚠️ Cette étape est cruciale — ces infos permettent à papa de gérer n'importe quelle situation d'urgence.</p>
              </div>
              <Field label="Médicaments — où ils sont rangés" hint="Localisation précise de chaque médicament important.">
                <textarea rows={3} placeholder="Ex : Pharmacie principale : placard au-dessus du frigo&#10;EpiPen de Lina : dans son sac d'école + 1 dans le tiroir de la cuisine&#10;Doliprane enfant : étagère du bas dans la salle de bain" value={data.medsLocation}
                  onChange={e => up('medsLocation', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Documents importants" hint="Où trouver carnet de santé, carte vitale, contrats...">
                <textarea rows={2} placeholder="Ex : Carnets de santé : tiroir du bureau, dossier rouge&#10;Carte vitale : portefeuille noir dans le sac à main beige" value={data.importantDocs}
                  onChange={e => up('importantDocs', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Contacts d'urgence 📞" hint="Qui appeler si problème ? Famille proche, voisins de confiance.">
                <textarea rows={3} placeholder="Ex : Ma mère (Nadia) : 06 XX XX XX XX — peut venir garder en urgence&#10;Voisine du dessus (Fatima) : a les clés de secours&#10;Médecin du quartier : Dr Martin — 01 XX XX XX XX" value={data.emergencyContacts}
                  onChange={e => up('emergencyContacts', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Médecin & pédiatre" hint="Le nom, le numéro, l'adresse, les horaires.">
                <input type="text" placeholder="Ex : Pédiatre Dr Leroy — 01 42 XX XX XX — lundi au vendredi 9h-18h" value={data.doctorInfo}
                  onChange={e => up('doctorInfo', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Les secrets de la maison 🏡" hint="Les trucs que papa ne sait pas — interrupteurs, appareils, astuces.">
                <textarea rows={3} placeholder="Ex : Le lave-vaisselle — bouton droit = ECO (le seul à utiliser)&#10;La télé s'éteint avec la télécommande noire UNIQUEMENT&#10;Clé de secours chez Fatima (voisine palier)" value={data.houseSecrets}
                  onChange={e => up('houseSecrets', e.target.value)} className={textareaClass} />
              </Field>
            </>
          )}

          {/* ÉTAPE 7 — Secrets de maman */}
          {step === 7 && (
            <>
              <Field label="Les détails qui comptent 💛" hint="Tout ce que l'IA doit savoir et que tu n'as pas encore dit.">
                <textarea rows={3} placeholder="Ex : Lina fait pipi au lit parfois (pas grave, protège-matelas dessous)&#10;Youssef est jaloux quand on s'occupe plus de Lina — pense à lui faire un câlin spécial&#10;Le mercredi c'est pizza — c'est sacré !" value={data.importantDetails}
                  onChange={e => up('importantDetails', e.target.value)} className={textareaClass} />
              </Field>
              <Field label={`Ce que ${data.partnerName || 'ton partenaire'} a tendance à oublier ⚠️`} hint="Les erreurs classiques à éviter.">
                <textarea rows={3} placeholder="Ex : Il oublie toujours de vérifier les cartables le soir&#10;Il donne trop de gâteaux — ferme à une demande supplémentaire&#10;Il ne sait pas que Lina n'aime plus les câlins en public" value={data.partnerWarnings}
                  onChange={e => up('partnerWarnings', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Tes astuces magiques ✨" hint="Les trucs qui marchent toujours pour toi.">
                <textarea rows={3} placeholder="Ex : Pour que Youssef mange ses légumes : les mélanger dans les pâtes&#10;Pour endormir Lina rapidement : lui mettre sa playlist relaxation Spotify&#10;Pour éviter les crises au supermarché : les impliquer dans la liste de courses" value={data.momTips}
                  onChange={e => up('momTips', e.target.value)} className={textareaClass} />
              </Field>
              <Field label="Liste de courses habituelle 🛒" hint="1 article par ligne — ce que tu achètes toutes les semaines.">
                <textarea rows={5} placeholder={"Lait demi-écrémé Lactel\nPain de mie Harry's\nYaourts nature Danone x12\nBananes\nPâtes Barilla n°5\nChocapic\nJambon Fleury Michon\nOeufs x12"} value={data.groceryItems}
                  onChange={e => up('groceryItems', e.target.value)} className={textareaClass} />
              </Field>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                <p className="text-sm text-rose-700 font-semibold mb-1">🔴 Prête à activer ton OFF Mode ?</p>
                <p className="text-xs text-rose-500">Toutes ces informations vont être mémorisées par l'IA. {data.partnerName || 'Ton partenaire'} pourra tout retrouver instantanément.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-10 pt-4 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-5 border border-gray-200 bg-white rounded-2xl py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 transition shadow-sm"
          >
            ←
          </button>
        )}
        {step < steps.length ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && !data.momName}
            className="flex-1 bg-rose-500 text-white rounded-2xl py-4 text-sm font-bold hover:bg-rose-600 disabled:opacity-30 transition shadow-md shadow-rose-200"
          >
            Continuer → <span className="opacity-60 font-normal">({steps[step].title})</span>
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={loading}
            className="flex-1 bg-gray-900 text-white rounded-2xl py-4 text-sm font-bold hover:bg-black disabled:opacity-60 transition shadow-md"
          >
            {loading ? '✨ Création de ton OFF Mode...' : 'Activer mon OFF Mode 🔴'}
          </button>
        )}
      </div>
    </div>
  )
}
