import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const posts: Record<string, {
  title: string; date: string; readTime: string; category: string; emoji: string
  description: string; content: string
}> = {
  'charge-mentale-maman-comment-sen-liberer': {
    title: 'Charge mentale : comment s\'en libérer vraiment en 2026',
    date: '2026-05-01', readTime: '8 min', category: 'Bien-être', emoji: '🧠',
    description: 'La charge mentale des mamans est un problème de fond. Voici comment s\'en libérer concrètement avec les bons outils et méthodes.',
    content: `
## Qu'est-ce que la charge mentale ?

La **charge mentale** (ou *mental load* en anglais), c'est le travail invisible de planification, d'organisation et d'anticipation qui tombe souvent sur les épaules de la maman. C'est se souvenir que Lina a une sortie scolaire jeudi, que les médicaments de Youssef sont presque vides, et qu'il faut appeler le médecin avant vendredi.

Ce n'est pas le fait de faire les choses. C'est le fait de **penser à tout** pour que les choses soient faites.

## Pourquoi c'est épuisant ?

Des études montrent que les mamans passent en moyenne **2h par jour** à gérer mentalement le foyer — même pendant leurs heures de repos. C'est comme avoir un navigateur toujours ouvert en arrière-plan, qui consomme de l'énergie en permanence.

Les conséquences :
- **Épuisement chronique** même après une bonne nuit de sommeil
- **Irritabilité** et difficultés relationnelles
- **Impossibilité de vraiment décrocher** pendant les congés
- **Sentiment d'injustice** dans le couple

## 5 stratégies concrètes pour réduire la charge mentale

### 1. Externaliser la mémoire

Ton cerveau n'est pas fait pour stocker des listes interminables. Utilise des outils :
- **Applications de listes** partagées avec ton partenaire
- **Calendrier familial partagé** (Google Calendar)
- **IA dédiée** qui connaît tes routines (comme MyOffMode)

### 2. Déléguer, pas juste assigner

Il y a une différence entre *"tu peux t'occuper du bain ?"* et *"le bain c'est ta responsabilité, tu gères tout ce que ça implique"*.

La vraie délégation transfère **la responsabilité mentale**, pas seulement la tâche.

### 3. Documenter tes routines une fois

Prends 10 minutes pour écrire comment tu fais les choses. La routine du matin, les habitudes alimentaires, les médicaments, les rituels du soir. Une fois documenté, tu n'as plus à tout réexpliquer à chaque fois.

### 4. Accepter que "différent" ne veut pas dire "mal fait"

Si ton partenaire fait le bain différemment — l'ordre n'est pas le même, la durée varie — ça ne veut pas dire que c'est mal fait. **Résister à l'envie de corriger** est une compétence qui s'apprend.

### 5. Créer des plages de vrai repos

Un vrai OFF Mode, c'est quand tu n'es plus disponible mentalement. Téléphone posé. Pas de gestion à distance. Ton partenaire gère — avec les bons outils pour y arriver.

## Le rôle des outils numériques

En 2026, des applications comme **MyOffMode** permettent de centraliser toutes ces informations familiales et de les rendre accessibles au partenaire via une IA. Plus besoin d'être disponible par téléphone pour répondre à "c'est où les médicaments ?"

La technologie ne remplace pas la communication dans le couple — elle la facilite.

## Conclusion

Réduire la charge mentale n'est pas une question de volonté ou d'organisation personnelle. C'est un rééquilibrage systémique qui demande :
1. De **verbaliser** le problème
2. De **documenter** les responsabilités invisibles
3. D'utiliser des **outils** qui facilitent la délégation
4. De **lâcher prise** sur la façon dont les choses sont faites

Tu mérites de vraiment décrocher. 🔴
    `,
  },
  'deleguer-taches-menageres-partenaire': {
    title: 'Comment déléguer les tâches ménagères à son partenaire (sans tout réexpliquer)',
    date: '2026-05-08', readTime: '6 min', category: 'Organisation', emoji: '🤝',
    description: 'Déléguer sans micro-manager : la méthode pour transmettre tes routines à ton partenaire de façon claire et définitive.',
    content: `
## Le problème de la délégation classique

"Tu peux t'occuper des enfants ce week-end ?" — Tu pars, ton téléphone sonne toutes les 30 minutes.

La délégation échoue souvent parce qu'on délègue **les actes**, pas les **informations nécessaires** pour accomplir ces actes.

## La méthode en 3 étapes

### Étape 1 : Documenter avant de déléguer

Avant de confier une responsabilité, écris comment **toi** tu fais les choses. Pas la façon idéale — ta façon. Les enfants ont des préférences, des routines, des petits détails que seule tu connais.

Exemples :
- *"Youssef veut que son sandwich soit coupé en triangles, pas en rectangles"*
- *"Lina fait toujours pipi avant de monter dans la voiture — rappelle-le lui"*
- *"Le shampoing des enfants est sous l'évier, pas dans l'armoire"*

### Étape 2 : Transmettre, pas expliquer en temps réel

La différence entre "je t'explique maintenant" et "voilà une référence que tu peux consulter quand tu en as besoin" est énorme. La seconde option :
- Réduit les appels pendant tes jours off
- Permet au partenaire d'être autonome
- Évite les répétitions frustrantes

### Étape 3 : Faire confiance au processus

Une fois que les informations sont transmises, **lâche le contrôle**. Ton partenaire va faire différemment. C'est normal. C'est même bien — les enfants apprennent à s'adapter.

## L'outil qui change tout

MyOffMode permet de **centraliser toutes ces informations** dans une interface que ton partenaire peut consulter à tout moment. L'IA connaît tes habitudes et peut répondre à ses questions — sans que tu aies à être disponible.

*"Où est l'EpiPen de Lina ?"* → L'IA répond instantanément.

Déléguer devient enfin possible, vraiment.
    `,
  },
  'routine-familiale-comment-organiser': {
    title: 'Routine familiale : le guide complet pour organiser ta maison sans stress',
    date: '2026-05-15', readTime: '10 min', category: 'Famille', emoji: '📋',
    description: 'Créer des routines familiales solides : matin, soir, semaine. Le guide complet avec exemples concrets.',
    content: `
## Pourquoi les routines familiales sont essentielles

Les routines ne sont pas des contraintes — ce sont des **libérateurs**. Quand les enfants savent ce qui vient ensuite, les négociations diminuent. Quand le partenaire connaît le déroulé, les questions inutiles disparaissent.

## La routine du matin (template)

Une bonne routine matinale se construit **du départ vers le réveil** :

**8h15** — Départ pour l'école
**8h00** — Habillage + dernières vérifications (cartable, goûter, carnet)
**7h30** — Petit-déjeuner
**7h15** — Réveil des enfants
**7h00** — Réveil du parent de service

Travailler à rebours force à être réaliste sur le temps nécessaire.

## La routine du soir (template)

**20h30** — Extinction des lumières (lit)
**20h00** — Bisous, lecture courte
**19h30** — Bain/douche
**19h00** — Dîner ensemble
**17h00** — Goûter + devoirs
**16h30** — Retour de l'école

## Les 3 erreurs les plus courantes

1. **Trop de flexibilité** : Une routine qui change tout le temps n'est pas une routine
2. **Trop de rigidité** : Savoir s'adapter sans paniquer si ça déraille
3. **Ne pas la documenter** : Une routine dans ta tête n'existe que pour toi

## Comment documenter une routine efficacement

1. **Écris chaque étape** — même les évidences pour toi
2. **Note les préférences** — qui veut quoi, comment, dans quel ordre
3. **Inclus les exceptions** — "le mercredi c'est pizza"
4. **Partage avec ton partenaire** — via MyOffMode ou autre outil

Une routine bien documentée peut être suivie par n'importe qui — partenaire, grand-parent, baby-sitter.
    `,
  },
  'off-mode-guide-ultime-deconnexion': {
    title: 'OFF Mode : le guide ultime pour se déconnecter sans culpabilité',
    date: '2026-05-20', readTime: '7 min', category: 'Bien-être', emoji: '🔴',
    description: 'Activer son OFF Mode sans culpabiliser : pourquoi c\'est nécessaire et comment le faire vraiment.',
    content: `
## Le paradoxe de la maman moderne

On te dit de prendre soin de toi. De te reposer. De te donner du temps.
Et dès que tu essaies, ton téléphone sonne.

La déconnexion n'est pas une question de volonté. C'est une question de **systèmes**.

## Pourquoi tu n'arrives pas à décrocher

1. **Ton partenaire n'a pas les informations** pour gérer sans toi
2. **Les enfants ont des habitudes** que seule tu connais
3. **Tu n'as pas de "filet de sécurité"** — si tu décroches, qui gère ?
4. **La culpabilité** fait partie de la charge mentale

## Les conditions d'un vrai OFF Mode

Pour vraiment décrocher, trois choses doivent être en place :

### 1. Un partenaire informé
Pas juste "tu te débrouilles" — mais un partenaire qui a accès à toutes les informations nécessaires. Les routines, les habitudes des enfants, les médicaments, les contacts d'urgence.

### 2. Un outil de support
L'IA MyOffMode joue ce rôle : ton partenaire peut lui poser n'importe quelle question et obtenir une réponse basée sur **ta façon de faire**. Pas une réponse générique — ta méthode à toi.

### 3. Un protocole clair
*"Je suis en OFF Mode de vendredi 18h à dimanche 18h. Pour les urgences médicales : Dr Martin 01 XX XX XX. Pour tout le reste : demande à l'IA."*

## Comment activer ton premier OFF Mode

**Semaine avant :**
- Configure tes routines sur MyOffMode
- Partage l'accès à ton partenaire
- Fais un test : laisse-le gérer une soirée avec l'IA

**Le jour J :**
- Active le bouton OFF Mode
- Pose ton téléphone
- Profite

Tu mérites ça. 🔴
    `,
  },
  'apps-mamans-debordees-meilleures': {
    title: 'Top 10 des apps pour mamans débordées en 2026',
    date: '2026-05-22', readTime: '5 min', category: 'Outils', emoji: '📱',
    description: 'Les meilleures applications pour organiser ta vie de maman : listes, routines, délégation, bien-être.',
    content: `
## Les apps qui vont vraiment changer ton quotidien

On ne va pas te lister 50 apps. Voici les **10 vraiment utiles**, testées par des mamans réelles.

### Organisation familiale

**1. MyOffMode** ⭐ Notre recommandation
L'IA qui connaît tes routines et les transmet à ton partenaire. Le seul outil pensé spécifiquement pour la délégation familiale et la charge mentale.

**2. Notion**
Pour les mamans qui aiment tout centraliser. Courbe d'apprentissage mais ultra-puissant.

**3. Google Calendar**
Calendrier partagé famille. Basique mais indispensable.

### Listes & courses

**4. OurGroceries**
Liste de courses partagée en temps réel. Gratuit et efficace.

**5. Todoist**
Gestion de tâches pour les mamans organisées. Partage possible avec le partenaire.

### Communication famille

**6. FamilyWall**
Application conçue pour la famille — agenda, galerie, liste. Interface simple.

**7. GroupMe**
Pour les groupes de classe, les activités, la famille étendue.

### Bien-être maman

**8. Calm**
Méditation guidée. 10 minutes le matin changent tout.

**9. Headspace**
Alternative à Calm, plus gamifiée. Idéal si tu aimes les défis.

**10. Daylio**
Journal d'humeur. Comprendre ses propres patterns pour mieux se gérer.

## Notre verdict

Si tu n'en choisis qu'une : **MyOffMode**. C'est la seule qui s'attaque vraiment au problème de fond — la charge mentale de délégation. Les autres sont des outils. MyOffMode est une solution.

Essaie gratuitement → [myoffmode.com](https://myoffmode.com)
    `,
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug]
  if (!post) return { title: 'Article introuvable' }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://myoffmode.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['MyOffMode'],
      tags: ['charge mentale', 'maman', 'organisation familiale', post.category],
    },
  }
}

export function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }))
}

// Rendu simple du markdown
function renderContent(content: string) {
  return content
    .trim()
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-gray-800 mt-8 mb-3">{line.slice(4)}</h3>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-900 my-1">{line.slice(2, -2)}</p>
      if (line.startsWith('- ')) return <li key={i} className="text-gray-600 ml-4 list-disc">{line.slice(2)}</li>
      if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-gray-500 italic my-2">{line.slice(1, -1)}</p>
      if (line.trim() === '') return <br key={i} />
      // Gras inline
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={i} className="text-gray-600 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: boldLine }} />
    })
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'MyOffMode', url: 'https://myoffmode.com' },
    publisher: { '@type': 'Organization', name: 'MyOffMode', logo: 'https://myoffmode.com/logo.png' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://myoffmode.com/blog/${params.slug}` },
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔴</span>
          <span className="font-bold text-gray-900">MyOffMode</span>
        </Link>
        <Link href="/login" className="bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-rose-600 transition">
          Commencer →
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">← Retour au blog</Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-400">{post.readTime} de lecture</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">
            {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">{post.title}</h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed border-l-4 border-rose-200 pl-4">{post.description}</p>

        <div className="prose-content">
          {renderContent(post.content)}
        </div>

        <div className="mt-16 bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center">
          <div className="text-4xl mb-4">{post.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Prête à activer ton OFF Mode ?</h2>
          <p className="text-gray-500 mb-6">Commence gratuitement — sans carte bancaire.</p>
          <Link href="/login" className="inline-block bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-600 transition">
            Essayer MyOffMode gratuitement →
          </Link>
        </div>
      </article>
    </div>
  )
}
