'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface IntroOverlayProps {
  onDismiss: () => void
}

export default function IntroOverlay({ onDismiss }: IntroOverlayProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [ripping, setRipping] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const runParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const particles: { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number; hue: number; type: string }[] = []

    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 5
      particles.push({ x: cx, y: cy, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 2, r: 2 + Math.random() * 4, life: 0, maxLife: 60 + Math.random() * 80, hue: Math.random() > .5 ? 270 : Math.random() > .5 ? 320 : 45, type: 'radial' })
    }
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 8
      particles.push({ x: cx, y: cy, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r: 1 + Math.random() * 2, life: 0, maxLife: 40 + Math.random() * 60, hue: Math.random() > .5 ? 200 : 160, type: 'sparkle' })
    }

    let startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      if (elapsed > 2200) { ctx.clearRect(0, 0, canvas.width, canvas.height); return }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.life++
        p.x += p.vx; p.y += p.vy
        p.vy += 0.06
        p.vx *= 0.98; p.vy *= 0.98
        const alpha = Math.max(0, 1 - p.life / p.maxLife)
        ctx.globalAlpha = alpha
        ctx.fillStyle = `hsl(${p.hue}, 90%, 70%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2)
        ctx.fill()
      })
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])

  const openPack = useCallback(() => {
    setRipping(true)
    runParticles()
    setTimeout(() => { setStep(2); setRipping(false) }, 1400)
  }, [runParticles])

  useEffect(() => {
    const onKey = () => onDismiss()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(3,3,5,.96)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        position: 'relative', width: 'min(960px, 100%)', minHeight: 640,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: '8%', left: '12%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,.14), transparent 72%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '12%', right: '14%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,.10), transparent 72%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100%', height: '100%' }} />

        {/* Step 1: Pack */}
        {step === 1 && (
          <div
            onClick={openPack}
            style={{
              position: 'relative', width: 300, height: 420,
              borderRadius: 20, cursor: 'pointer', overflow: 'hidden',
              animation: `introPackGlow 2.8s ease-in-out infinite`,
              transform: ripping ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform .2s ease',
              clipPath: ripping ? 'inset(50% 0 50% 0)' : 'none',
              opacity: ripping ? 0 : 1,
            }}
          >
            <img src="/images/pack-standard.webp" alt="AgentKeys Pack" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 20 }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'linear-gradient(250deg, transparent 35%, rgba(255,255,255,.12) 48%, rgba(255,255,255,.24) 50%, rgba(255,255,255,.12) 52%, transparent 65%)',
              backgroundSize: '200% 100%',
              animation: 'introShimmer 3s linear infinite',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
              padding: '8px 16px', borderRadius: 999, background: 'rgba(6,6,10,.7)',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.14)',
              fontSize: 11, fontWeight: 900, letterSpacing: '.2em', color: 'rgba(255,255,255,.9)',
              whiteSpace: 'nowrap',
            }}>TAP TO OPEN</div>
          </div>
        )}

        {/* Step 2: Fan + Enter */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* Fan cards */}
            <div style={{ display: 'flex', gap: 12, perspective: 900 }}>
              {[
                { img: '/images/card-oshi.webp', rot: -18, tx: -40 },
                { img: '/images/card-sora.webp', rot: 0, tx: 0 },
                { img: '/images/card-nova.webp', rot: 18, tx: 40 },
              ].map((c, i) => (
                <div key={i} style={{
                  width: 140, height: 200, borderRadius: 14, overflow: 'hidden',
                  transform: `rotate(${c.rot}deg) translateX(${c.tx}px)`,
                  animation: `fanBob 6s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 40px rgba(139,92,246,.2)',
                  border: '1px solid rgba(255,255,255,.12)',
                }}>
                  <img src={c.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            {/* Copy */}
            <div style={{ textAlign: 'center', maxWidth: 460 }}>
              <div style={{ textTransform: 'uppercase', letterSpacing: '.3em', color: 'rgba(192,132,252,.6)', fontSize: 11, fontWeight: 800, marginBottom: 12 }}>AGENTKEYS</div>
              <h2 style={{ fontSize: 42, lineHeight: 1, letterSpacing: '-.04em', margin: '0 0 12px', fontWeight: 900 }}>Your first pack is ready.</h2>
              <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, margin: '0 0 22px' }}>Discover, collect, and trade agent skills as digital keycards.</p>
              <button
                className="btn"
                onClick={onDismiss}
                style={{ margin: '0 auto', display: 'block' }}
              >
                Enter AgentKeys →
              </button>
              <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(245,242,239,.36)', letterSpacing: '.1em' }}>press any key to skip</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
