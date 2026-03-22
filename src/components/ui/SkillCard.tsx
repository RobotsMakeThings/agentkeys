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
        '--card-w': `${dims.w}px`,
        '--card-h': `${dims.h}px`,
        transformStyle: 'preserve-3d',
      } as React.CSSProperties}
      onClick={onClick}
    >
      {/* Card background */}
      <div className="skill-card__bg" />

      {/* Ornate frame border */}
      <div className={`skill-card__frame skill-card__frame--${rarityTier}`} />

      {/* Corner accent ornaments (epic uses CSS ::before/::after, legendary/mythic use SVG) */}
      <div className="skill-card__corners" />
      {showCorners && <CornerOrnaments tier={rarityTier} />}

      {/* TOP BAR */}
      <div className="skill-card__top-bar">
        <span className="skill-card__serial">{serial ?? ''}</span>
        <span className="skill-card__brand">AGENTKEYS</span>
        <span
          className="skill-card__rarity-label"
          style={{ color: tierStyle.accentColor }}
        >
          {displayTier}
        </span>
      </div>

      {/* ART ZONE */}
      <div className="skill-card__art-zone">
        {artImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artImageUrl}
            alt={name}
            className="skill-card__art-image"
          />
        ) : (
          <div className="skill-card__art-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Holographic sheen overlay (epic+) */}
        {tierStyle.holoEnabled && <div className="skill-card__holo" />}

        {/* Verification badge overlay */}
        {verifiedState && (
          <div className="skill-card__badge-overlay">
            <AgentKeysBadge state={verifiedState} size="sm" showTooltip={false} />
          </div>
        )}
      </div>

      {/* NAME ZONE */}
      <div className="skill-card__name-zone">
        <h3 className="skill-card__name">{name}</h3>
        <p className="skill-card__subtitle">{subtitle}</p>
      </div>

      {/* TAGLINE — hidden at thumb/sm */}
      {showTagline && (
        <div className="skill-card__tagline">{tagline}</div>
      )}

      {/* SKILL TAGS — hidden at thumb */}
      {showTags && (
        <div className="skill-card__tags">
          {skillTags.slice(0, 5).map(tag => (
            <span
              key={tag}
              className={`skill-card__tag skill-card__tag--${rarityTier}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* UNLOCKS — only at md/lg/full */}
      {showUnlocks && (
        <div className="skill-card__unlocks">
          {tierUnlocks!.slice(0, 4).map(unlock => (
            <div key={unlock} className="skill-card__unlock-row">
              <span
                className="skill-card__unlock-check"
                style={{ color: tierStyle.accentColor }}
              >
                ✓
              </span>
              <span className="skill-card__unlock-text">{unlock}</span>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="skill-card__bottom-bar">
        <span className="skill-card__price">
          {mintPrice != null ? `${mintPrice} SOL` : ''}
        </span>
        <span className="skill-card__key-serial">
          🔑 {serial ? `AK-SIG-${serial.replace('AK-', '')}` : ''}
        </span>
      </div>

      {/* Particle glow overlay (legendary/mythic only) */}
      {tierStyle.particlesEnabled && (
        <div className="skill-card__particles" />
      )}
    </div>
  )
}

// ---- Re-export types for consumers ----
export type { SkillCardProps, SkillCardSize }
export { TIER_DISPLAY_NAMES, SIZE_DIMS }
