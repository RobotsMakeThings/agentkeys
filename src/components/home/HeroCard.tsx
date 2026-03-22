'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function HeroCard() {
  const panelRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLImageElement>(null)
  const [summoned, setSummoned] = useState(false)
  const [summoning, setSummoning] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) { setSummoned(true); return }
    requestAnimationFrame(() => setSummoning(true))
    const t = setTimeout(() => setSummoned(true), 5600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    const tilt = tiltRef.current
    const art = artRef.current
    if (!panel || !tilt || !art) return

    const onMouseMove = (e: MouseEvent) => {
      if (!summoned) return
      const r = panel.getBoundingClientRect()
      const px = ((e.clientX - r.left) / r.width) * 100
      const py = ((e.clientY - r.top) / r.height) * 100
      const rx = ((py - 50) / 50) * -9
      const ry = ((px - 50) / 50) * 12
      panel.style.setProperty('--hero-x', px + '%')
      panel.style.setProperty('--hero-y', py + '%')
      panel.style.setProperty('--hero-angle', (118 + (px - 50) * 0.42) + 'deg')
      tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.028)`
      art.style.transform = `translate3d(${(px - 50) * -0.18}px,${(py - 50) * -0.15}px,0) scale(1.03)`
    }
    const onMouseLeave = () => {
      panel.style.setProperty('--hero-x', '50%')
      panel.style.setProperty('--hero-y', '50%')
      tilt.style.transform = ''
      art.style.transform = ''
    }

    panel.addEventListener('mousemove', onMouseMove)
    panel.addEventListener('mouseleave', onMouseLeave)
    return () => {
      panel.removeEventListener('mousemove', onMouseMove)
      panel.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [summoned])

  const isSummonComplete = summoned

  return (
    <div
      ref={panelRef}
      className={`hero-card-panel panel${isSummonComplete ? ' summon-complete' : ''}`}
      style={{
        minHeight: 580,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 28, overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, rgba(139,92,246,.14), transparent 28%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.02))',
        perspective: '1400px',
        isolation: 'isolate',
        position: 'relative',
        '--hero-x': '50%',
        '--hero-y': '50%',
        '--hero-angle': '118deg',
      } as React.CSSProperties}
    >
      {/* Sheen ::after via inline element */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: 'linear-gradient(110deg, transparent 38%, rgba(255,255,255,.06) 47%, rgba(255,255,255,.16) 50%, rgba(255,255,255,.06) 53%, transparent 62%)',
        transform: 'translateX(-130%) skewX(-14deg)',
        animation: 'heroSheen 15s ease-in-out infinite',
        pointerEvents: 'none', mixBlendMode: 'screen',
        opacity: isSummonComplete ? 0.9 : 0,
        transition: 'opacity 1s ease',
        zIndex: 0,
      }} />

      {/* Summon effects */}
      {summoning && !isSummonComplete && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 8,
          pointerEvents: 'none', overflow: 'hidden', borderRadius: 30,
          transition: 'opacity 1.1s ease',
        }}>
          <div style={{
            position: 'absolute', left: '50%', bottom: 48, width: 320, height: 74,
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,.34), rgba(236,72,153,.12) 42%, transparent 72%)',
            filter: 'blur(8px)',
            animation: 'floorPulse 4.4s ease-in-out both',
          }} />
          <div style={{
            position: 'absolute', left: '50%', top: '-10%', width: 10, height: '120%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, transparent, rgba(196,132,252,.9) 18%, rgba(236,72,153,.72) 52%, rgba(245,158,11,.58) 82%, transparent)',
            boxShadow: '0 0 26px rgba(139,92,246,.44), 0 0 58px rgba(236,72,153,.20)',
            opacity: 0, filter: 'blur(1px)',
            animation: 'beamWake 4.1s ease-in-out both',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 48%, rgba(255,255,255,.20), transparent 12%), radial-gradient(circle at 50% 48%, rgba(139,92,246,.34), transparent 24%), radial-gradient(circle at 50% 48%, rgba(236,72,153,.16), transparent 34%)',
            opacity: 0,
            animation: 'bloomFlash 4.2s ease-out both',
          }} />
          <div style={{
            position: 'absolute', left: '50%', top: '49%', width: 188, zIndex: 5,
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 0 28px rgba(139,92,246,.26))',
            animation: 'packSummon 2.15s cubic-bezier(.22,1,.36,1) both',
          }}>
            <img src="/images/pack-standard.webp" alt="" style={{ width: '100%', display: 'block', borderRadius: 18 }} />
          </div>
          {/* Ghost cards */}
          {[
            { cls: 'g1', anim: 'ghostLeft 3.8s cubic-bezier(.18,1,.32,1) both', delay: '.96s', trail: 'rgba(52,211,153,.36)', core: 'rgba(52,211,153,.18)' },
            { cls: 'g2', anim: 'ghostTop 3.8s cubic-bezier(.18,1,.32,1) both', delay: '1.12s', trail: 'rgba(96,165,250,.36)', core: 'rgba(96,165,250,.18)' },
            { cls: 'g3', anim: 'ghostRight 3.8s cubic-bezier(.18,1,.32,1) both', delay: '1.28s', trail: 'rgba(167,139,250,.40)', core: 'rgba(167,139,250,.20)' },
          ].map((g, i) => (
            <div key={g.cls} style={{
              position: 'absolute', left: '50%', top: '52%',
              width: 112, aspectRatio: '0.68', borderRadius: 16,
              opacity: 0, transformStyle: 'preserve-3d',
              border: '1px solid rgba(255,255,255,.18)',
              background: `linear-gradient(160deg, rgba(255,255,255,.06), rgba(255,255,255,.015)), radial-gradient(circle at 24% 18%, rgba(255,255,255,.22), transparent 20%)`,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.05), 0 0 26px rgba(139,92,246,.18)',
              backdropFilter: 'blur(6px)',
              overflow: 'hidden',
              animation: g.anim,
              animationDelay: g.delay,
            }}>
              <img src={`/images/card-${['sora', 'nova', 'oshi'][i]}.webp`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
            </div>
          ))}
        </div>
      )}

      {/* Card stage */}
      <div style={{
        width: 360, maxWidth: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isSummonComplete ? 1 : 0,
        filter: isSummonComplete ? 'none' : 'blur(10px)',
        transform: isSummonComplete ? 'none' : 'scale(.92) rotateY(-34deg)',
        transition: 'opacity 1.9s cubic-bezier(.16,1,.3,1), filter 1.9s cubic-bezier(.16,1,.3,1), transform 2.2s var(--ease-premium)',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{
          width: '100%',
          animation: isSummonComplete ? 'heroFloat 12s ease-in-out infinite' : 'none',
          willChange: 'transform',
        }}>
          <div
            ref={tiltRef}
            style={{
              position: 'relative', width: '100%', borderRadius: 24,
              transformStyle: 'preserve-3d',
              transition: 'transform .18s var(--ease-premium), box-shadow .18s ease',
              willChange: 'transform',
            }}
          >
            <img
              ref={artRef}
              src="/images/card-oshi.webp"
              alt="Oshi — Oracle of Signal"
              style={{
                width: '100%', display: 'block', borderRadius: 24,
                boxShadow: '0 0 70px rgba(139,92,246,.22)',
                transition: 'transform .18s var(--ease-premium), filter .18s ease, box-shadow .18s ease',
                transformOrigin: 'center center',
                willChange: 'transform',
                position: 'relative', zIndex: 1,
              }}
            />
            <div className="hero-holo" />
            <div className="hero-glare" />
            <div className="hero-edge" />
          </div>
        </div>
      </div>
    </div>
  )
}
