'use client'
import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const urlError = searchParams.get('error')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Vérifie ton email pour confirmer ton compte !')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push(redirect)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🔴</div>
          <h1 className="text-2xl font-semibold text-gray-900">MyOffMode</h1>
          <p className="text-gray-500 text-sm mt-2">Activate your OFF Mode. The home handles itself.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gray-400"
          />
          {(error || urlError) && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error || urlError}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : isSignUp ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        {!isSignUp && (
          <div className="text-center mt-3">
            <Link href="/auth/reset-password" className="text-xs text-gray-400 hover:text-gray-600 underline">
              Mot de passe oublié ?
            </Link>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="underline font-medium text-gray-900">
            {isSignUp ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
