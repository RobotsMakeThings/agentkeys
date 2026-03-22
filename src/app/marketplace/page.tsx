'use client'
import { useState } from 'react'
import SiteShell from '../../components/SiteShell'
import ListingCard from '../../components/marketplace/ListingCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const LISTINGS = [
  { img: '/images/card-oshi.webp', name: 'Oshi', sub: 'Oracle of Signal · Legendary', price: '1.82 SOL', serial: 'AK-SIG-007', tags: ['BTC', 'Signals', 'Live Skills'], rarity: 'Legendary' },
  { img: '/images/card-sora.webp', name: 'Sora', sub: 'Signal Weaver · Epic', price: '0.94 SOL', serial: 'AK-SIG-012', tags: ['Signals', 'Weave', 'Feed'], rarity: 'Epic' },
  { img: '/images/card-nova.webp', name: 'Nova', sub: 'Data Architect · Rare', price: '0.48 SOL', serial: 'AK-DAT-003', tags: ['Analytics', 'Data', 'Queries'], rarity: 'Rare' },
  { img: '/images/card-4.webp', name: 'Kira', sub: 'Market Oracle · Legendary', price: '2.16 SOL', serial: 'AK-MKT-001', tags: ['Market', 'Predict', 'Live'], rarity: 'Legendary' },
]

const TAPE_ITEMS = [
  { name: 'Oshi sold', serial: 'AK-SIG-007', price: '1.82 SOL', time: '2m', dot: 'emerald' },
  { name: 'Sora listed', serial: 'AK-SIG-012', price: '0.94 SOL', time: '5m', dot: 'blue' },
  { name: 'Nova sold', serial: 'AK-DAT-003', price: '0.48 SOL', time: '9m', dot: 'violet' },
  { name: 'Kira listed', serial: 'AK-MKT-001', price: '2.16 SOL', time: '14m', dot: 'amber' },
  { name: 'Oshi transfer', serial: 'AK-SIG-007', price: '—', time: '18m', dot: 'blue' },
]

const FILTERS = ['All', 'Signal', 'Climate', 'Analytics', 'Genesis']

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState('All')
  useScrollReveal()

  return (
    <SiteShell>
      <div className="panel section-pad page-enter" style={{ marginTop: 26 }}>
        {/* Head */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'flex-end', marginBottom: 26 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>Marketplace</div>
            <h2 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-.05em', margin: '0 0 10px', fontWeight: 900 }}>KeyCard Market</h2>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: 16 }}>Trade AI agent skill access as digital collectibles on Solana.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Floor', value: '1.82 SOL' },
              { label: '24h Volume', value: '42.8 SOL' },
              { label: 'Cards', value: '8,200' },
              { label: 'Holders', value: '2,847' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontWeight: 900, fontSize: 14 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 22, marginBottom: 22 }}>
          {/* Spotlight */}
          <div className="panel" style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 200, flexShrink: 0 }}>
              <img src="/images/card-oshi.webp" alt="Oshi" style={{ width: '100%', display: 'block', borderRadius: 18, boxShadow: '0 0 50px rgba(139,92,246,.2)' }} />
            </div>
            <div>
              <div style={{ textTransform: 'uppercase', letterSpacing: '.2em', fontSize: 11, fontWeight: 800, color: '#f59e0b', marginBottom: 8 }}>✦ Featured</div>
              <h3 style={{ fontSize: 36, margin: '0 0 6px', fontWeight: 900, letterSpacing: '-.04em' }}>Oshi</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 14px' }}>Oracle of Signal · Legendary · Listed</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {['BTC', 'Signals', 'Live Skills'].map(t => (
                  <span key={t} style={{ padding: '4px 8px', borderRadius: 999, border: '1px solid rgba(245,158,11,.2)', background: 'rgba(245,158,11,.06)', fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#c084fc', marginBottom: 12 }}>1.82 SOL</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" style={{ padding: '12px 20px', fontSize: 14 }}>Buy Now</button>
                <button className="btn secondary" style={{ padding: '12px 20px', fontSize: 14 }}>Details</button>
              </div>
            </div>
          </div>

          {/* Live tape */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="signal-dot" />
              <div style={{ fontWeight: 800, fontSize: 14 }}>Live Sales</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TAPE_ITEMS.map((item, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '8px 1fr auto auto', gap: 10,
                  alignItems: 'center', padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(255,255,255,.024)', border: '1px solid rgba(255,255,255,.06)',
                }}>
                  <div className={`dot ${item.dot}`} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(245,242,239,.4)' }}>{item.serial}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#c084fc' }}>{item.price}</div>
                  <div style={{ fontSize: 10, color: 'rgba(245,242,239,.36)', textAlign: 'right' }}>{item.time}m</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`chip${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>
          <div style={{
            padding: '8px 14px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.025)',
            fontSize: 12, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer',
          }}>Sort: Recent ▾</div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 22 }} className="four-col-grid">
          {LISTINGS.map((card, i) => (
            <ListingCard key={i} {...card} />
          ))}
        </div>

        {/* Secondary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 18 }} className="two-col-grid">
          {/* Sealed shelf */}
          <div className="panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 22, margin: 0, fontWeight: 800 }}>Sealed Products</h3>
              <a href="/mint" className="btn sm secondary">View Mint</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { img: '/images/pack-standard.webp', name: 'Standard Pack', price: '2.4 SOL', qty: '2,847 left' },
                { img: '/images/box-vault.webp', name: 'Vault Box', price: '9.6 SOL', qty: '482 left' },
              ].map((p, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center', padding: 16 }}>
                  <img src={p.img} alt={p.name} style={{ width: 80, display: 'block', margin: '0 auto 10px', borderRadius: 12 }} />
                  <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: '#c084fc', fontWeight: 900, fontSize: 15 }}>{p.price}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{p.qty}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Market insight */}
          <div className="panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 22, margin: '0 0 18px', fontWeight: 800 }}>Market Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Legendary', value: 78, color: '#f59e0b' },
                { label: 'Epic', value: 60, color: '#c084fc' },
                { label: 'Rare', value: 45, color: '#60a5fa' },
                { label: 'Common', value: 28, color: '#34d399' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, fontWeight: 700 }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: item.value + '%', borderRadius: 999, background: item.color, transition: 'width .8s var(--ease-premium)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
