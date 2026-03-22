import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

const VALID_CHANGE_TYPES = ['patch', 'minor', 'major'] as const
type ChangeType = typeof VALID_CHANGE_TYPES[number]

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const body = await req.json()
  const { content_md, changelog, change_type } = body

  if (!content_md) return errorResponse('Missing content_md')

  // Validate change_type BEFORE assigning (KR2 fix: no null! escape hatch)
  if (change_type !== undefined && !VALID_CHANGE_TYPES.includes(change_type as ChangeType)) {
    return errorResponse('Invalid change_type. Must be one of: patch, minor, major')
  }

  // Default to 'patch' if not provided
  const resolvedChangeType: ChangeType = (change_type as ChangeType) ?? 'patch'

  // Verify ownership
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, current_version, agent_id')
    .eq('id', params.id)
    .eq('agent_id', auth.agentId)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found or unauthorized', 404)

  const newVersion = skill.current_version + 1

  // Insert new version row
  const { error: versionError } = await supabaseAdmin
    .from('skill_versions')
    .insert({
      skill_id: skill.id,
      version: newVersion,
      content_md,
      changelog: changelog ?? null,
      change_type: resolvedChangeType,
    })

  if (versionError) return errorResponse('Failed to create version', 500)

  // Bump current_version on skill
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('skills')
    .update({ current_version: newVersion, updated_at: new Date().toISOString() })
    .eq('id', skill.id)
    .select()
    .single()

  if (updateError) return errorResponse('Failed to update skill', 500)

  // --- FANOUT: notify all active holders ---
  // Find all collections for this skill
  const { data: collections } = await supabaseAdmin
    .from('collections')
    .select('id')
    .eq('skill_id', skill.id)

  const collectionIds = (collections ?? []).map((c: { id: string }) => c.id)

  if (collectionIds.length > 0) {
    // Find all active holders across all collections for this skill
    // Exclude the creator themselves (they don't need a notification)
    const { data: holdings } = await supabaseAdmin
      .from('card_holdings')
      .select('owner_agent_id')
      .eq('skill_access_active', true)
      .in('collection_id', collectionIds)
      .neq('owner_agent_id', auth.agentId)

    if (holdings && holdings.length > 0) {
      // Deduplicate: an agent might hold multiple cards for the same skill
      const uniqueAgentIds = Array.from(new Set(holdings.map((h: { owner_agent_id: string }) => h.owner_agent_id)))

      const notifications = uniqueAgentIds.map((agentId: string) => ({
        agent_id: agentId,
        skill_id: skill.id,
        version: newVersion,
        change_type: resolvedChangeType,
        changelog: changelog ?? null,
        seen: false,
        decided: false,
      }))

      // Upsert to handle any race conditions or duplicate pushes
      const { error: notifError } = await supabaseAdmin
        .from('skill_version_notifications')
        .upsert(notifications, { onConflict: 'agent_id,skill_id,version', ignoreDuplicates: true })

      if (notifError) {
        // Non-fatal: version was published successfully; log but don't fail the request
        console.error('[PUT /api/skills/:id] Failed to fanout notifications:', notifError.message)
      }
    }
  }

  return successResponse(updated)
}
