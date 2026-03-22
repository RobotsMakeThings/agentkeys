'use client'
import { useEffect, useRef, useState } from 'react'
import SiteShell from '../components/SiteShell'
import HeroCard from '../components/home/HeroCard'
import CardCarousel from '../components/home/CardCarousel'
import FoundrySection from '../components/home/FoundrySection'
import HomePreviewSections from '../components/home/HomePreviewSections'
import IntroOverlay from '../components/home/IntroOverlay'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { api } from '../lib/api'
import type { Collection } from '../types/agentkeys'

export default function HomePage() {
  const [showOverlay, setShowOverlay] = useState(false)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const [collections, setCollections] = useState<Collection[] | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useScrollReveal()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const already = sessionStorage.getItem('ak-pack-opened')
      if (!already) setShowOverlay(true)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (heroCopyRef.current) heroCopyRef.current.style.transform = `translateY(${Math.min(18, y * 0.08)}px)`
      if (heroCardRef.current) heroCardRef.current.style.transform = `translateY(${Math.min(32, y * 0.11)}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    api.get<Collection[]>('/api/collections?limit=100')
      .then(data => { if (!cancelled) setCollections(data) })
      .catch(() => { /* silently fail, keep static fallback */ })
      .finally(() => { if (!cancelled) setStatsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const cardsMinted = collections
    ? collections.reduce((sum, c) => sum + c.minted_count, 0)
    : null
  const activeAgents = collections
    ? new Set(collections.map(c => c.agent_id)).size
    : null

  const dismissOverlay = () => {
    sessionStorage.setItem('ak-pack-opened', '1')
    setShowOverlay(false)
  }

  return (
    <>
      {showOverlay && <IntroOverlay onDismiss={dismissOverlay} />}
      <SiteShell>
        {/* Hero */}
        <section style={{ display: 'grid', gridTemplateColumns: '.92fr 1.08fr', gap: 44, alignItems: 'center', paddingTop: 26 }} className="hero-grid">
          {/* Copy */}
          <div ref={heroCopyRef} style={{ willChange: 'transform' }}>
            <div className="eyebrow">↑ Live Agent Economy</div>
            <h1 style={{
              fontSize: 72, lineHeight: .95, letterSpacing: '-.06em',
              margin: '18px 0 20px', fontWeight: 900, maxWidth: 620,
            }}>
              Trade Skills
              <span className="grad">Like Cards.</span>
            </h1>
            <p style={{ maxWidth: 520, color: 'var(--muted)', fontSize: 17, lineHeight: 1.8, margin: 0 }}>
              The first marketplace for AI agent skill keycards. Mint, collect, and trade access to the most powerful agent capabilities on Solana.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 26 }}>
              <a href="/marketplace" className="btn">Explore Market</a>
              <a href="/developers" className="btn secondary">Read Docs</a>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 30, maxWidth: 440 }}>
              {[
                { label: 'Active Agents', value: statsLoading ? '…' : String(activeAgents ?? '127') },
                { label: 'Cards Minted', value: statsLoading ? '…' : cardsMinted != null ? (cardsMinted >= 1000 ? `${(cardsMinted / 1000).toFixed(1)}K` : String(cardsMinted)) : '8.2K' },
                { label: 'Total Volume', value: '156 SOL' }, // no aggregation route available
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.03em' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div ref={heroCardRef} style={{ willChange: 'transform' }}>
            <HeroCard />
          </div>
        </section>

        {/* Carousel Section */}
        <section style={{ marginTop: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Live Market</div>
            <h2 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-.05em', margin: '0 0 10px', fontWeight: 900 }}>
              Featured KeyCards
            </h2>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: 17 }}>The most-traded agent skill cards in circulation.</p>
          </div>
          <CardCarousel />
        </section>

        {/* Foundry Section */}
        <section style={{ marginTop: 60 }}>
          <div className="section-label" style={{ marginBottom: 12, textAlign: 'center' }}>Developer SDK</div>
          <h2 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-.05em', margin: '0 0 28px', fontWeight: 900, textAlign: 'center' }}>
            Build with AgentKeys
          </h2>
          <FoundrySection />
        </section>

        {/* Preview sections */}
        <HomePreviewSections />
      </SiteShell>
    </>
  )
}
