import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// PATCH /api/agents/skills/sets/[set_id]/skill/[skill_id]/version
// Body: { action: 'adopt' | 'reject' | 'pin' | 'rollback', version?: number }
//
// adopt   → set active_version = NULL (follow latest)
// reject  → set active_version = current version (freeze at now, ignore future)
// pin     → set active_version = body.version (must be valid version number)
// rollback → set active_version = current - 1 (or 1 if already at 1)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { set_id: string; skill_id: string } }
) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Verify agent holds this skill set
  const { data: holding } = await supabaseAdmin
    .from('card_holdings')
    .select('id, skill_set_id')
    .eq('owner_agent_id', auth.agentId)
    .eq('skill_set_id', params.set_id)
    .eq('skill_access_active', true)
    .single()

  if (!holding) return errorResponse('You do not hold this skill set', 403)

  // Verify skill is a member of the set
  const { data: member } = await supabaseAdmin
    .from('skill_set_members')
    .select('id')
    .eq('skill_set_id', params.set_id)
    .eq('skill_id', params.skill_id)
    .single()

  if (!member) return errorResponse('Skill is not a member of this set', 404)

  // Fetch skill's current version for validation
  const { data: skill } = await supabaseAdmin
    .from('skills')
    .select('id, current_version')
    .eq('id', params.skill_id)
    .single()

  if (!skill) return errorResponse('Skill not found', 404)

  // Fetch existing holding_skill_version record
  const { data: hsv } = await supabaseAdmin
    .from('holding_skill_versions')
    .select('id, active_version')
    .eq('card_holding_id', holding.id)
    .eq('skill_id', params.skill_id)
    .single()

  if (!hsv) return errorResponse('Version state not found for this skill', 404)

  const body = await req.json()
  const { action, version } = body

  let newVersion: number | null = null

  switch (action) {
    case 'adopt':
      newVersion = null  // follow latest
      break

    case 'reject':
      // Freeze at current version (active_version = current_version)
      newVersion = skill.current_version
      break

    case 'pin': {
      if (version === undefined || typeof version !== 'number') {
        return errorResponse('version is required for pin action')
      }
      if (version < 1 || version > skill.current_version) {
        return errorResponse(`version must be between 1 and ${skill.current_version}`)
      }
      // Verify the version actually exists
      const { data: versionRow } = await supabaseAdmin
        .from('skill_versions')
        .select('id')
        .eq('skill_id', params.skill_id)
        .eq('version', version)
        .single()
      if (!versionRow) return errorResponse('Specified version does not exist', 404)
      newVersion = version
      break
    }

    case 'rollback': {
      const current = hsv.active_version ?? skill.current_version
      newVersion = Math.max(1, current - 1)
      break
    }

    default:
      return errorResponse('action must be one of: adopt, reject, pin, rollback')
  }

  const { error } = await supabaseAdmin
    .from('holding_skill_versions')
    .update({ active_version: newVersion })
    .eq('id', hsv.id)

  if (error) return errorResponse('Failed to update version state', 500)

  // Mark related notification as decided (if exists)
  if (action === 'adopt' || action === 'reject') {
    await supabaseAdmin
      .from('skill_version_notifications')
      .update({ decided: true })
      .eq('agent_id', auth.agentId)
      .eq('skill_id', params.skill_id)
      .eq('decided', false)
  }

  return successResponse({
    action,
    skill_id: params.skill_id,
    active_version: newVersion,
    served_version: newVersion ?? skill.current_version,
    is_pinned: newVersion !== null,
  })
}
