/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      // Pages HTML — jamais mises en cache par le navigateur
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, must-revalidate',
        },
      ],
    },
    {
      // Assets statiques (JS, CSS) — cache long car le nom change à chaque build
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}

module.exports = nextConfig
