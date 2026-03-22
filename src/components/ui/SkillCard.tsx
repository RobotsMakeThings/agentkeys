'use client'

import { useEffect, useRef } from 'react'
import { RarityTier, SkillCardSize, SkillCardProps, TIER_DISPLAY_NAMES } from '@/types/agentkeys'
import AgentKeysBadge from '@/components/ui/AgentKeysBadge'

// ---- Size Dimensions ----

const SIZE_DIMS: Record<SkillCardSize, { w: number; h: number }> = {
  thumb: { w: 120, h: 180 },
  sm:    { w: 200, h: 300 },
  md:    { w: 300, h: 450 },
  lg:    { w: 400, h: 600 },
  full:  { w: 512, h: 768 },
}

// ---- Tier Style Config ----

interface TierStyleConfig {
  accentColor: string
  tiltEnabled: boolean
  holoEnabled: boolean
  particlesEnabled: boolean
  cornerStyle: 'none' | 'simple' | 'ornate' | 'animated' | 'cosmic'
}

const TIER_STYLES: Record<RarityTier, TierStyleConfig> = {
  basic: {
    accentColor: '#9ca3af',
    tiltEnabled: false,
    holoEnabled: false,
    particlesEnabled: false,
    cornerStyle: 'none',
  },
  uncommon: {
    accentColor: '#34d399',
    tiltEnabled: false,
    holoEnabled: false,
    particlesEnabled: false,
    cornerStyle: 'simple',
  },
  rare: {
    accentColor: '#60a5fa',
    tiltEnabled: false,
    holoEnabled: false,
    particlesEnabled: false,
    cornerStyle: 'simple',
  },
  epic: {
    accentColor: '#c084fc',
    tiltEnabled: true,
    holoEnabled: true,
    particlesEnabled: false,
    cornerStyle: 'ornate',
  },
  legendary: {
    accentColor: '#f59e0b',
    tiltEnabled: true,
    holoEnabled: true,
    particlesEnabled: true,
    cornerStyle: 'animated',
  },
  mythic: {
    accentColor: '#c084fc',
    tiltEnabled: true,
    holoEnabled: true,
    particlesEnabled: true,
    cornerStyle: 'cosmic',
  },
}

// ---- SVG Corner Ornament (legendary / mythic) ----

function CornerOrnaments({ tier }: { tier: RarityTier }) {
  const color = tier === 'mythic' ? '#c084fc' : '#f59e0b'
  const dimColor = tier === 'mythic' ? 'rgba(192,132,252,.4)' : 'rgba(245,158,11,.4)'
  const dotColor = tier === 'mythic' ? 'rgba(192,132,252,.6)' : 'rgba(245,158,11,.6)'

  const corners = [
    { transform: 'translate(8, 8)', rotate: 0 },                    // top-left
    { transform: 'translate(calc(100% - 8px), 8)', rotate: 90 },    // top-right
    { transform: 'translate(8, calc(100% - 8px))', rotate: 270 },   // bottom-left
    { transform: 'translate(calc(100% - 8px), calc(100% - 8px))', rotate: 180 }, // bottom-right
  ]

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 4,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {corners.map((c, i) => (
        <g
          key={i}
          className="corner-ornament"
          transform={`translate(${i === 0 ? 8 : i === 1 ? -28 : i === 2 ? 8 : -28}, ${i < 2 ? 8 : -28})`}
          style={{
            transformOrigin: 'center',
            animation: tier === 'legendary' ? 'cornerPulseGold 2.5s ease-in-out infinite' : undefined,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <g transform={`rotate(${c.rotate}, 10, 10)`}>
            {/* L-bracket base */}
            <path
              d="M0,20 L0,2 Q0,0 2,0 L20,0"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner bracket */}
            <path
              d="M5,16 L5,5 Q5,4 6,4 L16,4"
              stroke={dimColor}
              strokeWidth="1"
              fill="none"
            />
            {/* Corner dot */}
            <circle cx="2" cy="2" r="2" fill={color} opacity="0.9" />
            {/* End dots */}
            <circle cx="20" cy="1.5" r="1.5" fill={dotColor} />
            <circle cx="1.5" cy="20" r="1.5" fill={dotColor} />
          </g>
        </g>
      ))}
    </svg>
  )
}

// ---- Main Component ----

export default function SkillCard({
  artImageUrl,
  name,
  subtitle,
  tagline,
  skillTags,
  tierUnlocks,
  mintPrice,
  serial,
  rarityTier,
  verifiedState,
  size = 'sm',
  interactive = false,
  onClick,
  className,
}: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const dims = SIZE_DIMS[size]
  const tierStyle = TIER_STYLES[rarityTier]
  const displayTier = TIER_DISPLAY_NAMES[rarityTier]
  const showEffects = interactive && ['epic', 'legendary', 'mythic'].includes(rarityTier)
  const showCorners = ['legendary', 'mythic'].includes(rarityTier)

  // Tilt handler (epic+ interactive only)
  useEffect(() => {
    if (!showEffects || !cardRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const card = cardRef.current

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) - 0.5
      const y = ((e.clientY - r.top) / r.height) - 0.5
      card.style.setProperty('--tilt-x', `${y * -12}deg`)
      card.style.setProperty('--tilt-y', `${x * 12}deg`)
      card.style.setProperty('--hero-x', `${(x + 0.5) * 100}%`)
      card.style.setProperty('--hero-y', `${(y + 0.5) * 100}%`)
      card.style.setProperty('--hero-angle', `${118 + x * 42}deg`)
      card.style.transform = `perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))`
    }

    const onLeave = () => {
      card.style.setProperty('--tilt-x', '0deg')
      card.style.setProperty('--tilt-y', '0deg')
      card.style.transform = ''
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)

    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [showEffects])

  const showUnlocks = tierUnlocks && tierUnlocks.length > 0 && ['md', 'lg', 'full'].includes(size)
  const showTagline = !!tagline && size !== 'thumb'
  const showTags = size !== 'thumb'

  return (
    <div
      ref={cardRef}
      className={[
        'skill-card',
        `skill-card--${rarityTier}`,
        `skill-card--${size}`,
        className ?? '',
      ].join(' ')}
      style={{
        width: dims.w,
        height: dims.h,
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        boxShadow: tierStyle.particlesEnabled
          ? `0 0 60px ${tierStyle.accentColor}55, 0 0 120px ${tierStyle.accentColor}22`
          : `0 0 30px ${tierStyle.accentColor}33`,
        border: `2px solid ${tierStyle.accentColor}66`,
        animation: rarityTier === 'legendary' ? 'legendaryGlow 4s ease-in-out infinite'
          : rarityTier === 'mythic' ? 'mythicGlow 3s ease-in-out infinite'
          : undefined,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {/* FULL-BLEED ART IMAGE — fills the entire card */}
      {artImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artImageUrl}
          alt={name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            zIndex: 1,
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${tierStyle.accentColor}22, #08060e)`,
          fontSize: dims.w * 0.3, fontWeight: 900, color: `${tierStyle.accentColor}66`,
        }}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Holographic sheen (epic+) */}
      {tierStyle.holoEnabled && (
        <div className="skill-card__holo" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
      )}

      {/* Verification badge — top right */}
      {verifiedState && (
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}>
          <AgentKeysBadge state={verifiedState} size="sm" showTooltip={false} />
        </div>
      )}

      {/* Corner ornaments (legendary/mythic) */}
      {showCorners && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
          <CornerOrnaments tier={rarityTier} />
        </div>
      )}

      {/* BOTTOM INFO STRIP — gradient overlay with name + tier */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        zIndex: 6,
        background: 'linear-gradient(to top, rgba(4,3,10,.95) 0%, rgba(4,3,10,.85) 60%, transparent 100%)',
        padding: size === 'thumb' ? '16px 8px 8px' : '24px 12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {/* Name */}
        <div style={{
          fontSize: size === 'thumb' ? 10 : size === 'sm' ? 13 : size === 'md' ? 15 : 18,
          fontWeight: 900,
          letterSpacing: '0.04em',
          color: tierStyle.accentColor,
          textTransform: 'uppercase',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {name}
        </div>

        {/* Subtitle + tier (hidden at thumb) */}
        {size !== 'thumb' && (
          <div style={{
            fontSize: size === 'sm' ? 9 : 11,
            fontWeight: 700,
            color: 'rgba(245,242,239,.55)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {subtitle}
          </div>
        )}

        {/* Tier label + serial row (md+ only) */}
        {['md', 'lg', 'full'].includes(size) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}>
            <span style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '0.2em',
              color: tierStyle.accentColor,
              textTransform: 'uppercase',
              padding: '2px 6px',
              borderRadius: 4,
              border: `1px solid ${tierStyle.accentColor}44`,
              background: `${tierStyle.accentColor}11`,
            }}>
              {displayTier}
            </span>
            {serial && (
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                color: 'rgba(245,242,239,.35)',
                letterSpacing: '0.1em',
              }}>
                {serial}
              </span>
            )}
          </div>
        )}

        {/* Skill tags (sm+ only, max 3) */}
        {showTags && skillTags.length > 0 && size !== 'sm' && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
            {skillTags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: tierStyle.accentColor,
                padding: '1px 5px',
                borderRadius: 3,
                border: `1px solid ${tierStyle.accentColor}44`,
                background: `${tierStyle.accentColor}11`,
                textTransform: 'uppercase',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Particle glow — top gradient overlay for legendary/mythic */}
      {tierStyle.particlesEnabled && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
          zIndex: 3, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 0%, ${tierStyle.accentColor}18 0%, transparent 70%)`,
        }} />
      )}
    </div>
  )
}

// ---- Re-export types for consumers ----
export type { SkillCardProps, SkillCardSize }
export { TIER_DISPLAY_NAMES, SIZE_DIMS }
