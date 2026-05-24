import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center px-6 text-center">
      <div>
        <div className="text-6xl mb-6">🔴</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">404</h1>
        <p className="text-xl font-semibold text-gray-700 mb-2">Page introuvable</p>
        <p className="text-gray-500 text-sm mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <Link href="/" className="inline-block bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-600 transition">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
