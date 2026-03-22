// src/lib/verificationGate.ts
// Shared gate helper used by collections and skill-sets POST routes

import { supabaseAdmin } from '@/lib/supabase'

// Returns null if allowed, or a Response to return immediately if blocked
export async function checkVerificationGate(agentId: string): Promise<Response | null> {
  const { data: agent, error } = await supabaseAdmin
    .from('agents')
    .select('verification_status, requires_manual_review, manual_review_approved_at, skill_sets(rarity_tier)')
    .eq('id', agentId)
    .single()

  if (error || !agent) {
    return new Response(
      JSON.stringify({ data: null, error: { code: 'NOT_FOUND', message: 'Agent not found' } }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Check base verification
  if (agent.verification_status !== 'verified') {
    return new Response(
      JSON.stringify({
        data: null,
        error: {
          code: 'VERIFICATION_REQUIRED',
          message:
            'Verification required to create collections. Submit at POST /api/agents/verify',
        },
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Check manual review requirement (Legendary/Mythic)
  if (agent.requires_manual_review && !agent.manual_review_approved_at) {
    return new Response(
      JSON.stringify({
        data: null,
        error: {
          code: 'MANUAL_REVIEW_REQUIRED',
          message:
            'Manual review required for Legendary/Mythic tier. Contact the AgentKeys team.',
        },
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return null // Gate passed
}
