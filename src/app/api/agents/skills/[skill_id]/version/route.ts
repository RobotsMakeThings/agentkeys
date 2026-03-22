import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

type Action = 'adopt' | 'reject' | 'pin' | 'rollback'
const VALID_ACTIONS: Action[] = ['adopt', 'reject', 'pin', 'rollback']

export async function PATCH(req: NextRequest, { params }: { params: { skill_id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const body = await req.json()
  const { action, version } = body as { action: Action; version?: number }

  // Validate action
  if (!action || !VALID_ACTIONS.includes(action)) {
    return errorResponse(`Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}`)
  }

  // pin and rollback require a version number
  if ((action === 'pin' || action === 'rollback') && (version === undefined || version === null)) {
    return errorResponse(`action "${action}" requires a version number in the request body`)
  }

  // Fetch the skill (need current_version for validation)
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, current_version')
    .eq('id', params.skill_id)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found', 404)

  // Verify the caller holds an active card for this skill (two-query pattern)
  const { data: collections } = await supabaseAdmin
    .from('collections')
    .select('id')
    .eq('skill_id', params.skill_id)

  const collectionIds = (collections ?? []).map((c: { id: string }) => c.id)

  if (collectionIds.length === 0) {
    return errorResponse('No collections found for this skill', 404)
  }

  const { data: holding } = await supabaseAdmin
    .from('card_holdings')
    .select('id, active_version')
    .eq('owner_agent_id', auth.agentId)
    .eq('skill_access_active', true)
    .in('collection_id', collectionIds)
    .single()

  if (!holding) {
    return errorResponse('You do not hold an active card for this skill', 403)
  }

  // For pin and rollback: validate target version exists
  if (action === 'pin' || action === 'rollback') {
    const targetVersion = version as number

    if (targetVersion < 1) {
      return errorResponse('version must be >= 1')
    }

    if (targetVersion > skill.current_version) {
      return errorResponse(`version exceeds current_version (${skill.current_version})`)
    }

    // Verify the version row actually exists
    const { data: versionRow } = await supabaseAdmin
      .from('skill_versions')
      .select('id')
      .eq('skill_id', params.skill_id)
      .eq('version', targetVersion)
      .single()

    if (!versionRow) {
      return errorResponse(`Version ${targetVersion} does not exist for this skill`)
    }
  }

  // --- Execute the action ---
  // KR2 fix: for 'reject', skip the active_version UPDATE entirely (no-op write)

  let newActiveVersion: number | null = holding.active_version

  if (action === 'adopt') {
    // Follow latest: clear any pin
    newActiveVersion = null
    const { error: updateError } = await supabaseAdmin
      .from('card_holdings')
      .update({ active_version: null })
      .eq('id', holding.id)

    if (updateError) return errorResponse('Failed to update version preference', 500)
  } else if (action === 'reject') {
    // Stay on current pin — do NOT update active_version (KR2: skip the write entirely)
    newActiveVersion = holding.active_version
    // No DB write for active_version
  } else if (action === 'pin' || action === 'rollback') {
    // Pin to specific version
    newActiveVersion = version as number
    const { error: updateError } = await supabaseAdmin
      .from('card_holdings')
      .update({ active_version: newActiveVersion })
      .eq('id', holding.id)

    if (updateError) return errorResponse('Failed to update version preference', 500)
  }

  // Mark the relevant notification(s) as decided
  let notifQuery = supabaseAdmin
    .from('skill_version_notifications')
    .update({ decided: true })
    .eq('agent_id', auth.agentId)
    .eq('skill_id', params.skill_id)
    .eq('decided', false)

  if (action === 'pin' || action === 'rollback') {
    // Only mark the specific version notification
    notifQuery = notifQuery.eq('version', version as number)
  }
  // For adopt/reject: mark ALL undecided notifications for this skill (clean slate)

  const { error: notifError } = await notifQuery

  if (notifError) {
    // Non-fatal
    console.error('[PATCH version] Failed to mark notifications decided:', notifError.message)
  }

  return successResponse({
    skill_id: params.skill_id,
    action,
    active_version: newActiveVersion,
    current_version: skill.current_version,
    is_following_latest: newActiveVersion === null,
  })
}
