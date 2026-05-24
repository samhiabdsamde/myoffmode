'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log vers ton système de monitoring (Sentry, etc.)
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center px-6 text-center">
      <div>
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Une erreur est survenue</h1>
        <p className="text-gray-500 text-sm mb-2">{error.message || 'Erreur inattendue'}</p>
        {error.digest && <p className="text-xs text-gray-400 mb-6">ID: {error.digest}</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-600 transition text-sm">
            Réessayer
          </button>
          <a href="/" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition text-sm">
            Accueil
          </a>
        </div>
      </div>
    </div>
  )
}
