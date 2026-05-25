import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "MyOffMode · L'app anti-charge mentale pour mamans"
export const size = { width: 1200, height: 628 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '1200px',
        height: '628px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#12080E',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(196,115,122,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, #C4737A 40%, #C4737A 60%, transparent)',
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          padding: '60px',
          zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#C4737A', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', opacity: 0.9 }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#F5EEE8', letterSpacing: '-0.3px' }}>
              MyOffMode
            </span>
          </div>

          <div style={{ fontSize: '52px', fontWeight: '900', color: '#F5EEE8', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
            La charge mentale<br />
            <span style={{ color: '#C4737A' }}>enfin allégée.</span>
          </div>

          <div style={{ fontSize: '20px', color: 'rgba(245,238,232,0.50)', maxWidth: '600px', lineHeight: 1.5 }}>
            Pour les mamans qui portent tout.
            L&apos;IA qui transmet tes routines à ton partenaire.
          </div>

          <div style={{
            marginTop: '8px',
            padding: '14px 32px', borderRadius: '100px',
            background: '#C4737A', fontSize: '16px', fontWeight: '700', color: 'white',
          }}>
            myoffmode.com — Essai gratuit
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
