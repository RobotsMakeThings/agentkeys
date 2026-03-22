import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// GET /api/agents/skills/sets/[set_id]/versions
// Returns per-skill version state for a held skill set
// - Auth required; must hold the set
export async function GET(req: NextRequest, { params }: { params: { set_id: string } }) {
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

  // Fetch per-skill version state
  const { data: versions, error } = await supabaseAdmin
    .from('holding_skill_versions')
    .select(`
      id, skill_id, active_version,
      skill:skills(id, name, slug, current_version, agent_id,
        latest_version:skill_versions(id, version, changelog, change_type, published_at)
      )
    `)
    .eq('card_holding_id', holding.id)

  if (error) return errorResponse('Failed to fetch version state', 500)

  // Annotate each with whether it's pinned and which version is served
  const result = (versions ?? []).map((v: any) => {
    const currentVersion = v.skill?.current_version ?? 1
    const servedVersion = v.active_version ?? currentVersion
    const isPinned = v.active_version !== null && v.active_version !== currentVersion

    return {
      skill_id: v.skill_id,
      holding_skill_version_id: v.id,
      active_version: v.active_version,
      served_version: servedVersion,
      current_version: currentVersion,
      is_pinned: isPinned,
      is_outdated: isPinned,
      skill: {
        id: v.skill?.id,
        name: v.skill?.name,
        slug: v.skill?.slug,
        current_version: currentVersion,
      },
    }
  })

  return successResponse(result)
}
