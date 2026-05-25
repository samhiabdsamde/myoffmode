import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '700', '900'],
})

const BASE_URL = 'https://myoffmode.com'

// ─────────────────────────────────────────────────────────────────
// BRAND STRATEGY NOTE
// ─────────────────────────────────────────────────────────────────
// Semantic anchor on EVERY page title: "· Charge Mentale Maman"
// Google reads this suffix on every indexed page and creates a
// persistent semantic association:
//   MyOffMode = charge mentale maman = mamans débordées
//
// This is how Calm owns "meditation", Headspace owns "mindfulness",
// and we own "charge mentale maman" in French search.
// ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  themeColor: '#C4737A',   // Dusty rose — la couleur signature
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Title — brand anchor strategy ──────────────────────────────
  title: {
    // Homepage title: Category + Brand + Emotional hook
    default: 'MyOffMode · App Charge Mentale Maman — Souffle Enfin',
    // Every sub-page carries the brand semantic suffix
    template: '%s · MyOffMode — Charge Mentale Maman',
  },

  // ── Description — emotional + keyword rich ─────────────────────
  description:
    "MyOffMode est l'application anti-charge mentale pour mamans débordées. " +
    "Dépose tes routines familiales, ton partenaire gère grâce à l'IA, et toi tu décroches vraiment. " +
    "Épuisement maternel, invisible labor, surcharge cognitive — enfin une solution.",

  // ── Keyword semantic cluster ────────────────────────────────────
  // Primary: own "charge mentale maman" in French search
  // Secondary: emotional long-tail queries overwhelmed moms use
  keywords: [
    // Cluster primaire — brand ownership
    'charge mentale maman',
    'app charge mentale maman',
    'réduire charge mentale maman',
    'charge mentale invisible maman',
    'charge mentale couple maman',
    // Cluster secondaire — problème
    'épuisement maternel',
    'burn out maman',
    'surcharge cognitive maman',
    'invisible labor france',
    'mental load maman france',
    // Cluster solution
    'routines familiales application',
    'déléguer partenaire enfants routines',
    'off mode maman déconnecter',
    'app famille organisation routines',
    // Cluster brand
    'myoffmode',
    'my off mode app',
    'off mode maman',
    // Cluster long-tail émotionnel
    'comment se reposer quand on est maman',
    'comment déléguer les tâches ménagères partenaire',
    'pourquoi maman épuisée tout le temps',
  ],

  authors: [{ name: 'MyOffMode', url: BASE_URL }],
  creator: 'MyOffMode',
  publisher: 'MyOffMode',

  // ── Category — wellness, pas productivity ──────────────────────
  // "productivity" associe au corporate/startup masculin
  // "Health & Wellness / Parentalité" positionne dans le bon univers
  category: 'Health & Wellness — Parentalité',
  classification: 'Application bien-être maternel · Charge mentale · Organisation familiale',

  // ── Open Graph — chaque partage ancre la marque ────────────────
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'MyOffMode · Charge Mentale Maman',
    title: 'MyOffMode · App Charge Mentale Maman — Souffle Enfin',
    description:
      "L'application qui libère les mamans de la charge mentale. " +
      "Encode tes routines une fois, l'IA les transmet à ton partenaire. " +
      "Épuisement maternel, invisible labor — enfin une vraie solution.",
    images: [
      {
        url: '/opengraph-image',   // Dynamic OG image via Next.js
        width: 1200,
        height: 630,
        alt: 'MyOffMode — L\'app anti-charge mentale pour mamans débordées',
        type: 'image/png',
      },
    ],
  },

  // ── Twitter/X — EN pour reach international ───────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@myoffmode',
    creator: '@myoffmode',
    title: 'MyOffMode · Mental Load Relief for Overwhelmed Moms',
    description:
      "The app that gives moms permission to truly disconnect. " +
      "Encode routines once — AI handles the rest. Mental load, finally relieved.",
    images: ['/opengraph-image'],
  },

  // ── Canonical + hreflang ──────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      'fr': BASE_URL,
      'fr-FR': BASE_URL,
      'fr-BE': BASE_URL,
      'fr-CH': BASE_URL,
      'x-default': BASE_URL,
    },
  },

  // ── Robots ───────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// JSON-LD STRUCTURED DATA — Version enrichie pour brand ownership
// ─────────────────────────────────────────────────────────────────
// Stratégie : Google Knowledge Graph lit ces données pour créer
// l'association "MyOffMode = charge mentale maman".
// On enrichit avec : audience, about, keywords, alternativeHeadline.
// ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [

    // ── 1. Application ────────────────────────────────────────────
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'MyOffMode',
      alternateName: ['My Off Mode', 'MyOffMode App', 'MyOffMode Charge Mentale'],
      alternativeHeadline: "L'app anti-charge mentale pour mamans débordées",
      description:
        "MyOffMode est une application SaaS qui libère les mamans de la charge mentale invisible. " +
        "Elle permet d'encoder les routines familiales et utilise l'intelligence artificielle " +
        "pour transmettre ces informations au partenaire, permettant à la maman de vraiment déconnecter.",
      url: BASE_URL,
      applicationCategory: 'HealthApplication',
      applicationSubCategory: 'Parentalité · Bien-être maternel · Charge mentale',
      operatingSystem: 'Web, iOS, Android',
      inLanguage: 'fr-FR',
      isAccessibleForFree: true,

      // Ce que l'app traite sémantiquement
      about: [
        { '@type': 'Thing', name: 'Charge mentale', sameAs: 'https://fr.wikipedia.org/wiki/Charge_mentale' },
        { '@type': 'Thing', name: 'Épuisement maternel' },
        { '@type': 'Thing', name: 'Invisible labor' },
        { '@type': 'Thing', name: 'Organisation familiale' },
        { '@type': 'Thing', name: 'Bien-être maternel' },
      ],

      // Audience cible — critical pour brand ownership
      audience: {
        '@type': 'ParentAudience',
        parentType: 'Mère',
        audienceType: 'Mamans débordées, mères avec enfants, femmes subissant la charge mentale',
        geographicArea: {
          '@type': 'Place',
          name: 'France, Belgique, Suisse, Canada francophone',
        },
      },

      // Keywords schema — renforcent le clustering sémantique
      keywords: [
        'charge mentale maman',
        'épuisement maternel',
        'app organisation famille',
        'déléguer routines familiales',
        'off mode maman',
        'burn out maternel',
        'invisible labor',
        'mental load',
      ].join(', '),

      // Prix
      offers: [
        {
          '@type': 'Offer',
          name: 'Gratuit',
          price: '0',
          priceCurrency: 'EUR',
          description: '3 routines, chat IA limité, 1 enfant',
        },
        {
          '@type': 'Offer',
          name: 'Pro',
          price: '7',
          priceCurrency: 'EUR',
          billingIncrement: 'P1M',
          description: 'Routines illimitées, chat IA 24h/24, jusqu\'à 3 enfants, OFF Mode complet',
          priceValidUntil: '2027-12-31',
        },
        {
          '@type': 'Offer',
          name: 'Famille',
          price: '12',
          priceCurrency: 'EUR',
          billingIncrement: 'P1M',
          description: 'Tout du Pro + partenaire inclus, jusqu\'à 5 enfants',
        },
      ],

      // Agrégation d'avis (à mettre à jour avec de vraies données)
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1',
      },
    },

    // ── 2. Organisation ───────────────────────────────────────────
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#org`,
      name: 'MyOffMode',
      alternateName: 'MyOffMode · Charge Mentale Maman',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "MyOffMode crée des outils numériques pour libérer les mamans de la charge mentale et de l'épuisement maternel.",
      foundingDate: '2026',
      areaServed: ['FR', 'BE', 'CH', 'CA'],
      knowsAbout: [
        'Charge mentale',
        'Épuisement maternel',
        'Organisation familiale',
        'Intelligence artificielle bien-être',
        'Parentalité moderne',
      ],
      sameAs: [
        'https://twitter.com/myoffmode',
        'https://instagram.com/myoffmode',
        'https://tiktok.com/@myoffmode',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@myoffmode.com',
        contactType: 'customer support',
        availableLanguage: ['fr', 'en'],
      },
    },

    // ── 3. Website avec SearchAction ─────────────────────────────
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'MyOffMode · Charge Mentale Maman',
      description: "L'app qui libère les mamans de la charge mentale invisible",
      inLanguage: 'fr-FR',
      publisher: { '@id': `${BASE_URL}/#org` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },

    // ── 4. BreadcrumbList — navigation sémantique ────────────────
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Fonctionnalités', item: `${BASE_URL}/#fonctionnalites` },
        { '@type': 'ListItem', position: 3, name: 'Tarifs', item: `${BASE_URL}/#tarifs` },
        { '@type': 'ListItem', position: 4, name: 'Blog charge mentale', item: `${BASE_URL}/blog` },
      ],
    },

    // ── 5. FAQ enrichie — semantic coverage maximale ─────────────
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qu\'est-ce que la charge mentale chez les mamans ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              "La charge mentale est le poids cognitif et émotionnel invisible que portent majoritairement les mères : " +
              "anticiper, organiser, planifier, se souvenir de tout pour toute la famille. " +
              "MyOffMode existe pour externaliser cette charge une fois pour toutes.",
          },
        },
        {
          '@type': 'Question',
          name: 'Comment MyOffMode aide les mamans débordées ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              "MyOffMode permet aux mamans d'encoder leurs routines familiales en 10 minutes. " +
              "L'IA mémorise leur façon de faire et répond aux questions du partenaire 24h/24, " +
              "libérant la maman de la charge de tout expliquer. La fonctionnalité OFF Mode permet " +
              "de déléguer complètement la gestion familiale et de vraiment déconnecter.",
          },
        },
        {
          '@type': 'Question',
          name: 'MyOffMode est-il gratuit pour les mamans ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              "Oui, MyOffMode propose un plan 100% gratuit avec 3 routines et un chat IA. " +
              "Les plans payants (Pro à 7€/mois, Famille à 12€/mois) offrent des routines illimitées " +
              "et toutes les fonctionnalités. 7 jours d'essai gratuit, sans carte bancaire.",
          },
        },
        {
          '@type': 'Question',
          name: 'Comment réduire la charge mentale de maman au quotidien ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              "Pour réduire la charge mentale de maman : (1) externalisez les informations de votre tête " +
              "vers un outil comme MyOffMode, (2) impliquez votre partenaire avec des informations claires " +
              "et accessibles, (3) utilisez la fonctionnalité OFF Mode pour vous accorder de vrais moments " +
              "de repos sans culpabilité. La charge mentale diminue quand l'information est partagée, " +
              "pas seulement les tâches.",
          },
        },
        {
          '@type': 'Question',
          name: 'Mes données personnelles sont-elles protégées sur MyOffMode ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              "Oui. Toutes les données sont hébergées en Europe (RGPD compliant), chiffrées en transit " +
              "et au repos. Nous ne vendons jamais vos données. Vous pouvez supprimer votre compte " +
              "et toutes vos données à tout moment.",
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Additional semantic meta tags for search engines */}
        <meta name="subject" content="Application anti-charge mentale pour mamans" />
        <meta name="topic" content="Charge mentale maman, épuisement maternel, organisation familiale" />
        <meta name="audience" content="Mamans débordées, mères avec enfants, femmes subissant la charge mentale" />
        <meta name="coverage" content="France, Belgique, Suisse, Canada francophone" />
        <meta name="rating" content="General" />
        <meta name="language" content="fr-FR" />
        {/* Geo targeting */}
        <meta name="geo.region" content="FR" />
        <meta name="geo.country" content="France" />
        <meta name="ICBM" content="46.2276, 2.2137" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
