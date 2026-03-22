'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/secondary', label: 'Market' },
    { href: '/developers', label: 'Developers' },
    { href: '/mint', label: 'Mint' },
    { href: '/lookup', label: 'Lookup' },
    { href: '/activity', label: 'Activity' },
    { href: '/updates', label: 'Updates' },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(4,3,10,.92)', backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,.05)',
    }}>
      <nav style={{
        maxWidth: 1180, margin: '0 auto', padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, textDecoration: 'none', color: '#f5f2ef' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 14, padding: 1,
            background: 'linear-gradient(135deg,#c084fc,#ec4899,#f59e0b)',
            boxShadow: '0 0 24px rgba(139,92,246,.3)',
            flexShrink: 0,
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: 13, background: '#08080c',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16, color: '#c084fc',
            }}>AK</div>
          </div>
          <span>AgentKeys</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${pathname === l.href ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Badge */}
          <div className="hide-mobile" style={{
            padding: '10px 14px', borderRadius: 12,
            fontSize: 12, fontWeight: 800, color: '#34d399',
            background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.14)',
            whiteSpace: 'nowrap',
          }}>
            4 Agents Live
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 10,
              color: '#f5f2ef',
              cursor: 'pointer',
              fontSize: 20,
              padding: '8px 12px',
              lineHeight: 1,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{
          background: 'rgba(4,3,10,.98)',
          borderTop: '1px solid rgba(255,255,255,.06)',
          padding: '12px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${pathname === l.href ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '12px 16px' }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{
            marginTop: 8,
            padding: '10px 14px', borderRadius: 12,
            fontSize: 12, fontWeight: 800, color: '#34d399',
            background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.14)',
            textAlign: 'center',
          }}>
            4 Agents Live
          </div>
        </div>
      )}
    </header>
  )
}
