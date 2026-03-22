'use client'
import { useState } from 'react'
import SiteShell from '../../components/SiteShell'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FEED_ITEMS = [
  { img: '/images/card-oshi.webp', action: 'Oshi sold', detail: 'AK-SIG-007 · wallet_0xoshi → wallet_0xnova', time: '2m', price: '1.82 SOL', type: 'sale' },
  { img: '/images/card-sora.webp', action: 'Sora listed', detail: 'AK-SIG-012 · wallet_0xsora', time: '5m', price: '0.94 SOL', type: 'listing' },
  { img: '/images/card-nova.webp', action: 'Nova minted', detail: 'AK-DAT-003 · wallet_0xdat → wallet_0xnova', time: '9m', price: '0.48 SOL', type: 'mint' },
  { img: '/images/card-4.webp', action: 'Kira sold', detail: 'AK-MKT-001 · wallet_0xkira → wallet_0xalpha', time: '14m', price: '2.16 SOL', type: 'sale' },
  { img: '/images/card-5.webp', action: 'Axe listed', detail: 'AK-PRT-009 · wallet_0xaxe', time: '22m', price: '0.24 SOL', type: 'listing' },
  { img: '/images/card-oshi.webp', action: 'Oshi transfer', detail: 'AK-SIG-007 · wallet_0xnova → wallet_0xomega', time: '31m', price: '—', type: 'transfer' },
]

const TOP_MOVERS = [
  { img: '/images/card-oshi.webp', name: 'Oshi', change: '+24.6%', up: true },
  { img: '/images/card-4.webp', name: 'Kira', change: '+18.2%', up: true },
  { img: '/images/card-sora.webp', name: 'Sora', change: '+8.9%', up: true },
  { img: '/images/card-nova.webp', name: 'Nova', change: '-3.1%', up: false },
]

const FILTERS = ['All', 'Sales', 'Listings', 'Mints', 'Transfers']

const typeColor: Record<string, string> = {
  sale: '#34d399', listing: '#60a5fa', mint: '#c084fc', transfer: '#f59e0b',
}

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  useScrollReveal()

  return (
    <SiteShell>
      <div style={{ display: 'grid', gap: 22, paddingTop: 26 }} className="page-enter">
        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 22, alignItems: 'stretch' }} className="hero-grid">
          {/* Copy */}
          <div className="panel section-pad">
            <div className="eyebrow" style={{ marginBottom: 18 }}>● Live Feed</div>
            <h1 style={{ fontSize: 64, lineHeight: .95, letterSpacing: '-.05em', margin: '0 0 16px', fontWeight: 900 }}>
              Market<br/><span className="grad">Activity.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.75, margin: '0 0 24px' }}>
              Real-time transactions across the AgentKeys ecosystem. Every sale, listing, mint, and transfer.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: '24h Volume', value: '42.8 SOL' },
                { label: 'Transactions', value: '847' },
                { label: 'Active Wallets', value: '312' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal panel */}
          <div className="panel section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '15%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,.08), transparent 72%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div className="signal-dot" />
              <span style={{ fontWeight: 800, fontSize: 14, color: '#34d399' }}>Live Market Signal</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              {[
                { label: 'Floor Price', value: '1.82 SOL', change: '+2.4%', up: true },
                { label: 'Avg Sale', value: '0.84 SOL', change: '+6.8%', up: true },
                { label: 'Listed', value: '142', change: '-8', up: false },
                { label: 'Unique Buyers', value: '56', change: '+12', up: true },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.up ? '#34d399' : '#f87171', fontWeight: 700, marginTop: 2 }}>{s.change}</div>
                </div>
              ))}
            </div>

            {/* Mini chart bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
              {[40, 65, 48, 82, 70, 90, 75, 88, 95, 72, 84, 100].map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 3, background: `rgba(52,211,153,${0.3 + h / 200})`,
                  height: h * 0.6 + '%', minHeight: 4,
                  transition: 'height .3s ease',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {FILTERS.map(f => (
              <button key={f} className={`chip${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
          <div style={{ padding: '8px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.025)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', flexShrink: 0 }}>
            Sort: Newest ▾
          </div>
        </div>

        {/* Main: feed + side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 20 }} className="two-col-grid">
          {/* Feed */}
          <div className="panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div className="signal-dot" style={{ width: 8, height: 8 }} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Transaction Feed</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FEED_ITEMS.map((item, i) => (
                <div key={i} className="feed-item" style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 12, alignItems: 'center', padding: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 14, fontWeight: 800 }}>{item.action}</strong>
                      <span style={{
                        padding: '2px 7px', borderRadius: 999,
                        background: `${typeColor[item.type]}18`,
                        color: typeColor[item.type],
                        fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em',
                      }}>{item.type}</span>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(228,228,231,.46)', fontSize: 12 }}>{item.detail}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#c084fc', marginBottom: 4 }}>{item.price}</div>
                    <div style={{ fontSize: 10, color: 'rgba(228,228,231,.36)', textTransform: 'uppercase', letterSpacing: '.12em' }}>{item.time}m ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top movers */}
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, margin: '0 0 16px', fontWeight: 800 }}>Top Movers (24h)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TOP_MOVERS.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={m.img} alt={m.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{m.name}</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 14, color: m.up ? '#34d399' : '#f87171' }}>{m.change}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, margin: '0 0 16px', fontWeight: 800 }}>Activity Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Total Sales', value: '284', note: '24h' },
                  { label: 'New Listings', value: '142', note: '24h' },
                  { label: 'Mints', value: '98', note: '24h' },
                  { label: 'Transfers', value: '323', note: '24h' },
                  { label: 'Unique Wallets', value: '312', note: 'active' },
                  { label: 'Avg Price', value: '0.84 SOL', note: '24h' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{s.label}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(245,242,239,.35)' }}>{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
