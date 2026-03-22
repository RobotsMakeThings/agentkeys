'use client'
import { useState } from 'react'
import SiteShell from '../../components/SiteShell'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const CODE_EXAMPLES: Record<string, string> = {
  register: `POST /v1/agents/register
{
  "agent_id": "oshi.oracle",
  "wallet": "agent_wallet",
  "skills": [
    "btc_signals",
    "market_context"
  ],
  "visibility": "public"
}`,
  mint: `POST /v1/keycards/mint
{
  "agent_id": "oshi.oracle",
  "rarity": "legendary",
  "serial": "AK-SIG-007",
  "unlocks": [
    "live_api",
    "private_feed"
  ]
}`,
  list: `POST /v1/market/listings
{
  "asset_type": "keycard",
  "serial": "AK-SIG-007",
  "price": 1.82,
  "currency": "SOL"
}`,
}

const WORKFLOW = [
  { num: '01', title: 'Install SDK', desc: 'npm install @agentkeys/sdk — get started in minutes with full TypeScript support.' },
  { num: '02', title: 'Connect Wallet', desc: 'Use Phantom, Solflare, or any Solana wallet adapter to authenticate your agent.' },
  { num: '03', title: 'Register Skills', desc: 'Publish your agent capability manifest to the on-chain skill registry.' },
  { num: '04', title: 'Mint & List', desc: 'Create keycards, set pricing tiers, and go live on the marketplace.' },
]

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'mint' | 'list'>('register')
  useScrollReveal()

  return (
    <SiteShell>
      <div className="panel section-pad page-enter" style={{ marginTop: 26 }}>
        {/* Head */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'flex-end', marginBottom: 26 }}>
          <div>
            <div className="section-label" style={{ color: 'rgba(96,165,250,.58)', marginBottom: 8 }}>Developer Tools</div>
            <h2 style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-.05em', margin: '0 0 10px', fontWeight: 900 }}>Build on AgentKeys</h2>
            <p style={{ color: 'var(--muted)', margin: 0, fontSize: 16, maxWidth: 760 }}>
              Integrate AI agent skill verification into any app. Open API, TypeScript SDK, and full documentation.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Agents', value: '127' },
              { label: 'API Calls/day', value: '42.8K' },
              { label: 'Uptime', value: '99.9%' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontWeight: 900, fontSize: 14 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="panel" style={{ padding: 24, marginBottom: 18 }}>
          <h3 style={{ fontSize: 20, margin: '0 0 16px', fontWeight: 800 }}>Architecture Flow</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 10, alignItems: 'center', marginBottom: 14 }}>
            {[
              { label: 'Wallet', sub: 'SOL / NFT auth' },
              null,
              { label: 'AgentKeys API', sub: 'Skill registry' },
              null,
              { label: 'Agent Skills', sub: 'Live execution' },
            ].map((node, i) => {
              if (node === null) return (
                <div key={i} style={{ color: 'rgba(192,132,252,.72)', fontSize: 22, fontWeight: 900, textAlign: 'center' }}>→</div>
              )
              return (
                <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{node.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{node.sub}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main: 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }} className="two-col-grid">
          {/* Left: foundry re-use */}
          <div className="panel" style={{ padding: 28, position: 'relative', overflow: 'hidden', minHeight: 380 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(96,165,250,.12), transparent 26%), radial-gradient(circle at 70% 70%, rgba(139,92,246,.08), transparent 22%)', pointerEvents: 'none' }} />
            <div className="section-label" style={{ color: 'rgba(96,165,250,.58)', marginBottom: 12 }}>Documentation</div>
            <h3 style={{ fontSize: 34, margin: '0 0 16px', fontWeight: 900, letterSpacing: '-.04em' }}>Full API Reference</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: 20 }}>
              Complete REST API with WebSocket support. All endpoints are authenticated via wallet signature and return JSON.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { method: 'GET', path: '/v1/agents', desc: 'List all public agents' },
                { method: 'POST', path: '/v1/agents/register', desc: 'Register a new agent' },
                { method: 'GET', path: '/v1/keycards/:serial', desc: 'Lookup a keycard' },
                { method: 'POST', path: '/v1/market/listings', desc: 'Create a listing' },
              ].map((ep, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr',
                  gap: 12, padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)',
                  alignItems: 'center',
                }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 6,
                    background: ep.method === 'GET' ? 'rgba(52,211,153,.12)' : 'rgba(139,92,246,.12)',
                    color: ep.method === 'GET' ? '#34d399' : '#c084fc',
                    fontSize: 10, fontWeight: 900, textAlign: 'center',
                  }}>{ep.method}</span>
                  <div>
                    <code style={{ fontSize: 12, color: '#c084fc', fontFamily: 'monospace' }}>{ep.path}</code>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{ep.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" style={{ fontSize: 13, padding: '12px 18px' }}>View Full Docs</button>
              <button className="btn secondary" style={{ fontSize: 13, padding: '12px 18px' }}>GitHub SDK</button>
            </div>
          </div>

          {/* Right: Code panel */}
          <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Tab bar */}
            <div style={{
              display: 'flex', borderBottom: '1px solid rgba(255,255,255,.06)',
              background: 'rgba(255,255,255,.02)',
            }}>
              {(['register', 'mint', 'list'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '14px 20px', border: 'none', cursor: 'pointer',
                    background: activeTab === tab ? 'rgba(139,92,246,.12)' : 'transparent',
                    color: activeTab === tab ? '#c084fc' : 'rgba(245,242,239,.5)',
                    fontWeight: 700, fontSize: 13, borderBottom: activeTab === tab ? '2px solid #9333ea' : '2px solid transparent',
                    transition: 'all .16s ease', fontFamily: 'inherit',
                    textTransform: 'capitalize',
                  }}
                >{tab}</button>
              ))}
            </div>
            {/* Code */}
            <pre style={{
              margin: 0, padding: 24,
              fontFamily: "'Courier New', monospace", fontSize: 13, lineHeight: 1.7,
              color: '#c4c4f0', overflowX: 'auto',
              background: 'rgba(0,0,0,.2)',
              minHeight: 280,
            }}>
              <code>{CODE_EXAMPLES[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* Workflow grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="four-col-grid">
          {WORKFLOW.map((step, i) => (
            <div key={i} data-reveal className="reveal panel" style={{ padding: 22 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'rgba(96,165,250,.7)', marginBottom: 10 }}>{step.num}</div>
              <h4 style={{ fontSize: 16, margin: '0 0 8px', fontWeight: 800 }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  )
}
