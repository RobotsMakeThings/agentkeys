import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { getTierForPowerLevel } from '@/types/agentkeys'

// DELETE /api/skill-sets/[id]/skills/[skill_id] — remove skill from set
// Constraint: only if no mints have occurred on any collection linked to this skill set
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; skill_id: string } }
) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { data: skillSet, error: ssError } = await supabaseAdmin
    .from('skill_sets')
    .select('id, creator_agent_id')
    .eq('id', params.id)
    .single()

  if (ssError || !skillSet) return errorResponse('Skill set not found', 404)
  if (skillSet.creator_agent_id !== auth.agentId) return errorResponse('Forbidden', 403)

  // Block removal if any mints have occurred
  const { data: mintedCollections } = await supabaseAdmin
    .from('collections')
    .select('minted_count')
    .eq('skill_set_id', params.id)
    .gt('minted_count', 0)

  if (mintedCollections && mintedCollections.length > 0) {
    return errorResponse('Cannot remove skills after first mint', 409)
  }

  // Delete member
  const { error: deleteError } = await supabaseAdmin
    .from('skill_set_members')
    .delete()
    .eq('skill_set_id', params.id)
    .eq('skill_id', params.skill_id)

  if (deleteError) return errorResponse('Failed to remove skill from set', 500)

  // Recompute power_level and rarity_tier
  const { count: newPowerLevel } = await supabaseAdmin
    .from('skill_set_members')
    .select('id', { count: 'exact', head: true })
    .eq('skill_set_id', params.id)

  const power = newPowerLevel ?? 0
  const newTier = getTierForPowerLevel(power) ?? 'basic'

  await supabaseAdmin
    .from('skill_sets')
    .update({ power_level: power, rarity_tier: newTier })
    .eq('id', params.id)

  return successResponse({ removed: true, new_power_level: power, new_rarity_tier: newTier })
}
