'use client'
import { useRef, useEffect, useState } from 'react'
import SiteShell from '../../components/SiteShell'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const TRENDING = [
  { serial: 'AK-SIG-007', name: 'Oshi', sub: 'Oracle of Signal · Legendary', price: '1.82 SOL', img: '/images/card-oshi.webp' },
  { serial: 'AK-SIG-012', name: 'Sora', sub: 'Signal Weaver · Epic', price: '0.94 SOL', img: '/images/card-sora.webp' },
  { serial: 'AK-DAT-003', name: 'Nova', sub: 'Data Architect · Rare', price: '0.48 SOL', img: '/images/card-nova.webp' },
  { serial: 'AK-MKT-001', name: 'Kira', sub: 'Market Oracle · Legendary', price: '2.16 SOL', img: '/images/card-4.webp' },
]

function HoloCard({ img }: { img: string }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    const tilt = tiltRef.current
    if (!panel || !tilt) return
    const onMove = (e: MouseEvent) => {
      const r = panel.getBoundingClientRect()
      const px = ((e.clientX - r.left) / r.width) * 100
      const py = ((e.clientY - r.top) / r.height) * 100
      const rx = ((py - 50) / 50) * -9
      const ry = ((px - 50) / 50) * 12
      panel.style.setProperty('--hero-x', px + '%')
      panel.style.setProperty('--hero-y', py + '%')
      panel.style.setProperty('--hero-angle', (118 + (px - 50) * 0.42) + 'deg')
      tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`
    }
    const onLeave = () => {
      panel.style.setProperty('--hero-x', '50%')
      panel.style.setProperty('--hero-y', '50%')
      tilt.style.transform = ''
    }
    panel.addEventListener('mousemove', onMove)
    panel.addEventListener('mouseleave', onLeave)
    return () => {
      panel.removeEventListener('mousemove', onMove)
      panel.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={panelRef} className="hero-card-panel panel" style={{
      minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28,
      background: 'radial-gradient(circle at 50% 20%, rgba(139,92,246,.14), transparent 28%)',
      perspective: 1200, '--hero-x': '50%', '--hero-y': '50%', '--hero-angle': '118deg',
    } as React.CSSProperties}>
      <div ref={tiltRef} style={{
        width: 260, position: 'relative', borderRadius: 24,
        transformStyle: 'preserve-3d',
        transition: 'transform .18s var(--ease-premium)',
      }}>
        <img src={img} alt="Selected card" style={{ width: '100%', display: 'block', borderRadius: 24, boxShadow: '0 0 60px rgba(139,92,246,.22)' }} />
        <div className="hero-holo" />
        <div className="hero-glare" />
        <div className="hero-edge" />
      </div>
    </div>
  )
}

export default function LookupPage() {
  const [activeTab, setActiveTab] = useState<'serial' | 'wallet' | 'agent'>('serial')
  const [query, setQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState(TRENDING[0])
  useScrollReveal()

  return (
    <SiteShell>
      <div className="panel section-pad page-enter" style={{ marginTop: 26 }}>
        {/* Head */}
        <div style={{ marginBottom: 26 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Agent Lookup</div>
          <h2 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-.05em', margin: '0 0 20px', fontWeight: 900 }}>Agent Lookup</h2>

          <div className="lookup-search-shell">
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {(['serial', 'wallet', 'agent'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`chip${activeTab === tab ? ' active' : ''}`}
                  style={{ textTransform: 'capitalize' }}
                >{tab === 'serial' ? 'Card Serial' : tab === 'wallet' ? 'Wallet' : 'Agent ID'}</button>
              ))}
            </div>

            {/* Input row */}
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={activeTab === 'serial' ? 'e.g. AK-SIG-007' : activeTab === 'wallet' ? 'e.g. wallet_0xoshi...' : 'e.g. oshi.oracle'}
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,.08)',
                  background: 'rgba(255,255,255,.04)',
                  color: '#f5f2ef', fontSize: 15, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button className="btn">Search</button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, marginBottom: 22 }} className="two-col-grid">
          {/* Detail */}
          <div className="panel" style={{ padding: 24 }}>
            <img src={selectedCard.img || '/images/card-oshi.webp'} alt={selectedCard.name} style={{ width: 200, display: 'block', margin: '0 auto 20px', borderRadius: 18, boxShadow: '0 0 40px rgba(139,92,246,.18)' }} />
            <h3 style={{ fontSize: 32, margin: '0 0 4px', fontWeight: 900 }}>{selectedCard.name}</h3>
            <p style={{ color: 'var(--muted)', margin: '0 0 14px', fontSize: 14 }}>{selectedCard.sub}</p>
            <div style={{ padding: '8px 14px', background: 'rgba(139,92,246,.1)', borderRadius: 10, display: 'inline-block', fontFamily: 'monospace', fontSize: 13, color: '#c084fc', marginBottom: 16 }}>{selectedCard.serial}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Owner', value: 'wallet_0xoshi' },
                { label: 'Floor', value: selectedCard.price },
                { label: 'Status', value: 'Live Listing' },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontWeight: 800, fontSize: 12 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>
              Legendary-tier keycard granting access to live market signal feed, BTC context window, and real-time analytics API.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {['BTC', 'Signals', 'Live Skills'].map(t => (
                <span key={t} style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(192,132,252,.18)', background: 'rgba(139,92,246,.06)', fontSize: 11, fontWeight: 700, color: '#c084fc' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/marketplace" className="btn" style={{ fontSize: 13, padding: '12px 18px' }}>View Market</a>
              <a href="/mint" className="btn secondary" style={{ fontSize: 13, padding: '12px 18px' }}>Mint More</a>
            </div>
          </div>

          {/* Holo card preview */}
          <HoloCard img="/images/card-oshi.webp" />
        </div>

        {/* Trending */}
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 22, margin: '0 0 18px', fontWeight: 800 }}>Trending Lookups</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="four-col-grid">
            {TRENDING.map((item, i) => (
              <div
                key={i}
                className="stat-card"
                style={{ cursor: 'pointer', transition: 'all .16s ease' }}
                onClick={() => setSelectedCard(item)}
              >
                <img src={item.img} alt="" style={{ width: 60, display: 'block', margin: '0 auto 10px', borderRadius: 10 }} />
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2, textAlign: 'center' }}>{item.name}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#c084fc', textAlign: 'center', marginBottom: 4 }}>{item.serial}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
