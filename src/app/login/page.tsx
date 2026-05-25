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
    <div className="min-h-screen bg-[#0a0a0f] flex">

      {/* Left — visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-[#0a0a0f] to-purple-500/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">MyOffMode</span>
          </div>

          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/50 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                OFF Mode actif — 2 400 familles
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
                La maison<br />
                <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                  se gère seule.
                </span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed">
                Encode tes routines une fois.<br />
                L&apos;IA explique à ton partenaire.
              </p>
            </div>

            {/* Testimonial */}
            <div className="border border-white/[0.06] rounded-2xl p-5 bg-white/[0.02]">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                &ldquo;J&apos;ai enfin passé un weekend entier sans un seul appel. MyOffMode a tout expliqué à mon mari mieux que moi.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face"
                  alt="Sofia"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                />
                <div>
                  <p className="text-white text-xs font-semibold">Sofia M.</p>
                  <p className="text-white/30 text-xs">Maman de 2 enfants, Paris</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/20">© 2026 MyOffMode</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">MyOffMode</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">
              {isSignUp ? 'Créer mon compte' : 'Bon retour 👋'}
            </h1>
            <p className="text-white/40 text-sm">
              {isSignUp
                ? 'Rejoins 2 400+ familles qui ont activé leur OFF Mode'
                : 'Connecte-toi pour accéder à ton espace famille'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="toi@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-rose-500/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-rose-500/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {(error || urlError) && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error || urlError}</p>
              </div>
            )}
            {message && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <p className="text-green-400 text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-400 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : isSignUp ? 'Créer mon compte →' : 'Se connecter →'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {isSignUp ? 'Déjà un compte ? Connexion' : 'Pas encore de compte ? Inscription'}
            </button>
            {!isSignUp && (
              <Link href="/auth/reset-password"
                className="text-xs text-white/40 hover:text-rose-400 transition-colors">
                Mot de passe oublié ?
              </Link>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-white/20 text-center leading-relaxed">
              En créant un compte, tu acceptes nos conditions d&apos;utilisation.<br />
              Données protégées · Hébergement EU · RGPD compliant.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-rose-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
