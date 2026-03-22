'use client'
import { useEffect, useRef } from 'react'

const DOC_ITEMS = [
  { num: '01', title: 'Register Your Agent', desc: 'Link your agent wallet and publish your skill manifest to the AgentKeys registry.' },
  { num: '02', title: 'Mint KeyCards', desc: 'Create tradeable NFT keycards that grant holders access to your agent capabilities.' },
  { num: '03', title: 'List on Market', desc: 'Set pricing, manage supply, and trade skill access in the live marketplace.' },
  { num: '04', title: 'Track Analytics', desc: 'Monitor skill usage, transaction volume, and holder stats in real-time.' },
]

export default function FoundrySection() {
  const leftRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const templateRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const left = leftRef.current
    const box = boxRef.current
    const template = templateRef.current
    if (!left || !box || !template) return

    const onMouseMove = (e: MouseEvent) => {
      const r = left.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) - 0.5
      const y = ((e.clientY - r.top) / r.height) - 0.5
      box.style.transform = `translate3d(${x * 10}px,${y * -10}px,0) rotateZ(${x * 1.2}deg)`
      template.style.transform = `rotate(${10 + x * 2.5}deg) rotateX(${y * -4}deg) rotateY(${x * 6}deg) translate3d(${x * 7}px,${y * -5}px,0)`
    }
    const onMouseLeave = () => {
      box.style.transform = ''
      template.style.transform = ''
    }

    left.addEventListener('mousemove', onMouseMove)
    left.addEventListener('mouseleave', onMouseLeave)
    return () => {
      left.removeEventListener('mousemove', onMouseMove)
      left.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const docItems = grid.querySelectorAll('.doc-item')

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        grid.classList.add('is-live')
        docItems.forEach((item, i) => {
          (item as HTMLElement).style.transitionDelay = (i * 90) + 'ms'
          item.classList.add('is-visible')
        })
        observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={gridRef} className="foundry-grid" style={{ display: 'grid', gridTemplateColumns: '.82fr 1.18fr', gap: 30 }}>
      {/* Left: 3D vault */}
      <div
        ref={leftRef}
        className="panel"
        style={{
          minHeight: 480, padding: 28, position: 'relative', overflow: 'hidden',
          background: 'radial-gradient(circle at 28% 24%, rgba(139,92,246,.16), transparent 26%), radial-gradient(circle at 72% 68%, rgba(236,72,153,.08), transparent 22%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.01))',
          perspective: 1800, transformStyle: 'preserve-3d',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'crosshair',
        }}
      >
        {/* Atmosphere */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 35% 30%, rgba(139,92,246,.12), transparent 18%), radial-gradient(circle at 68% 60%, rgba(96,165,250,.10), transparent 20%)',
          filter: 'blur(14px)', opacity: .92,
          animation: 'foundryAura 8s ease-in-out infinite',
        }} />

        {/* Box/vault */}
        <div
          ref={boxRef}
          style={{
            position: 'relative', zIndex: 3, width: 240,
            transition: 'transform .22s var(--ease-premium)',
            animation: 'vaultFloat 9.4s ease-in-out infinite',
          }}
        >
          <img
            src="/images/box-vault.webp"
            alt="AgentKeys Vault"
            style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 0 40px rgba(139,92,246,.22))' }}
          />
          {/* Scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,.7), rgba(96,165,250,.7), transparent)',
            opacity: 0, animation: 'vaultScan 4.2s ease-in-out infinite',
          }} />
        </div>

        {/* Template card */}
        <div
          ref={templateRef}
          style={{
            position: 'absolute', right: 24, top: 40, width: 100, zIndex: 2,
            transform: 'rotate(10deg)',
            transition: 'transform .22s var(--ease-premium)',
            animation: 'templateFloat 8s ease-in-out infinite',
            opacity: .88,
          }}
        >
          <img src="/images/card-sora.webp" alt="" style={{ width: '100%', display: 'block', borderRadius: 12, boxShadow: '0 0 24px rgba(139,92,246,.2)' }} />
          {/* Template scan */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(96,165,250,.8), transparent)',
            opacity: 0, animation: 'templateScan 3.8s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Right: docs */}
      <div className="panel" style={{ padding: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 20 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>Developer Tools</div>
            <h3 style={{ fontSize: 48, lineHeight: 1, letterSpacing: '-.04em', margin: 0, fontWeight: 900 }}>
              Build<br/>on AgentKeys.
            </h3>
          </div>
          <div style={{
            border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.03)',
            borderRadius: 14, padding: '10px 14px', fontSize: 12, fontWeight: 800, color: '#f5f2ef',
            whiteSpace: 'nowrap',
          }}>AK-API-v2</div>
        </div>

        {DOC_ITEMS.map((item, i) => (
          <div key={i} className="doc-item" style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 16, marginTop: 18 }}>
            <div style={{ color: '#f5f2ef', fontSize: 34, lineHeight: 1, opacity: .9, fontWeight: 900 }}>{item.num}</div>
            <div>
              <h4 style={{ fontSize: 17, margin: '0 0 7px', fontWeight: 800 }}>{item.title}</h4>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.75, fontSize: 14 }}>{item.desc}</p>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
          <a href="/developers" className="btn" style={{ fontSize: 14, padding: '14px 22px' }}>View Docs</a>
          <a href="/developers" className="btn secondary" style={{ fontSize: 14, padding: '14px 22px' }}>API Reference</a>
        </div>
      </div>
    </div>
  )
}
