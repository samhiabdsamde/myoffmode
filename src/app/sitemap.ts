import { MetadataRoute } from 'next'

const BASE = 'https://myoffmode.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${BASE}/login`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${BASE}/upgrade`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE}/blog`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
    // EN versions
    { url: `${BASE}/en`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/en/blog`, priority: 0.8, changeFrequency: 'weekly' as const },
  ]

  const blogPosts = [
    'charge-mentale-maman-comment-sen-liberer',
    'deleguer-taches-menageres-partenaire',
    'routine-familiale-comment-organiser',
    'off-mode-guide-ultime-deconnexion',
    'apps-mamans-debordees-meilleures',
  ]

  const blogPages = blogPosts.map(slug => ({
    url: `${BASE}/blog/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(),
  }))

  return [...staticPages, ...blogPages]
}
