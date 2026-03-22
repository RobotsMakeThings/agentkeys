import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { getTierForPowerLevel } from '@/types/agentkeys'

// POST /api/skill-sets/[id]/skills — add a skill to the set
// Body: { skill_id: string, position?: number }
// - Auth required; must be creator
// - Skill must belong to the creator
// - Cannot add duplicate skill
// - Recomputes power_level and rarity_tier after adding
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { data: skillSet, error: ssError } = await supabaseAdmin
    .from('skill_sets')
    .select('id, creator_agent_id, power_level, rarity_tier')
    .eq('id', params.id)
    .single()

  if (ssError || !skillSet) return errorResponse('Skill set not found', 404)
  if (skillSet.creator_agent_id !== auth.agentId) return errorResponse('Forbidden', 403)

  const body = await req.json()
  const { skill_id, position } = body

  if (!skill_id) return errorResponse('skill_id is required')

  // Verify skill belongs to creator
  const { data: skill } = await supabaseAdmin
    .from('skills')
    .select('id')
    .eq('id', skill_id)
    .eq('agent_id', auth.agentId)
    .single()

  if (!skill) return errorResponse('Skill not found or unauthorized', 404)

  // Insert member (UNIQUE constraint handles duplicates)
  const { data: member, error: insertError } = await supabaseAdmin
    .from('skill_set_members')
    .insert({ skill_set_id: params.id, skill_id, position: position ?? 0 })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') return errorResponse('Skill already in this set', 409)
    return errorResponse('Failed to add skill to set', 500)
  }

  // Recompute power_level and rarity_tier
  const { count: newPowerLevel } = await supabaseAdmin
    .from('skill_set_members')
    .select('id', { count: 'exact', head: true })
    .eq('skill_set_id', params.id)

  const power = newPowerLevel ?? 1
  const newTier = getTierForPowerLevel(power) ?? 'basic'

  await supabaseAdmin
    .from('skill_sets')
    .update({ power_level: power, rarity_tier: newTier })
    .eq('id', params.id)

  return successResponse({ member, new_power_level: power, new_rarity_tier: newTier }, 201)
}
