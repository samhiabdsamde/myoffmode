import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/onboarding', '/settings', '/api/', '/join/'],
      },
    ],
    sitemap: 'https://myoffmode.com/sitemap.xml',
    host: 'https://myoffmode.com',
  }
}
