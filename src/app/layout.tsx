import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const BASE_URL = 'https://myoffmode.com'

export const viewport: Viewport = {
  themeColor: '#f43f5e',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MyOffMode — Activate your OFF Mode. The home handles itself.',
    template: '%s | MyOffMode',
  },
  description: "Encode tes routines familiales en 10 minutes. L'IA explique ta façon de faire à ton partenaire. La maison tourne même quand tu décroches. Anti charge mentale pour mamans.",
  keywords: [
    'charge mentale maman', 'déléguer tâches ménagères', 'app famille organisation',
    'routine familiale', 'partenaire organisation maison', 'off mode maman',
    'mental load mom', 'family routine app', 'household management',
    'mom burnout prevention', 'délégation partenaire enfants',
  ],
  authors: [{ name: 'MyOffMode', url: BASE_URL }],
  creator: 'MyOffMode',
  publisher: 'MyOffMode',
  category: 'productivity',
  classification: 'Family & Parenting',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
    url: BASE_URL,
    siteName: 'MyOffMode',
    title: 'MyOffMode — Activate your OFF Mode. The home handles itself.',
    description: "Encode tes routines familiales. L'IA gère à ta place. Tu décroches vraiment.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'MyOffMode — Anti charge mentale avec IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myoffmode',
    creator: '@myoffmode',
    title: 'MyOffMode — Activate your OFF Mode',
    description: "L'IA qui gère ta maison quand tu décroches.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'fr': BASE_URL,
      'en': `${BASE_URL}/en`,
      'x-default': BASE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/#webapp`,
      name: 'MyOffMode',
      url: BASE_URL,
      description: "Application SaaS anti charge mentale avec IA pour mamans",
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web, iOS, Android',
      offers: [
        { '@type': 'Offer', name: 'Gratuit', price: '0', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Pro', price: '7', priceCurrency: 'EUR', billingIncrement: 'P1M' },
        { '@type': 'Offer', name: 'Famille', price: '12', priceCurrency: 'EUR', billingIncrement: 'P1M' },
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#org`,
      name: 'MyOffMode',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      sameAs: [
        'https://twitter.com/myoffmode',
        'https://instagram.com/myoffmode',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Comment fonctionne MyOffMode ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tu encodes tes routines familiales en 10 minutes. L\'IA mémorise ta façon de faire et peut répondre à toutes les questions de ton partenaire quand tu es en OFF Mode.',
          },
        },
        {
          '@type': 'Question',
          name: 'Est-ce que MyOffMode est gratuit ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oui, MyOffMode propose un plan gratuit avec 3 routines et un chat IA limité. Les plans Premium (7€/mois) et Famille (12€/mois) offrent toutes les fonctionnalités.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
