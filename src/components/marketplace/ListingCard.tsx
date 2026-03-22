'use client'
import { useRef, useEffect } from 'react'

interface ListingCardProps {
  img: string
  name: string
  sub: string
  price: string
  serial: string
  tags: string[]
  rarity?: string
}

export default function ListingCard({ img, name, sub, price, serial, tags, rarity = 'Common' }: ListingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) - 0.5
      const y = ((e.clientY - r.top) / r.height) - 0.5
      card.style.transform = `perspective(1200px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`
    }
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const rarityColor: Record<string, string> = {
    Legendary: '#f59e0b',
    Epic: '#c084fc',
    Rare: '#60a5fa',
    Common: 'rgba(245,242,239,.5)',
  }

  return (
    <div ref={cardRef} className="listing-card panel" style={{ padding: 18, cursor: 'pointer' }}>
      <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
        <img src={img} alt={name} style={{ width: '100%', display: 'block', transition: 'transform .22s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.02em', marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 16, color: rarityColor[rarity] || '#c084fc', whiteSpace: 'nowrap' }}>{price}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {tags.map((tag, i) => (
          <span key={i} style={{
            padding: '4px 8px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,.08)',
            background: 'rgba(255,255,255,.03)',
            fontSize: 10, fontWeight: 700, color: 'rgba(245,242,239,.7)',
          }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'rgba(245,242,239,.38)', fontWeight: 700, letterSpacing: '.06em' }}>{serial}</span>
        <button className="btn sm" style={{ fontSize: 12, padding: '8px 14px' }}>Buy Now</button>
      </div>
    </div>
  )
}
