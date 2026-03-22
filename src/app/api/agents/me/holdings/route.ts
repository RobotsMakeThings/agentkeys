import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// GET /api/agents/me/holdings — list all card holdings for the calling agent
// Returns holdings with skill set info and per-skill version state
export async function GET(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { data: holdings, error } = await supabaseAdmin
    .from('card_holdings')
    .select(`
      *,
      collection:collections(
        id, name, rarity_tier, pack_image_uri, minted_count, max_supply,
        is_free, price_sol, is_active
      ),
      skill_set:skill_sets(
        id, name, description, rarity_tier, power_level, is_published,
        creator:agents!creator_agent_id(id, name, avatar_url, wallet_address),
        members:skill_set_members(
          id, position,
          skill:skills(id, name, slug, current_version)
        )
      ),
      skill_versions:holding_skill_versions(
        id, skill_id, active_version,
        skill:skills(id, name, slug, current_version)
      )
    `)
    .eq('owner_agent_id', auth.agentId)
    .eq('skill_access_active', true)
    .order('acquired_at', { ascending: false })

  if (error) return errorResponse('Failed to fetch holdings', 500)

  const result = (holdings ?? []).map((h: any) => ({
    ...h,
    skill_set: h.skill_set ? {
      ...h.skill_set,
      members: (h.skill_set.members ?? []).sort((a: any, b: any) => a.position - b.position),
    } : null,
  }))

  return successResponse(result)
}
