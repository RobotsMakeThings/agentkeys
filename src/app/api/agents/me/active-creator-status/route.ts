import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { ActiveCreatorStatusResponse } from '@/types/agentkeys'

const ACTIVE_CREATOR_WINDOW_DAYS = 90

export async function GET(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const now = new Date()
  const windowStart = new Date(now.getTime() - ACTIVE_CREATOR_WINDOW_DAYS * 24 * 60 * 60 * 1000)

  // Query: find the most recent skill_versions entry for any skill owned by this agent
  // within the 90-day window
  const { data: recentVersions, error: queryError } = await supabaseAdmin
    .from('skill_versions')
    .select('published_at, skill:skills!inner(agent_id)')
    .eq('skill.agent_id', auth.agentId)
    .gte('published_at', windowStart.toISOString())
    .order('published_at', { ascending: false })
    .limit(1)

  if (queryError) return errorResponse('Failed to check active creator status', 500)

  const hasRecentActivity = recentVersions && recentVersions.length > 0
  const lastVersionAt = hasRecentActivity ? (recentVersions[0] as any).published_at : null

  // Also check the agents.last_skill_update_at for cases where it was set but skill_versions query differs
  const { data: agent, error: agentError } = await supabaseAdmin
    .from('agents')
    .select('is_active_creator, last_skill_update_at')
    .eq('id', auth.agentId)
    .single()

  if (agentError || !agent) return errorResponse('Agent not found', 404)

  // Determine effective last update: prefer most recent of skill_versions query vs stored value
  let effectiveLastUpdate: string | null = null
  if (lastVersionAt && agent.last_skill_update_at) {
    effectiveLastUpdate =
      new Date(lastVersionAt) > new Date(agent.last_skill_update_at)
        ? lastVersionAt
        : agent.last_skill_update_at
  } else {
    effectiveLastUpdate = lastVersionAt ?? agent.last_skill_update_at
  }

  const isActive = hasRecentActivity

  // Compute days since last update
  let daysSinceUpdate: number | null = null
  if (effectiveLastUpdate) {
    daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(effectiveLastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  // Update agents table if state has changed
  if (agent.is_active_creator !== isActive || agent.last_skill_update_at !== effectiveLastUpdate) {
    const { error: updateError } = await supabaseAdmin
      .from('agents')
      .update({
        is_active_creator: isActive,
        last_skill_update_at: effectiveLastUpdate,
      })
      .eq('id', auth.agentId)

    if (updateError) {
      // Non-fatal: log but don't fail the request
      console.error('[active-creator-status] Failed to update agent state:', updateError.message)
    }
  }

  const response: ActiveCreatorStatusResponse = {
    is_active_creator: isActive,
    last_update_at: effectiveLastUpdate,
    days_since_update: daysSinceUpdate,
  }

  return successResponse(response)
}
