'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Consent = {
  necessary: true
  analytics: boolean
  marketing: boolean
  acceptedAt: string
}

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const save = (consent: Omit<Consent, 'necessary' | 'acceptedAt'>) => {
    const full: Consent = {
      necessary: true,
      ...consent,
      acceptedAt: new Date().toISOString(),
    }
    localStorage.setItem('cookie_consent', JSON.stringify(full))
    setShow(false)
  }

  const acceptAll = () => save({ analytics: true, marketing: true })
  const rejectAll = () => save({ analytics: false, marketing: false })
  const saveCustom = () => save({ analytics, marketing })

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Cookies & vie privée</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Nous utilisons des cookies pour faire fonctionner MyOffMode et améliorer ton expérience.
                Conformément au RGPD, tu peux choisir lesquels accepter.{' '}
                <Link href="/privacy" className="text-rose-500 underline">Politique de confidentialité</Link>
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-3 mb-4 bg-gray-50 rounded-xl p-4">
              {[
                {
                  label: 'Nécessaires',
                  desc: 'Authentification, session, sécurité. Obligatoires.',
                  checked: true,
                  disabled: true,
                  onChange: () => {},
                },
                {
                  label: 'Analytiques',
                  desc: 'Nous aident à comprendre comment tu utilises l\'app (anonyme).',
                  checked: analytics,
                  disabled: false,
                  onChange: () => setAnalytics(!analytics),
                },
                {
                  label: 'Marketing',
                  desc: 'Personnalisation des offres et emails promotionnels.',
                  checked: marketing,
                  disabled: false,
                  onChange: () => setMarketing(!marketing),
                },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={item.onChange}
                    disabled={item.disabled}
                    className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors mt-1 ${
                      item.checked ? 'bg-rose-500' : 'bg-gray-200'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptAll}
              className="flex-1 bg-rose-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-rose-600 transition min-w-[120px]"
            >
              Tout accepter
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-xs font-medium hover:bg-gray-50 transition min-w-[120px]"
            >
              Refuser
            </button>
            {showDetails ? (
              <button
                onClick={saveCustom}
                className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-black transition min-w-[120px]"
              >
                Enregistrer mes choix
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="text-xs text-gray-400 hover:text-gray-600 underline px-2"
              >
                Personnaliser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
