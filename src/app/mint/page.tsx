'use client'
import { useRef, useEffect, useState } from 'react'
import SiteShell from '../../components/SiteShell'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { api } from '../../lib/api'
import type { Collection } from '../../types/agentkeys'

function MintVisual() {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const onMove = (e: MouseEvent) => {
      const r = panel.getBoundingClientRect()
      const px = ((e.clientX - r.left) / r.width) * 100
      const py = ((e.clientY - r.top) / r.height) * 100
      panel.style.setProperty('--mint-x', px + '%')
      panel.style.setProperty('--mint-y', py + '%')
      panel.style.setProperty('--mint-angle', (118 + (px - 50) * 0.42) + 'deg')
    }
    const onLeave = () => {
      panel.style.setProperty('--mint-x', '50%')
      panel.style.setProperty('--mint-y', '50%')
    }
    panel.addEventListener('mousemove', onMove)
    panel.addEventListener('mouseleave', onLeave)
    return () => {
      panel.removeEventListener('mousemove', onMove)
      panel.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={panelRef} className="panel" style={{
      minHeight: 480, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(139,92,246,.18), transparent 40%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.02))',
      '--mint-x': '50%', '--mint-y': '50%',
    } as React.CSSProperties}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,.14), transparent 72%)', filter: 'blur(50px)', pointerEvents: 'none', animation: 'foundryAura 7s ease-in-out infinite' }} />

      {/* Rings */}
      {[{ w: 300, h: 88, delay: '0s' }, { w: 240, h: 72, delay: '1.2s' }].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: 60, left: '50%',
          width: r.w, height: r.h, borderRadius: 999,
          border: '1px solid rgba(192,132,252,.18)',
          transform: `translateX(-50%) rotateX(82deg)`,
          animation: `ringPulse 4.8s ease-in-out infinite ${r.delay}`,
        }} />
      ))}

      {/* Floating box */}
      <div style={{ position: 'relative', zIndex: 3, animation: 'boxFloat 9.6s ease-in-out infinite', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/images/box-vault.webp" alt="Vault Box" style={{ width: 220, display: 'block', filter: 'drop-shadow(0 0 40px rgba(139,92,246,.28))' }} />
      </div>

      {/* Floating pack */}
      <div style={{
        position: 'absolute', right: '14%', bottom: '22%',
        width: 100, animation: 'packFloat 8.8s ease-in-out infinite',
        opacity: .88, zIndex: 2,
      }}>
        <img src="/images/pack-standard.webp" alt="Pack" style={{ width: '100%', display: 'block', borderRadius: 12, boxShadow: '0 0 24px rgba(139,92,246,.2)' }} />
      </div>

      {/* Holo overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 30,
        background: `linear-gradient(var(--mint-angle, 118deg), transparent 15%, rgba(255,60,60,.06) 30%, rgba(60,255,60,.06) 46%, rgba(200,60,255,.06) 62%, transparent 75%), radial-gradient(circle at var(--mint-x, 50%) var(--mint-y, 50%), rgba(192,132,252,.12), transparent 36%)`,
        pointerEvents: 'none', mixBlendMode: 'color-dodge',
      }} />
    </div>
  )
}

const FAN_CARDS = [
  { img: '/images/card-oshi.webp', rot: -24, tx: -80 },
  { img: '/images/card-sora.webp', rot: -10, tx: -36 },
  { img: '/images/card-nova.webp', rot: 2, tx: 0 },
  { img: '/images/card-4.webp', rot: 14, tx: 36 },
  { img: '/images/card-5.webp', rot: 26, tx: 80 },
]

export default function MintPage() {
  const [qty, setQty] = useState(1)
  const [collections, setCollections] = useState<Collection[] | null>(null)
  const [collectionsLoading, setCollectionsLoading] = useState(true)

  useScrollReveal()

  useEffect(() => {
    let cancelled = false
    api.get<Collection[]>('/api/collections?limit=100')
      .then(data => { if (!cancelled) setCollections(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setCollectionsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const floor = collections?.length
    ? Math.min(...collections.map(c => c.price_sol))
    : null
  const totalRemaining = collections?.reduce((sum, c) => sum + (c.max_supply - c.minted_count), 0) ?? null

  return (
    <SiteShell>
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 26 }}>
        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '.92fr 1.08fr', gap: 44, alignItems: 'center' }} className="hero-grid">
          {/* Copy */}
          <div className="panel section-pad">
            <div className="eyebrow" style={{ marginBottom: 18 }}>✦ Mint Live</div>
            <h1 style={{ fontSize: 64, lineHeight: .95, letterSpacing: '-.05em', margin: '0 0 16px', fontWeight: 900 }}>
              Open Your<br/><span className="grad">First Pack.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.75, margin: '0 0 24px' }}>
              Every pack contains 5 random agent skill keycards. Chance at Legendary. All cards are fully tradeable on the marketplace.
            </p>

            {/* Qty selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn secondary" style={{ padding: '12px 16px', fontSize: 18 }}>−</button>
              <span style={{ fontSize: 20, fontWeight: 900, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} className="btn secondary" style={{ padding: '12px 16px', fontSize: 18 }}>+</button>
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>packs</span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              {/* Mint button disabled — requires wallet integration + tx_signature from Solana */}
              <button className="btn" style={{ fontSize: 15, opacity: 0.7, cursor: 'not-allowed' }} disabled>
                Mint Now — {(2.4 * qty).toFixed(1)} SOL
                <span style={{ fontSize: 11, opacity: 0.7 }}> (Connect wallet to enable)</span>
              </button>
              <button className="btn secondary" style={{ fontSize: 15 }}>View Contents</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { label: 'Packs Remaining', value: collectionsLoading ? '…' : totalRemaining != null ? totalRemaining.toLocaleString() : '—' },
                { label: 'Floor', value: collectionsLoading ? '…' : floor != null ? `${floor} SOL` : '—' },
                { label: 'Genesis Odds', value: '4.2%' }, // no route available
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontWeight: 900, fontSize: 15 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Visual */}
          <MintVisual />
        </div>

        {/* Fan cards */}
        <div className="panel section-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 28, margin: 0, fontWeight: 900, letterSpacing: '-.04em' }}>Pack Contents</h3>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>5 cards per pack</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, perspective: 900, marginBottom: 20, animation: 'fanBob 6s ease-in-out infinite' }}>
            {FAN_CARDS.map((c, i) => (
              <div key={i} style={{
                width: 120, flexShrink: 0,
                transform: `rotate(${c.rot}deg) translateX(${c.tx * 0.3}px)`,
                borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 0 28px rgba(139,92,246,.14)',
                border: '1px solid rgba(255,255,255,.1)',
                animationDelay: `${i * 0.15}s`,
              }}>
                <img src={c.img} alt="" style={{ width: '100%', display: 'block' }} />
              </div>
            ))}
          </div>

          {/* Rarity breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }} className="four-col-grid">
            {[
              { rarity: 'Common', pct: '55%', color: 'rgba(245,242,239,.5)' },
              { rarity: 'Uncommon', pct: '28%', color: '#34d399' },
              { rarity: 'Rare', pct: '12%', color: '#60a5fa' },
              { rarity: 'Epic', pct: '4.8%', color: '#c084fc' },
              { rarity: 'Legendary', pct: '0.2%', color: '#f59e0b' },
            ].map((r, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: r.color, fontWeight: 800, marginBottom: 4 }}>{r.rarity}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: r.color }}>{r.pct}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="three-col-grid">
          {[
            { img: '/images/pack-standard.webp', name: 'Standard Pack', price: '2.4 SOL', desc: '5 cards · 4% Legendary chance', btn: 'Mint Pack' },
            { img: '/images/box-vault.webp', name: 'Vault Box', price: '9.6 SOL', desc: '25 cards · 18% Legendary chance', btn: 'Mint Box', featured: true },
            { img: '/images/pack-booster.webp', name: 'Booster Pack', price: '1.2 SOL', desc: '3 cards · 2% Legendary chance', btn: 'Mint Booster' },
          ].map((p, i) => (
            <div key={i} className="panel" style={{ padding: 24, textAlign: 'center', ...(p.featured ? { border: '1px solid rgba(245,158,11,.2)', boxShadow: '0 0 40px rgba(245,158,11,.08)' } : {}) }}>
              {p.featured && <div style={{ textTransform: 'uppercase', letterSpacing: '.2em', fontSize: 10, fontWeight: 800, color: '#f59e0b', marginBottom: 12 }}>✦ Most Popular</div>}
              <img src={p.img} alt={p.name} style={{ width: 120, margin: '0 auto 16px', display: 'block', borderRadius: 16 }} />
              <h4 style={{ fontSize: 20, margin: '0 0 6px', fontWeight: 800 }}>{p.name}</h4>
              <div style={{ fontSize: 26, fontWeight: 900, color: p.featured ? '#f59e0b' : '#c084fc', margin: '8px 0' }}>{p.price}</div>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 18px' }}>{p.desc}</p>
              <button className="btn" style={{ width: '100%', justifyContent: 'center' }}>{p.btn}</button>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="panel" style={{ padding: 24, display: 'flex', justifyContent: 'center', gap: 40 }}>
          {['On-chain Verified', 'Instant Delivery', 'Solana Mainnet', 'Open Source'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>
              <span style={{ color: '#34d399' }}>✓</span> {t}
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  )
}
