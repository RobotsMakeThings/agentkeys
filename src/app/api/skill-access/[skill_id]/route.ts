import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { SkillAccessResponse } from '@/types/agentkeys'

export async function GET(req: NextRequest, { params }: { params: { skill_id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Fetch skill (need current_version and agent_id for creator check)
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, current_version, agent_id')
    .eq('id', params.skill_id)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found', 404)

  const isCreator = skill.agent_id === auth.agentId

  // Creators always get current_version, no pinning
  if (isCreator) {
    const { data: version } = await supabaseAdmin
      .from('skill_versions')
      .select('content_md')
      .eq('skill_id', params.skill_id)
      .eq('version', skill.current_version)
      .single()

    const response: SkillAccessResponse = {
      has_access: true,
      current_version: skill.current_version,
      served_version: skill.current_version,
      is_pinned: false,
      content_md: version?.content_md,
    }
    return successResponse(response)
  }

  // Non-creator: check access via two paths
  // Path A: Legacy — holds a collection directly linked to this skill (skill_id on collections)
  // Path B: New — holds a skill set that contains this skill (via skill_set_members)

  // --- Path A: Legacy single-skill collection holding ---
  const { data: directCollections } = await supabaseAdmin
    .from('collections')
    .select('id')
    .eq('skill_id', params.skill_id)

  const directCollectionIds = (directCollections ?? []).map((c: { id: string }) => c.id)

  let holdingDirectPath: { id: string; active_version: number | null } | null = null

  if (directCollectionIds.length > 0) {
    const { data: dh } = await supabaseAdmin
      .from('card_holdings')
      .select('id, active_version')
      .eq('owner_agent_id', auth.agentId)
      .eq('skill_access_active', true)
      .in('collection_id', directCollectionIds)
      .single()
    holdingDirectPath = dh ?? null
  }

  // --- Path B: Skill set membership ---
  // Find skill sets that contain this skill
  const { data: setMemberships } = await supabaseAdmin
    .from('skill_set_members')
    .select('skill_set_id')
    .eq('skill_id', params.skill_id)

  const skillSetIds = (setMemberships ?? []).map((m: any) => m.skill_set_id)

  let holdingSetPath: { id: string; card_holding_id: string; active_version: number | null } | null = null

  if (skillSetIds.length > 0) {
    // Find a card_holding where owner = caller and skill_set_id in skillSetIds
    const { data: setHolding } = await supabaseAdmin
      .from('card_holdings')
      .select('id, skill_set_id, skill_access_active')
      .eq('owner_agent_id', auth.agentId)
      .eq('skill_access_active', true)
      .in('skill_set_id', skillSetIds)
      .single()

    if (setHolding) {
      // Fetch per-skill version state from holding_skill_versions
      const { data: hsv } = await supabaseAdmin
        .from('holding_skill_versions')
        .select('id, active_version')
        .eq('card_holding_id', setHolding.id)
        .eq('skill_id', params.skill_id)
        .single()

      holdingSetPath = hsv ? {
        id: hsv.id,
        card_holding_id: setHolding.id,
        active_version: hsv.active_version,
      } : null
    }
  }

  // No access on either path
  if (!holdingDirectPath && !holdingSetPath) {
    const response: SkillAccessResponse = {
      has_access: false,
      current_version: skill.current_version,
      served_version: skill.current_version,
      is_pinned: false,
    }
    return successResponse(response)
  }

  // Determine which version to serve
  // Prefer skill-set path if available (more granular); fall back to direct path
  const activeVersion = holdingSetPath?.active_version ?? holdingDirectPath?.active_version ?? null
  const serveVersion = activeVersion ?? skill.current_version
  const isPinned = activeVersion !== null && activeVersion !== skill.current_version

  const { data: version, error: versionError } = await supabaseAdmin
    .from('skill_versions')
    .select('content_md')
    .eq('skill_id', params.skill_id)
    .eq('version', serveVersion)
    .single()

  if (versionError || !version) {
    // Fallback to current version
    const { data: fallbackVersion } = await supabaseAdmin
      .from('skill_versions')
      .select('content_md')
      .eq('skill_id', params.skill_id)
      .eq('version', skill.current_version)
      .single()

    const response: SkillAccessResponse = {
      has_access: true,
      current_version: skill.current_version,
      served_version: skill.current_version,
      is_pinned: false,
      content_md: fallbackVersion?.content_md,
    }
    return successResponse(response)
  }

  const response: SkillAccessResponse = {
    has_access: true,
    current_version: skill.current_version,
    served_version: serveVersion,
    is_pinned: isPinned,
    content_md: version.content_md,
  }

  return successResponse(response)
}
