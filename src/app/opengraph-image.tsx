import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "MyOffMode · L'app anti-charge mentale pour mamans débordées"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// ─────────────────────────────────────────────────────────────────
// OG IMAGE STRATEGY
// ─────────────────────────────────────────────────────────────────
// This image appears on EVERY social share of myoffmode.com.
// It must visually answer in < 1 second:
//   - What is it? (app pour mamans)
//   - What does it do? (charge mentale → souffle)
//   - What's the brand? (MyOffMode · dusty rose)
//
// When shared on WhatsApp, LinkedIn, Facebook, Instagram stories →
// the brand immediately reads as "charge mentale maman" not "random SaaS".
// ─────────────────────────────────────────────────────────────────

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#12080E',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,115,122,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,107,143,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />

        {/* Top line */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #C4737A 30%, #C4737A 70%, transparent)',
        }} />

        {/* Logo + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#C4737A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              opacity: 0.9,
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#F5EEE8',
              letterSpacing: '-0.3px',
              lineHeight: 1,
            }}>
              MyOffMode
            </span>
            <span style={{
              fontSize: '12px',
              color: 'rgba(245,238,232,0.4)',
              letterSpacing: '0.08em',
              marginTop: '3px',
              textTransform: 'uppercase',
            }}>
              Charge mentale maman
            </span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, paddingTop: '48px' }}>

          {/* Headline */}
          <div style={{
            fontSize: '64px',
            fontWeight: '900',
            color: '#F5EEE8',
            lineHeight: 1.05,
            letterSpacing: '-2px',
            maxWidth: '680px',
          }}>
            Tu n&apos;as pas à<br />
            <span style={{ color: '#C4737A' }}>tout porter.</span>
          </div>

          {/* Subline */}
          <div style={{
            fontSize: '22px',
            color: 'rgba(245,238,232,0.55)',
            lineHeight: 1.5,
            maxWidth: '560px',
          }}>
            L&apos;app anti-charge mentale pour mamans débordées.
            Pose tes routines. Ton partenaire gère. Tu souffles.
          </div>

        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '32px',
          borderTop: '1px solid rgba(245,238,232,0.07)',
        }}>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Charge mentale', 'Épuisement maternel', 'Off Mode'].map((tag) => (
              <div key={tag} style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: '1px solid rgba(196,115,122,0.3)',
                background: 'rgba(196,115,122,0.1)',
                fontSize: '14px',
                color: 'rgba(245,238,232,0.65)',
              }}>
                {tag}
              </div>
            ))}
          </div>

          {/* CTA badge */}
          <div style={{
            padding: '12px 24px',
            borderRadius: '100px',
            background: '#C4737A',
            fontSize: '15px',
            fontWeight: '700',
            color: 'white',
          }}>
            Essai gratuit →
          </div>

        </div>

      </div>
    ),
    {
      ...size,
    }
  )
}
