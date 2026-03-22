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

  // Non-creator: find holding and check active_version
  const { data: collections } = await supabaseAdmin
    .from('collections')
    .select('id')
    .eq('skill_id', params.skill_id)

  const collectionIds = (collections ?? []).map((c: { id: string }) => c.id)

  if (collectionIds.length === 0) {
    const response: SkillAccessResponse = {
      has_access: false,
      current_version: skill.current_version,
      served_version: skill.current_version,
      is_pinned: false,
    }
    return successResponse(response)
  }

  const { data: holding } = await supabaseAdmin
    .from('card_holdings')
    .select('id, active_version')
    .eq('owner_agent_id', auth.agentId)
    .eq('skill_access_active', true)
    .in('collection_id', collectionIds)
    .single()

  if (!holding) {
    const response: SkillAccessResponse = {
      has_access: false,
      current_version: skill.current_version,
      served_version: skill.current_version,
      is_pinned: false,
    }
    return successResponse(response)
  }

  // Determine which version to serve
  // active_version === null → serve latest (current_version)
  // active_version !== null → serve pinned version
  const serveVersion = holding.active_version ?? skill.current_version
  const isPinned = holding.active_version !== null && holding.active_version !== skill.current_version

  const { data: version, error: versionError } = await supabaseAdmin
    .from('skill_versions')
    .select('content_md')
    .eq('skill_id', params.skill_id)
    .eq('version', serveVersion)
    .single()

  if (versionError || !version) {
    // Pinned version row missing — fall back to current_version
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
