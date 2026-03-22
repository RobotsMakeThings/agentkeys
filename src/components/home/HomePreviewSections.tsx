export default function HomePreviewSections() {
  const stats = [
    { label: 'Floor', value: '1.82 SOL', delta: '+12.4%', up: true },
    { label: '24h Volume', value: '42.8 SOL', delta: '+8.7%', up: true },
    { label: 'Cards', value: '8,200', delta: '+142', up: true },
    { label: 'Holders', value: '2,847', delta: '+38', up: true },
  ]

  const features = [
    { img: '/images/card-oshi.webp', name: 'Oshi', sub: 'Legendary · Oracle of Signal', price: '1.82 SOL' },
    { img: '/images/card-sora.webp', name: 'Sora', sub: 'Epic · Signal Weaver', price: '0.94 SOL' },
    { img: '/images/card-nova.webp', name: 'Nova', sub: 'Rare · Data Architect', price: '0.48 SOL' },
  ]

  return (
    <div style={{ display: 'grid', gap: 22, marginTop: 22 }}>
      <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1.04fr .96fr', gap: 22 }}>
        {/* Marketplace Preview */}
        <div className="panel section-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>Marketplace</div>
              <h3 style={{ fontSize: 32, margin: 0, fontWeight: 900, letterSpacing: '-.04em' }}>KeyCard Market</h3>
            </div>
            <a href="/marketplace" className="btn sm secondary">View All →</a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.02em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.up ? '#34d399' : '#f87171', fontWeight: 700, marginTop: 2 }}>{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {features.map((card, i) => (
              <a key={i} href="/marketplace" style={{ textDecoration: 'none' }}>
                <div className="listing-card panel" style={{ padding: 12, cursor: 'pointer' }}>
                  <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 10 }}>
                    <img src={card.img} alt={card.name} style={{ width: '100%', display: 'block', transition: 'transform .22s ease' }} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{card.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{card.sub}</div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: '#c084fc' }}>{card.price}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Mint Preview */}
        <div className="panel section-pad">
          <div style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Mint</div>
            <h3 style={{ fontSize: 32, margin: '0 0 8px', fontWeight: 900, letterSpacing: '-.04em' }}>Open Your First Pack.</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>Every pack contains 5 agent skill keycards. Chance at Legendary.</p>
          </div>

          {/* Pack visual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div className="stat-card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ width: 80, margin: '0 auto 12px' }}>
                <img src="/images/pack-standard.webp" alt="Standard Pack" style={{ width: '100%', display: 'block', borderRadius: 12, animation: 'packFloat 8.8s ease-in-out infinite' }} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>Standard Pack</div>
              <div style={{ color: '#c084fc', fontWeight: 900, fontSize: 16, marginTop: 4 }}>2.4 SOL</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>5 cards · ~4% Legendary</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ width: 80, margin: '0 auto 12px' }}>
                <img src="/images/box-vault.webp" alt="Vault Box" style={{ width: '100%', display: 'block', borderRadius: 12, animation: 'boxFloat 9.6s ease-in-out infinite' }} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>Vault Box</div>
              <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: 16, marginTop: 4 }}>9.6 SOL</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>25 cards · ~18% Legendary</div>
            </div>
          </div>

          <a href="/mint" className="btn" style={{ width: '100%', justifyContent: 'center', borderRadius: 16 }}>Mint Now →</a>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
            {[
              { label: 'Packs Left', value: '2,847' },
              { label: 'Floor', value: '1.82 SOL' },
              { label: 'Genesis %', value: '4.2%' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '10px 8px' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontWeight: 900, fontSize: 14, marginTop: 3 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
