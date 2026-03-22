'use client'
import { useState, useEffect } from 'react'
import SiteShell from '../../components/SiteShell'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { api } from '../../lib/api'
import type { Transaction, RarityTier } from '../../types/agentkeys'
import SkillCard from '@/components/ui/SkillCard'

const TOP_MOVERS: Array<{ img: string; name: string; subtitle: string; rarityTier: RarityTier; serial: string; change: string; up: boolean }> = [
  { img: '/images/card-oshi.webp', name: 'Oshi', subtitle: 'Oracle of Signal', rarityTier: 'legendary', serial: 'AK-001', change: '+24.6%', up: true },
  { img: '/images/card-4.webp', name: 'Kira', subtitle: 'Market Oracle', rarityTier: 'uncommon', serial: 'AK-004', change: '+18.2%', up: true },
  { img: '/images/card-sora.webp', name: 'Sora', subtitle: 'Signal Weaver', rarityTier: 'epic', serial: 'AK-002', change: '+8.9%', up: true },
  { img: '/images/card-nova.webp', name: 'Nova', subtitle: 'Data Architect', rarityTier: 'rare', serial: 'AK-003', change: '-3.1%', up: false },
]

const FILTERS = ['All', 'Sales', 'Listings', 'Mints', 'Transfers']

const typeColor: Record<string, string> = {
  sale: '#34d399', listing: '#60a5fa', mint: '#c084fc', transfer: '#f59e0b',
}

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [txLoading, setTxLoading] = useState(true)
  const [txError, setTxError] = useState<string | null>(null)

  useScrollReveal()

  const fetchTransactions = () => {
    setTxLoading(true)
    setTxError(null)
    api.get<Transaction[]>('/api/activity?limit=20')
      .then(data => setTransactions(data))
      .catch(err => setTxError(err.message ?? 'Failed to load'))
      .finally(() => setTxLoading(false))
  }

  useEffect(() => { fetchTransactions() }, [])

  const txCount = transactions?.length ?? null
  const txSummary = transactions ? {
    sales: transactions.filter(t => t.type === 'sale').length,
    mints: transactions.filter(t => t.type === 'mint').length,
    transfers: transactions.filter(t => t.type === 'transfer').length,
    avgPrice: transactions.length > 0
      ? (transactions.reduce((sum, t) => sum + t.price_sol, 0) / transactions.length).toFixed(2)
      : null,
  } : null

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
                { label: '24h Volume', value: '42.8 SOL' }, // no route available
                { label: 'Transactions', value: txCount != null ? String(txCount) + (txCount === 20 ? '+' : '') : '—' },
                { label: 'Active Wallets', value: '312' }, // no route available
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
              {txLoading
                ? Array(6).fill(null).map((_, i) => (
                    <div key={i} className="feed-item" style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 12, alignItems: 'center', padding: 12 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ height: 14, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                        <div style={{ height: 10, width: '80%', borderRadius: 6, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <div style={{ height: 13, width: 60, borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                        <div style={{ height: 10, width: 40, borderRadius: 6, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                      </div>
                    </div>
                  ))
                : txError
                  ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 10 }}>
                      <div style={{ fontSize: 13, color: '#f87171', fontWeight: 700 }}>⚠ Failed to load</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{txError}</div>
                      <button className="btn secondary" style={{ marginTop: 8, fontSize: 12 }} onClick={fetchTransactions}>Try again</button>
                    </div>
                  : (transactions ?? []).length === 0
                    ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                        <div style={{ fontSize: 40, opacity: 0.3 }}>◈</div>
                        <div style={{ fontWeight: 800, fontSize: 18 }}>No activity yet</div>
                        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Transactions will appear here in real time.</div>
                      </div>
                    : transactions!.map((tx) => {
                        const ageMs = Date.now() - new Date(tx.created_at).getTime()
                        const ageMin = Math.floor(ageMs / 60000)
                        const ageDisplay = ageMin < 60 ? `${ageMin}m` : `${Math.floor(ageMin / 60)}h`
                        const action = `${tx.collection?.name ?? 'Collection'} ${tx.type}`
                        const detail = tx.type === 'mint'
                          ? `Minted by ${tx.buyer?.name ?? tx.buyer_agent_id.slice(0, 8)}`
                          : tx.type === 'sale' && tx.seller
                          ? `${tx.seller.name} → ${tx.buyer?.name ?? 'buyer'}`
                          : tx.type === 'transfer' && tx.seller
                          ? `${tx.seller.name} → ${tx.buyer?.name ?? 'recipient'}`
                          : tx.tx_signature.slice(0, 12) + '…'

                        return (
                          <div key={tx.id} className="feed-item" style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 12, alignItems: 'center', padding: 12 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, rgba(139,92,246,.28), rgba(96,165,250,.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,.4)' }}>
                              {(tx.collection?.name ?? '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <strong style={{ fontSize: 14, fontWeight: 800 }}>{action}</strong>
                                <span style={{
                                  padding: '2px 7px', borderRadius: 999,
                                  background: `${typeColor[tx.type] ?? '#fff'}18`,
                                  color: typeColor[tx.type] ?? '#fff',
                                  fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em',
                                }}>{tx.type}</span>
                              </div>
                              <p style={{ margin: 0, color: 'rgba(228,228,231,.46)', fontSize: 12 }}>{detail}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 800, fontSize: 13, color: '#c084fc', marginBottom: 4 }}>
                                {tx.price_sol > 0 ? `${tx.price_sol} SOL` : '—'}
                              </div>
                              <div style={{ fontSize: 10, color: 'rgba(228,228,231,.36)', textTransform: 'uppercase', letterSpacing: '.12em' }}>{ageDisplay} ago</div>
                            </div>
                          </div>
                        )
                      })
              }
            </div>
          </div>

          {/* Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top movers — static, no historical price data in API */}
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, margin: '0 0 16px', fontWeight: 800 }}>Top Movers (24h)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TOP_MOVERS.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <SkillCard
                      artImageUrl={m.img}
                      name={m.name}
                      subtitle={m.subtitle}
                      rarityTier={m.rarityTier}
                      serial={m.serial}
                      size="thumb"
                      skillTags={[]}
                    />
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
                  { label: 'Total Sales', value: txSummary ? String(txSummary.sales) : '—', note: 'last 20' },
                  { label: 'New Listings', value: '142', note: '24h' }, // no route available
                  { label: 'Mints', value: txSummary ? String(txSummary.mints) : '—', note: 'last 20' },
                  { label: 'Transfers', value: txSummary ? String(txSummary.transfers) : '—', note: 'last 20' },
                  { label: 'Unique Wallets', value: '312', note: 'active' }, // no route available
                  { label: 'Avg Price', value: txSummary?.avgPrice ? `${txSummary.avgPrice} SOL` : '—', note: 'last 20' },
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
