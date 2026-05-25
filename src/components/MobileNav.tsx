'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  // Ferme le menu quand on clique sur un lien ancre
  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    document.addEventListener('click', handler, { capture: true })
    return () => document.removeEventListener('click', handler, { capture: true })
  }, [open])

  // Bloque le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Burger button — visible seulement sur mobile */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 group"
      >
        <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
        <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
        <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>

      {/* Overlay + slide panel */}
      {open && (
        <div className="fixed inset-0 z-[100] sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 flex flex-col"
            style={{ background: '#1a0a14', borderLeft: '1px solid rgba(245,238,232,0.06)' }}>
            {/* Header du panel */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#C4737A' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <span className="font-bold text-white text-sm">MyOffMode</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors text-xl leading-none">✕</button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
              {[
                { href: '#fonctionnalites', label: 'Fonctionnalités', desc: 'Comment ça marche' },
                { href: '#temoignages', label: 'Témoignages', desc: 'Elles ont osé décrocher' },
                { href: '#tarifs', label: 'Tarifs', desc: 'Commence gratuitement' },
                { href: '/blog', label: 'Blog', desc: 'Charge mentale & bien-être' },
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
                >
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                  <span className="text-xs text-white/30 mt-0.5">{item.desc}</span>
                </a>
              ))}
            </nav>

            {/* CTAs */}
            <div className="px-6 pb-8 space-y-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#C4737A' }}
              >
                Commencer gratuitement →
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/70 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
