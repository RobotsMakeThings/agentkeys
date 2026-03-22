'use client'

import { BadgeState } from '@/types/agentkeys'
import { useState } from 'react'

interface AgentKeysBadgeProps {
  state: BadgeState
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

const SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32,
}

const TOOLTIP_LABELS: Record<BadgeState, string> = {
  unverified: 'Unverified',
  verified: 'Verified Creator',
  active_creator: 'Active Creator',
  inactive_creator: 'Inactive Creator',
  platform_verified: 'Platform Verified',
}

export default function AgentKeysBadge({
  state,
  size = 'md',
  showTooltip = true,
}: AgentKeysBadgeProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const px = SIZE_MAP[size]

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => showTooltip && setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <svg
        width={px}
        height={Math.round(px * 1.167)}
        viewBox="0 0 24 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`agentkeys-badge agentkeys-badge--${state}`}
        aria-label={TOOLTIP_LABELS[state]}
        role="img"
      >
        <defs>
          {/* Gold gradient for platform_verified */}
          <linearGradient id={`goldGrad-${state}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          {/* Violet gradient for verified states */}
          <linearGradient id={`violetGrad-${state}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          {/* Glow filter for active_creator */}
          <filter id={`activeGlow-${state}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.58  0 0 0 0 0.2  0 0 0 0 0.92  0 0 0 1 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow filter for platform_verified */}
          <filter id={`goldGlow-${state}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.98  0 0 0 0 0.62  0 0 0 0 0.07  0 0 0 1 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shield path — quadratic bezier version */}
        <path
          d="M12,2 C5,2 2,4.5 2,4.5 L2,15.5 C2,22 12,27 12,27 C12,27 22,22 22,15.5 L22,4.5 C22,4.5 19,2 12,2 Z"
          fill={
            state === 'unverified'
              ? '#6b7280'
              : state === 'inactive_creator'
              ? '#f59e0b'
              : state === 'platform_verified'
              ? `url(#goldGrad-${state})`
              : `url(#violetGrad-${state})`
          }
          opacity={
            state === 'unverified' ? 0.4 : state === 'inactive_creator' ? 0.7 : 1
          }
          filter={
            state === 'active_creator'
              ? `url(#activeGlow-${state})`
              : state === 'platform_verified'
              ? `url(#goldGlow-${state})`
              : undefined
          }
          stroke={
            state === 'verified' || state === 'active_creator'
              ? 'rgba(147,51,234,0.4)'
              : state === 'inactive_creator'
              ? 'rgba(245,158,11,0.3)'
              : state === 'platform_verified'
              ? 'rgba(251,191,36,0.5)'
              : 'none'
          }
          strokeWidth={state !== 'unverified' ? 0.5 : 0}
        />

        {/* Inner key icon — only visible at md/lg sizes */}
        {size !== 'sm' && (
          <g opacity={0.9}>
            {/* Key ring */}
            <circle
              cx="12"
              cy="11"
              r="3.5"
              strokeWidth="1.5"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
            />
            {/* Key shaft */}
            <line
              x1="12" y1="14.5" x2="12" y2="20"
              strokeWidth="1.5"
              strokeLinecap="round"
              stroke="rgba(255,255,255,0.85)"
            />
            {/* Key teeth */}
            <line
              x1="12" y1="17" x2="14.5" y2="17"
              strokeWidth="1.5"
              strokeLinecap="round"
              stroke="rgba(255,255,255,0.85)"
            />
            <line
              x1="12" y1="19" x2="14" y2="19"
              strokeWidth="1.5"
              strokeLinecap="round"
              stroke="rgba(255,255,255,0.85)"
            />
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && tooltipVisible && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            padding: '4px 10px',
            background: 'rgba(4,3,10,0.92)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            color: '#f5f2ef',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {TOOLTIP_LABELS[state]}
        </span>
      )}

      <style>{`
        /* ---- Badge animations ---- */
        .agentkeys-badge--active_creator {
          animation: activeBadgePulse 2.2s ease-in-out infinite;
        }

        @keyframes activeBadgePulse {
          0%   { filter: drop-shadow(0 0 3px rgba(147,51,234,0.6)); }
          40%  { filter: drop-shadow(0 0 8px rgba(236,72,153,0.9)); }
          70%  { filter: drop-shadow(0 0 6px rgba(147,51,234,0.7)); }
          100% { filter: drop-shadow(0 0 3px rgba(147,51,234,0.6)); }
        }

        .agentkeys-badge--platform_verified {
          animation: platformGoldShimmer 3s ease-in-out infinite;
        }

        @keyframes platformGoldShimmer {
          0%   { filter: drop-shadow(0 0 4px rgba(251,191,36,0.5)); }
          50%  { filter: drop-shadow(0 0 10px rgba(251,191,36,0.9)) drop-shadow(0 0 20px rgba(245,158,11,0.4)); }
          100% { filter: drop-shadow(0 0 4px rgba(251,191,36,0.5)); }
        }
      `}</style>
    </span>
  )
}
