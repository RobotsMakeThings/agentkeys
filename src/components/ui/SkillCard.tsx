'use client'

import { useEffect, useRef } from 'react'
import { RarityTier, SkillCardSize, SkillCardProps, TIER_DISPLAY_NAMES } from '@/types/agentkeys'

// ---- Size Dimensions (2:3 aspect ratio, matching the card .webp files) ----
const SIZE_DIMS: Record<SkillCardSize, { w: number; h: number }> = {
  thumb: { w: 120, h: 180 },
  sm:    { w: 200, h: 300 },
  md:    { w: 300, h: 450 },
  lg:    { w: 400, h: 600 },
  full:  { w: 512, h: 768 },
}

// ---- Tier glow colors ----
const TIER_GLOW: Record<RarityTier, string> = {
  basic:     'rgba(156,163,175,.35)',
  uncommon:  'rgba(52,211,153,.4)',
  rare:      'rgba(96,165,250,.45)',
  epic:      'rgba(192,132,252,.5)',
  legendary: 'rgba(245,158,11,.55)',
  mythic:    'rgba(192,132,252,.6)',
}

const TIER_BORDER: Record<RarityTier, string> = {
  basic:     'rgba(156,163,175,.3)',
  uncommon:  'rgba(52,211,153,.4)',
  rare:      'rgba(96,165,250,.45)',
  epic:      'rgba(192,132,252,.5)',
  legendary: 'rgba(245,158,11,.6)',
  mythic:    'rgba(192,132,252,.65)',
}

// ---- Main Component ----
// The card image IS the complete card design — all text/frames baked in.
// This component simply displays the image at the correct size with a tier-appropriate glow.

export default function SkillCard({
  artImageUrl,
  name,
  rarityTier,
  size = 'sm',
  interactive = false,
  onClick,
  className,
}: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const dims = SIZE_DIMS[size]
  const showEffects = interactive && ['epic', 'legendary', 'mythic'].includes(rarityTier)

  // Tilt handler for epic+ interactive cards
  useEffect(() => {
    if (!showEffects || !cardRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const card = cardRef.current
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) - 0.5
      const y = ((e.clientY - r.top) / r.height) - 0.5
      card.style.transform = `perspective(1200px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale(1.03)`
    }
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [showEffects])

  return (
    <div
      ref={cardRef}
      className={['skill-card', `skill-card--${rarityTier}`, `skill-card--${size}`, className ?? ''].join(' ')}
      style={{
        width: dims.w,
        height: dims.h,
        flexShrink: 0,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease',
        boxShadow: `0 0 28px ${TIER_GLOW[rarityTier]}, 0 4px 24px rgba(0,0,0,.6)`,
        border: `1.5px solid ${TIER_BORDER[rarityTier]}`,
        display: 'block',
        position: 'relative',
        animation: rarityTier === 'legendary' ? 'legendaryGlow 4s ease-in-out infinite'
          : rarityTier === 'mythic' ? 'mythicGlow 3s ease-in-out infinite'
          : undefined,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {artImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artImageUrl}
          alt={name}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      ) : (
        // Placeholder when no image provided
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${TIER_BORDER[rarityTier]}44, #08060e)`,
          fontSize: dims.w * 0.25,
          fontWeight: 900,
          color: TIER_BORDER[rarityTier],
          fontFamily: '"Satoshi", ui-sans-serif, sans-serif',
          letterSpacing: '0.05em',
        }}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  )
}

// Re-export for consumers
export type { SkillCardProps, SkillCardSize }
export { TIER_DISPLAY_NAMES, SIZE_DIMS }
