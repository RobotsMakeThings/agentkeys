'use client'
import { useRef, useEffect, useState } from 'react'
import SiteShell from '../../components/SiteShell'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { api } from '../../lib/api'
import type { Collection } from '../../types/agentkeys'
import AgentKeysBadge from '../../components/ui/AgentKeysBadge'
import { computeBadgeStateFull } from '@/lib/verification'
import SkillCard from '@/components/ui/SkillCard'

interface LookupAgent {
  id: string
  name: string
  bio: string | null
  avatar_url: string | null
  wallet_address: string
  verification_status?: string
  is_active_creator?: boolean
  manual_review_approved_at?: string | null
  last_skill_update_at?: string | null
}

interface LookupResults {
  agents?: LookupAgent[]
  skills?: Array<{ id: string; name: string; slug: string; current_version: number; agent: { name: string } }>
  collections?: Collection[]
}

type SelectedAgent = LookupAgent

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
  const [searchResults, setSearchResults] = useState<LookupResults | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [trendingCollections, setTrendingCollections] = useState<Collection[] | null>(null)
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<SelectedAgent | null>(null)

  useScrollReveal()

  useEffect(() => {
    let cancelled = false
    api.get<Collection[]>('/api/collections?sort=popular&limit=4')
      .then(data => { if (!cancelled) setTrendingCollections(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTrendingLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (trendingCollections?.[0] && !selectedCollection) {
      setSelectedCollection(trendingCollections[0])
    }
  }, [trendingCollections])

  useEffect(() => {
    if (searchResults?.collections?.[0]) {
      setSelectedCollection(searchResults.collections[0])
      setSelectedAgent(null)
    } else if (searchResults?.agents?.[0]) {
      setSelectedAgent(searchResults.agents[0])
      setSelectedCollection(null)
    }
  }, [searchResults])

  const handleSearch = () => {
    if (!query.trim()) return
    setSearching(true)
    setSearchError(null)
    setSearchResults(null)

    const typeParam = activeTab === 'serial'
      ? 'collection'
      : activeTab === 'agent' || activeTab === 'wallet'
      ? 'agent'
      : undefined

    const path = `/api/lookup?q=${encodeURIComponent(query.trim())}${typeParam ? `&type=${typeParam}` : ''}`

    api.get<LookupResults>(path)
      .then(data => setSearchResults(data))
      .catch(err => setSearchError(err.message ?? 'Search failed'))
      .finally(() => setSearching(false))
  }

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
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={activeTab === 'serial' ? 'Search collection name…' : 'Search by agent name…'}
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,.08)',
                  background: 'rgba(255,255,255,.04)',
                  color: '#f5f2ef', fontSize: 15, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button className="btn" onClick={handleSearch}>
                {searching ? 'Searching…' : 'Search'}
              </button>
            </div>
            {activeTab === 'wallet' && (
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                Wallet address search is not yet available. Showing agent name results.
              </p>
            )}
          </div>

          {/* Search results message */}
          {searchResults && !searching && (
            <div style={{ marginTop: 16 }}>
              {searchError
                ? <div style={{ color: '#f87171', fontSize: 13 }}>⚠ {searchError}</div>
                : ((searchResults.collections?.length ?? 0) === 0 && (searchResults.agents?.length ?? 0) === 0 && (searchResults.skills?.length ?? 0) === 0)
                  ? <div style={{ color: 'var(--muted)', fontSize: 13 }}>No results for &quot;{query}&quot;</div>
                  : null
              }
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, marginBottom: 22 }} className="two-col-grid">
          {/* Detail panel — replaced HoloCard entirely with data-driven panel */}
          <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {trendingLoading && !selectedCollection
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
                  <div style={{ width: 200, aspectRatio: '3/4', borderRadius: 18, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite', marginBottom: 20 }} />
                  <div style={{ height: 32, width: '60%', borderRadius: 8, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 14, width: '40%', borderRadius: 6, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                </div>
              : selectedAgent
                ? <>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,92,246,.4), rgba(96,165,250,.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, color: 'rgba(255,255,255,.6)', margin: '0 auto 20px' }}>
                      {selectedAgent.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 32, margin: 0, fontWeight: 900 }}>{selectedAgent.name}</h3>
                      <AgentKeysBadge
                        state={computeBadgeStateFull(
                          (selectedAgent.verification_status as any) ?? 'unverified',
                          selectedAgent.is_active_creator ?? false,
                          selectedAgent.manual_review_approved_at ?? null,
                          selectedAgent.last_skill_update_at ?? null
                        )}
                        size="md"
                        showTooltip={true}
                      />
                    </div>
                    <p style={{ color: 'var(--muted)', margin: '0 0 14px', fontSize: 14 }}>{selectedAgent.bio ?? 'No bio available'}</p>
                    <div style={{ padding: '8px 14px', background: 'rgba(139,92,246,.1)', borderRadius: 10, display: 'inline-block', fontFamily: 'monospace', fontSize: 11, color: '#c084fc', marginBottom: 16, wordBreak: 'break-all' }}>
                      {selectedAgent.wallet_address}
                    </div>
                  </>
                : selectedCollection
                  ? <>
                      <div style={{ width: 200, aspectRatio: '3/4', borderRadius: 18, background: 'linear-gradient(135deg, rgba(139,92,246,.28), rgba(96,165,250,.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, color: 'rgba(255,255,255,.4)', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(139,92,246,.18)' }}>
                        {selectedCollection.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 style={{ fontSize: 32, margin: '0 0 4px', fontWeight: 900 }}>{selectedCollection.name}</h3>
                      <p style={{ color: 'var(--muted)', margin: '0 0 14px', fontSize: 14 }}>
                        {selectedCollection.skill?.name ?? 'Skill'} · {selectedCollection.agent?.name ?? 'Agent'}
                      </p>
                      <div style={{ padding: '8px 14px', background: 'rgba(139,92,246,.1)', borderRadius: 10, display: 'inline-block', fontFamily: 'monospace', fontSize: 13, color: '#c084fc', marginBottom: 16 }}>
                        {selectedCollection.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16, width: '100%' }}>
                        {[
                          { label: 'Supply', value: `${selectedCollection.minted_count}/${selectedCollection.max_supply}` },
                          { label: 'Price', value: `${selectedCollection.price_sol} SOL` },
                          { label: 'Status', value: selectedCollection.is_active ? 'Active' : 'Inactive' },
                        ].map((s, i) => (
                          <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontWeight: 800, fontSize: 12 }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <a href="/marketplace" className="btn" style={{ fontSize: 13, padding: '12px 18px' }}>View Market</a>
                        <a href="/mint" className="btn secondary" style={{ fontSize: 13, padding: '12px 18px' }}>Mint More</a>
                      </div>
                    </>
                  : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--muted)' }}>
                      <div style={{ fontSize: 40, opacity: 0.3 }}>◈</div>
                      <div style={{ fontSize: 14 }}>Search above to explore</div>
                    </div>
            }
          </div>

          {/* Holo card preview */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
            <SkillCard
              artImageUrl="/images/card-oshi.webp"
              name="Oshi"
              subtitle="Oracle of Signal"
              rarityTier="legendary"
              serial="AK-001"
              size="md"
              interactive={true}
              skillTags={[]}
            />
          </div>
        </div>

        {/* Trending */}
        <div className="panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 22, margin: '0 0 18px', fontWeight: 800 }}>Trending Lookups</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="four-col-grid">
            {trendingLoading
              ? Array(4).fill(null).map((_, i) => (
                  <div key={i} className="stat-card" style={{ padding: 12 }}>
                    <div style={{ width: 60, height: 80, borderRadius: 10, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite', margin: '0 auto 10px' }} />
                    <div style={{ height: 14, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,.06)', animation: 'shimmer 1.5s ease-in-out infinite', margin: '0 auto 6px' }} />
                    <div style={{ height: 10, width: '40%', borderRadius: 6, background: 'rgba(255,255,255,.04)', animation: 'shimmer 1.5s ease-in-out infinite', margin: '0 auto' }} />
                  </div>
                ))
              : (trendingCollections ?? []).length === 0
                ? <div style={{ gridColumn: '1/-1', color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No collections available</div>
                : trendingCollections!.map((c) => (
                    <div
                      key={c.id}
                      className="stat-card"
                      style={{ cursor: 'pointer', transition: 'all .16s ease' }}
                      onClick={() => { setSelectedCollection(c); setSelectedAgent(null) }}
                    >
                      <div style={{ width: 60, height: 80, borderRadius: 10, background: 'linear-gradient(135deg, rgba(139,92,246,.28), rgba(96,165,250,.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: 'rgba(255,255,255,.4)', margin: '0 auto 10px' }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2, textAlign: 'center' }}>{c.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#c084fc', textAlign: 'center', marginBottom: 4 }}>
                        {c.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{c.price_sol} SOL</div>
                    </div>
                  ))
            }
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
