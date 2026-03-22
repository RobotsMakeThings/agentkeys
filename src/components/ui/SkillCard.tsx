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

  // Percent of image height to show as art (hides placeholder text at bottom of pre-rendered card images)
  const artHeightPct = 58 // show top 58% of image — captures character art, hides baked-in template text

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
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 18,
        overflow: 'hidden',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        background: '#08060e',
        boxShadow: tierStyle.particlesEnabled
          ? `0 0 60px ${tierStyle.accentColor}55, 0 0 120px ${tierStyle.accentColor}22`
          : `0 0 24px ${tierStyle.accentColor}33`,
        border: `2px solid ${tierStyle.accentColor}66`,
        animation: rarityTier === 'legendary' ? 'legendaryGlow 4s ease-in-out infinite'
          : rarityTier === 'mythic' ? 'mythicGlow 3s ease-in-out infinite'
          : undefined,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {/* ── ART ZONE: shows only top artHeightPct% of the image ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${artHeightPct}%`,
        overflow: 'hidden',
        flexShrink: 0,
        background: `linear-gradient(135deg, ${tierStyle.accentColor}11, #08060e)`,
      }}>
        {artImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artImageUrl}
            alt={name}
            style={{
              width: '100%',
              // Scale image so its actual height × artHeightPct% fills the zone
              // image is ~2:3 card, we want top artHeightPct% → height = 100% / (artHeightPct/100)
              height: `${100 / (artHeightPct / 100)}%`,
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: dims.w * 0.25, fontWeight: 900,
            color: `${tierStyle.accentColor}55`,
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Holographic sheen (epic+) */}
        {tierStyle.holoEnabled && (
          <div className="skill-card__holo" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
          }} />
        )}

        {/* Verification badge — top-right corner of art */}
        {verifiedState && (
          <div style={{ position: 'absolute', top: 6, right: 6 }}>
            <AgentKeysBadge state={verifiedState} size="sm" showTooltip={false} />
          </div>
        )}

        {/* Corner ornaments for legendary/mythic */}
        {showCorners && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <CornerOrnaments tier={rarityTier} />
          </div>
        )}

        {/* Fade out bottom edge of art zone */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, #08060e 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── INFO ZONE: pure HTML data, zero placeholders ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: size === 'thumb' ? 1 : 3,
        padding: size === 'thumb' ? '4px 8px 6px' : size === 'sm' ? '6px 10px 8px' : '8px 14px 10px',
        background: `linear-gradient(to bottom, #08060e 0%, #0a0810 100%)`,
        minHeight: 0,
      }}>

        {/* Name — always shown */}
        <div style={{
          fontSize: size === 'thumb' ? 10 : size === 'sm' ? 12 : size === 'md' ? 15 : 18,
          fontWeight: 900,
          letterSpacing: '0.05em',
          color: tierStyle.accentColor,
          textTransform: 'uppercase',
          lineHeight: 1.1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </div>

        {/* Subtitle — hidden at thumb */}
        {size !== 'thumb' && subtitle && (
          <div style={{
            fontSize: size === 'sm' ? 9 : 10,
            fontWeight: 600,
            color: 'rgba(245,242,239,.5)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {subtitle}
          </div>
        )}

        {/* Tier badge + serial — sm+ */}
        {size !== 'thumb' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: '0.18em',
              color: tierStyle.accentColor,
              textTransform: 'uppercase',
              padding: '1px 5px',
              borderRadius: 3,
              border: `1px solid ${tierStyle.accentColor}44`,
              background: `${tierStyle.accentColor}11`,
              flexShrink: 0,
            }}>
              {displayTier}
            </span>
            {serial && (
              <span style={{
                fontSize: 8,
                fontWeight: 600,
                color: 'rgba(245,242,239,.28)',
                letterSpacing: '0.08em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {serial}
              </span>
            )}
          </div>
        )}

        {/* Skill tags — md+ only, max 3 */}
        {['md', 'lg', 'full'].includes(size) && skillTags && skillTags.length > 0 && (
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {skillTags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: tierStyle.accentColor,
                padding: '1px 4px',
                borderRadius: 3,
                border: `1px solid ${tierStyle.accentColor}33`,
                background: `${tierStyle.accentColor}0d`,
                textTransform: 'uppercase',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Mint price — md+ only, only if provided */}
        {['md', 'lg', 'full'].includes(size) && mintPrice != null && (
          <div style={{
            fontSize: 9,
            fontWeight: 800,
            color: 'rgba(245,242,239,.7)',
            letterSpacing: '0.06em',
          }}>
            {mintPrice === 0 ? 'FREE' : `${mintPrice} SOL`}
          </div>
        )}
      </div>

      {/* Particle glow top edge — legendary/mythic */}
      {tierStyle.particlesEnabled && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 0%, ${tierStyle.accentColor}15 0%, transparent 70%)`,
          zIndex: 2,
        }} />
      )}
    </div>
  )
}

// ---- Re-export types for consumers ----
export type { SkillCardProps, SkillCardSize }
export { TIER_DISPLAY_NAMES, SIZE_DIMS }
