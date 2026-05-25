import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog Charge Mentale Maman — Conseils, témoignages & solutions',
  description:
    'Articles sur la charge mentale des mamans, l\'épuisement maternel, l\'invisible labor et comment vraiment déléguer. ' +
    'Conseils concrets pour les mamans débordées. Par MyOffMode.',
  keywords: [
    'blog charge mentale maman',
    'articles épuisement maternel',
    'conseils mamans débordées',
    'charge mentale invisible labor',
    'burn out maternel conseils',
    'déléguer routines familiales',
  ],
  alternates: { canonical: 'https://myoffmode.com/blog' },
  openGraph: {
    title: 'Blog Charge Mentale Maman · MyOffMode',
    description: 'Articles concrets sur la charge mentale, l\'épuisement maternel et comment vraiment souffler.',
    url: 'https://myoffmode.com/blog',
  },
}

const posts = [
  {
    slug: 'charge-mentale-maman-comment-sen-liberer',
    title: 'Charge mentale : comment s\'en libérer vraiment en 2026',
    excerpt: 'La charge mentale des mamans est un problème de fond, pas de forme. Voici comment s\'en libérer concrètement avec les bons outils.',
    date: '2026-05-01',
    readTime: '8 min',
    category: 'Bien-être',
    emoji: '🧠',
  },
  {
    slug: 'deleguer-taches-menageres-partenaire',
    title: 'Comment déléguer les tâches ménagères à son partenaire (sans tout réexpliquer)',
    excerpt: 'Déléguer sans micro-manager : la méthode pour transmettre tes routines à ton partenaire de façon claire et efficace.',
    date: '2026-05-08',
    readTime: '6 min',
    category: 'Organisation',
    emoji: '🤝',
  },
  {
    slug: 'routine-familiale-comment-organiser',
    title: 'Routine familiale : le guide complet pour organiser ta maison sans stress',
    excerpt: 'Petit-déjeuner, école, bain, devoirs, coucher... Comment créer des routines qui marchent vraiment pour toute la famille.',
    date: '2026-05-15',
    readTime: '10 min',
    category: 'Famille',
    emoji: '📋',
  },
  {
    slug: 'off-mode-guide-ultime-deconnexion',
    title: 'OFF Mode : le guide ultime pour se déconnecter sans culpabilité',
    excerpt: 'Activer son OFF Mode n\'est pas un luxe, c\'est une nécessité. Découvrez comment vraiment décrocher sans angoisser.',
    date: '2026-05-20',
    readTime: '7 min',
    category: 'Bien-être',
    emoji: '🔴',
  },
  {
    slug: 'apps-mamans-debordees-meilleures',
    title: 'Top 10 des apps pour mamans débordées en 2026',
    excerpt: 'De la liste de courses à l\'organisation familiale, voici les applications qui vont vraiment changer ton quotidien.',
    date: '2026-05-22',
    readTime: '5 min',
    category: 'Outils',
    emoji: '📱',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔴</span>
          <span className="font-bold text-gray-900">MyOffMode</span>
        </Link>
        <Link href="/login" className="bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-rose-600 transition">
          Commencer →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-rose-100">
            ✍️ Blog MyOffMode
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Charge mentale, famille & bien-être
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Des conseils concrets pour réduire la charge mentale, mieux déléguer et retrouver du temps pour toi.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-rose-100 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 bg-rose-50 rounded-xl w-14 h-14 flex items-center justify-center">
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-400">{post.readTime} de lecture</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors leading-tight mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center">
          <div className="text-4xl mb-4">🔴</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Prête à activer ton OFF Mode ?</h2>
          <p className="text-gray-500 mb-6">10 minutes pour configurer. Une vie pour en profiter.</p>
          <Link href="/login" className="inline-block bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-600 transition">
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </div>
  )
}
