// src/lib/verification.ts
// URL validation + badge state computation

import { BadgeState, VerificationStatus } from '@/types/agentkeys'

// ---- URL validators ----

const GITHUB_PATTERN = /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)(?:\/)?$/
const X_PATTERN = /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/([a-zA-Z0-9_]{1,50})(?:\/)?$/
const MODELBOOK_PATTERN = /^https?:\/\/(www\.)?modelbook\.ai\/([a-zA-Z0-9_-]{1,50})(?:\/)?$/

export function validateProviderUrl(
  provider: 'github' | 'x' | 'modelbook',
  url: string
): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'profile_url is required' }
  }

  const trimmed = url.trim()

  switch (provider) {
    case 'github':
      if (!GITHUB_PATTERN.test(trimmed)) {
        return {
          valid: false,
          error: 'profile_url must be a valid GitHub profile URL (e.g. https://github.com/username)',
        }
      }
      break
    case 'x':
      if (!X_PATTERN.test(trimmed)) {
        return {
          valid: false,
          error: 'profile_url must be a valid X/Twitter profile URL (e.g. https://x.com/username)',
        }
      }
      break
    case 'modelbook':
      if (!MODELBOOK_PATTERN.test(trimmed)) {
        return {
          valid: false,
          error: 'profile_url must be a valid Modelbook profile URL (e.g. https://modelbook.ai/username)',
        }
      }
      break
    default:
      return { valid: false, error: 'Invalid provider. Must be github, x, or modelbook' }
  }

  return { valid: true }
}

// ---- Badge state computation ----
// Priority order: platform_verified > active_creator > inactive_creator > verified > unverified

export function computeBadgeState(
  verificationStatus: VerificationStatus,
  isActiveCreator: boolean,
  manualReviewApprovedAt: string | null
): BadgeState {
  // Platform verified: manually reviewed AND approved (Legendary/Mythic tier)
  if (verificationStatus === 'verified' && manualReviewApprovedAt !== null) {
    return 'platform_verified'
  }

  if (verificationStatus === 'verified') {
    if (isActiveCreator) return 'active_creator'
    // Check if they WERE ever active (last_skill_update_at is set but expired)
    // This is passed as isActiveCreator=false from the caller after expiry check
    // We return 'inactive_creator' only if they were previously active (caller resolves)
    return 'verified'
  }

  return 'unverified'
}

// Overloaded version that also takes wasEverActive for inactive_creator state
export function computeBadgeStateFull(
  verificationStatus: VerificationStatus,
  isActiveCreator: boolean,
  manualReviewApprovedAt: string | null,
  lastSkillUpdateAt: string | null
): BadgeState {
  if (verificationStatus === 'verified' && manualReviewApprovedAt !== null) {
    return 'platform_verified'
  }

  if (verificationStatus === 'verified') {
    if (isActiveCreator) return 'active_creator'
    // Was previously active but now expired
    if (lastSkillUpdateAt !== null) return 'inactive_creator'
    return 'verified'
  }

  return 'unverified'
}

// ---- Admin API key verification ----

export function verifyAdminKey(key: string | null): boolean {
  if (!key) return false
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) {
    console.error('[ADMIN] ADMIN_API_KEY not set in environment')
    return false
  }
  return key === adminKey
}
