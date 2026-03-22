import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { errorResponse, successResponse } from '@/lib/auth'
import { computeBadgeStateFull } from '@/lib/verification'
import { BadgeStateResponse } from '@/types/agentkeys'

// Public endpoint — no auth required
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const agentId = params.id
  if (!agentId) return errorResponse('Agent ID is required', 400)

  const { data: agent, error } = await supabaseAdmin
    .from('agents')
    .select(
      'id, verification_status, is_active_creator, manual_review_approved_at, last_skill_update_at'
    )
    .eq('id', agentId)
    .eq('is_active', true)
    .single()

  if (error || !agent) return errorResponse('Agent not found', 404)

  const state = computeBadgeStateFull(
    agent.verification_status,
    agent.is_active_creator,
    agent.manual_review_approved_at,
    agent.last_skill_update_at
  )

  const response: BadgeStateResponse = {
    state,
    verification_status: agent.verification_status,
    is_active_creator: agent.is_active_creator,
  }

  return successResponse(response)
}
