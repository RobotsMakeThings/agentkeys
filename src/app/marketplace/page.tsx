'use client'
import { useState, useEffect } from 'react'
import SiteShell from '../../components/SiteShell'
import CollectionCard from '../../components/marketplace/CollectionCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { api } from '../../lib/api'
import type { Collection, Transaction } from '../../types/agentkeys'
import AgentKeysBadge from '../../components/ui/AgentKeysBadge'
import { computeBadgeStateFull } from '@/lib/verification'

const FILTERS = ['All', 'Signal', 'Climate', 'Analytics', 'Genesis']

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [collections, setCollections] = useState<Collection[] | null>(null)
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [collectionsError, setCollectionsError] = useState<string | null>(null)
  const [activity, setActivity] = useState<Transaction[] | null>(null)
  const [activityLoading, setActivityLoading] = useState(true)

  useScrollReveal()

  const fetchCollections = () => {
    setCollectionsLoading(true)
    setCollectionsError(null)
    // Include new card design fields via expanded select
    api.get<Collection[]>('/api/collections?sort=recent&limit=20&include=art_image_url,card_subtitle,card_tagline,serial_number,tier_unlocks,skill_set')
      .then(data => setCollections(data))
      .catch(err => setCollectionsError(err.message ?? 'Failed to load'))
      .finally(() => setCollectionsLoading(false))
  }

  useEffect(() => { fetchCollections() }, [])

  useEffect(() => {
    let cancelled = false
    api.get<Transaction[]>('/api/activity?limit=5')
      .then(data => { if (!cancelled) setActivity(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setActivityLoading(false) })
    return () => { cancelled = true }
  }, [])

  const floorPrice = collections?.length
    ? Math.min(...collections.map(c => c.price_sol))
    : null
  const totalCards = collections?.reduce((sum, c) => sum + c.minted_count, 0) ?? null

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
              { label: 'Floor', value: floorPrice != null ? `${floorPrice} SOL` : '—' },
              { label: '24h Volume', value: '42.8 SOL' }, // no route available
              { label: 'Cards', value: totalCards != null ? totalCards.toLocaleString() : '—' },
              { label: 'Holders', value: '2,847' }, // no route available
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
          <div className="panel" style={{ padding: 24 }}>
            {collectionsLoading
              ? <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <div style={{ width: 200, flexShrink: 0, aspectRatio: '3/4', borderRadius: 18, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ height: 12, width: '40%', borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                    <div style={{ height: 36, width: '70%', borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                    <div style={{ height: 12, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
              : (() => {
                  const c = collections?.[0]
                  if (!c) return <div style={{ color: 'var(--muted)', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>No featured collections</div>
                  return (
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                      <div style={{ width: 200, flexShrink: 0, aspectRatio: '3/4', borderRadius: 18, background: 'linear-gradient(135deg, rgba(139,92,246,.28), rgba(96,165,250,.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, color: 'rgba(255,255,255,.4)', boxShadow: '0 0 50px rgba(139,92,246,.2)' }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ textTransform: 'uppercase', letterSpacing: '.2em', fontSize: 11, fontWeight: 800, color: '#f59e0b', marginBottom: 8 }}>✦ Featured</div>
                        <h3 style={{ fontSize: 36, margin: '0 0 6px', fontWeight: 900, letterSpacing: '-.04em' }}>{c.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, margin: '0 0 14px' }}>
                          <span>{c.skill?.name ?? 'Skill'} · {c.agent?.name ?? 'Agent'}</span>
                          {c.agent && (
                            <AgentKeysBadge
                              state={computeBadgeStateFull(
                                (c.agent as any).verification_status ?? 'unverified',
                                (c.agent as any).is_active_creator ?? false,
                                (c.agent as any).manual_review_approved_at ?? null,
                                (c.agent as any).last_skill_update_at ?? null
                              )}
                              size="sm"
                              showTooltip={true}
                            />
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                          {[c.skill?.name, c.agent?.name, `v${c.skill?.current_version ?? 1}`].filter(Boolean).map(t => (
                            <span key={t} style={{ padding: '4px 8px', borderRadius: 999, border: '1px solid rgba(245,158,11,.2)', background: 'rgba(245,158,11,.06)', fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#c084fc', marginBottom: 12 }}>{c.price_sol} SOL</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="btn" style={{ padding: '12px 20px', fontSize: 14 }}>Buy Now</button>
                          <button className="btn secondary" style={{ padding: '12px 20px', fontSize: 14 }}>Details</button>
                        </div>
                      </div>
                    </div>
                  )
                })()
            }
          </div>

          {/* Live tape */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="signal-dot" />
              <div style={{ fontWeight: 800, fontSize: 14 }}>Live Sales</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activityLoading
                ? Array(5).fill(null).map((_, i) => (
                    <div key={i} style={{ height: 44, borderRadius: 12, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                  ))
                : (activity ?? []).length === 0
                  ? <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No recent activity</div>
                  : activity!.map((tx) => {
                      const dotColor = tx.type === 'mint' ? 'emerald' : tx.type === 'sale' ? 'violet' : 'blue'
                      return (
                        <div key={tx.id} style={{
                          display: 'grid', gridTemplateColumns: '8px 1fr auto auto', gap: 10,
                          alignItems: 'center', padding: '10px 12px', borderRadius: 12,
                          background: 'rgba(255,255,255,.024)', border: '1px solid rgba(255,255,255,.06)',
                        }}>
                          <div className={`dot ${dotColor}`} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>
                              {tx.collection?.name ?? 'Unknown'} {tx.type}
                            </div>
                            <div style={{ fontSize: 10, color: 'rgba(245,242,239,.4)' }}>
                              {tx.tx_signature.slice(0, 8)}…
                            </div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#c084fc' }}>
                            {tx.price_sol > 0 ? `${tx.price_sol} SOL` : '—'}
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(245,242,239,.36)', textAlign: 'right' }}>
                            {Math.floor((Date.now() - new Date(tx.created_at).getTime()) / 60000)}m
                          </div>
                        </div>
                      )
                    })
              }
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
          {collectionsLoading
            ? Array(4).fill(null).map((_, i) => (
                <div key={i} className="panel" style={{ padding: 18 }}>
                  <div style={{ aspectRatio: '3/4', borderRadius: 18, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite', marginBottom: 14 }} />
                  <div style={{ height: 16, borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite', marginBottom: 8 }} />
                  <div style={{ height: 12, width: '70%', borderRadius: 6, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                </div>
              ))
            : collectionsError
              ? <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 10 }}>
                    <div style={{ fontSize: 13, color: '#f87171', fontWeight: 700 }}>⚠ Failed to load</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{collectionsError}</div>
                    <button className="btn secondary" style={{ marginTop: 8, fontSize: 12 }} onClick={fetchCollections}>Try again</button>
                  </div>
                </div>
              : (collections ?? []).length === 0
                ? <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                    <div style={{ fontSize: 40, opacity: 0.3 }}>◈</div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>No listings yet</div>
                    <div style={{ color: 'var(--muted)', fontSize: 14 }}>Collections will appear here once minted.</div>
                  </div>
                : collections!.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'center' }}>
                      <CollectionCard
                        collection={c}
                        onClick={() => console.log('View collection:', c.id)}
                      />
                    </div>
                  ))
          }
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
