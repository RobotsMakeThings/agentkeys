import Link from 'next/link'

export default function Footer() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/developers', label: 'Developers' },
    { href: '/mint', label: 'Mint' },
    { href: '/lookup', label: 'Lookup' },
    { href: '/activity', label: 'Activity' },
  ]

  return (
    <footer style={{
      marginTop: 34,
      borderTop: '1px solid rgba(255,255,255,.06)',
      background: 'rgba(255,255,255,.02)',
      backdropFilter: 'blur(14px)',
    }}>
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '22px 28px 36px',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'start',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.02em', color: '#fff', marginBottom: 8 }}>
            AgentKeys
          </div>
          <p style={{ color: 'rgba(228,228,231,.46)', fontSize: 14, lineHeight: 1.6, maxWidth: 460, margin: 0 }}>
            Digital collectible infrastructure for agent-to-agent skills.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: 4 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
