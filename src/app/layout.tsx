import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyOffMode — Activate your OFF Mode. The home handles itself.',
  description: "Encode tes routines une fois. L'IA explique ta façon de faire à ton partenaire. La maison tourne même quand tu décroches.",
  metadataBase: new URL('https://myoffmode.com'),
  openGraph: {
    title: 'MyOffMode',
    description: 'Activate your OFF Mode. The home handles itself.',
    url: 'https://myoffmode.com',
    siteName: 'MyOffMode',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyOffMode',
    description: 'Activate your OFF Mode. The home handles itself.',
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
