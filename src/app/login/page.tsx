'use client'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const supabase = createClient()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  const signInWithApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🔴</div>
          <h1 className="text-2xl font-semibold text-gray-900">MyOffMode</h1>
          <p className="text-gray-500 text-sm mt-2">
            Activate your OFF Mode. The home handles itself.
          </p>
        </div>

        {/* Boutons connexion */}
        <div className="space-y-3">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.76-2.7.76-2.07 0-3.82-1.4-4.45-3.28H1.86v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.53 10.53a4.8 4.8 0 0 1 0-3.06V5.4H1.86a8 8 0 0 0 0 7.2l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.19c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.86 5.4L4.53 7.47c.63-1.88 2.38-3.28 4.45-3.28z"/>
            </svg>
            Continuer avec Google
          </button>

          <button
            onClick={signInWithApple}
            className="w-full flex items-center justify-center gap-3 bg-black rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="white">
              <path d="M8.52 3.59c.74 0 1.67-.5 2.22-1.16.5-.6.86-1.44.86-2.28 0-.11-.01-.22-.03-.31-.82.03-1.8.55-2.39 1.24-.47.53-.89 1.36-.89 2.21 0 .12.02.24.03.28.05.01.13.02.2.02zM5.9 16.5c1.02 0 1.47-.68 2.73-.68 1.28 0 1.56.67 2.69.67 1.11 0 1.85-.96 2.56-1.9.79-1.07 1.12-2.12 1.14-2.17-.07-.02-2.22-.9-2.22-3.37 0-2.12 1.63-3.1 1.72-3.16-.99-1.42-2.5-1.46-2.93-1.46-1.24 0-2.25.74-2.88.74-.67 0-1.58-.7-2.65-.7C3.54 4.37 1.5 5.98 1.5 9.1c0 1.95.76 4.02 1.69 5.35.8 1.13 1.5 2.05 2.71 2.05z"/>
            </svg>
            Continuer avec Apple
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          En continuant, tu acceptes nos{' '}
          <a href="/terms" className="underline">Conditions d'utilisation</a>
        </p>
      </div>
    </div>
  )
}
