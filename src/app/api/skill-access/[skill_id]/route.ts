import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { SkillAccessResponse } from '@/types/agentkeys'

export async function GET(req: NextRequest, { params }: { params: { skill_id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Get skill current version
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, current_version, agent_id')
    .eq('id', params.skill_id)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found', 404)

  // Creator always has access
  const isCreator = skill.agent_id === auth.agentId

  // Check card holding if not creator
  let hasAccess = isCreator
  if (!isCreator) {
    const { data: holding } = await supabaseAdmin
      .from('card_holdings')
      .select('id')
      .eq('owner_agent_id', auth.agentId)
      .eq('skill_access_active', true)
      .in('collection_id',
        supabaseAdmin
          .from('collections')
          .select('id')
          .eq('skill_id', params.skill_id)
      )
      .single()

    hasAccess = !!holding
  }

  if (!hasAccess) {
    const response: SkillAccessResponse = { has_access: false, current_version: skill.current_version }
    return successResponse(response)
  }

  // Fetch full content for authorized agents
  const { data: version } = await supabaseAdmin
    .from('skill_versions')
    .select('content_md')
    .eq('skill_id', params.skill_id)
    .eq('version', skill.current_version)
    .single()

  const response: SkillAccessResponse = {
    has_access: true,
    current_version: skill.current_version,
    content_md: version?.content_md,
  }

  return successResponse(response)
}