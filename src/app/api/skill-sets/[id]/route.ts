import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// GET /api/skill-sets/[id] — get skill set with members
// Public for published sets; creator can also see their own drafts
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req).catch(() => null)
  // Note: auth is optional here — public can see published sets

  const { data: skillSet, error } = await supabaseAdmin
    .from('skill_sets')
    .select(`
      *,
      creator:agents!creator_agent_id(id, name, avatar_url, wallet_address),
      members:skill_set_members(
        id, skill_id, position,
        skill:skills(id, name, slug, current_version)
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !skillSet) return errorResponse('Skill set not found', 404)

  // Draft sets only visible to creator
  if (!skillSet.is_published) {
    if (!auth || auth.agentId !== skillSet.creator_agent_id) {
      return errorResponse('Skill set not found', 404)
    }
  }

  const result = {
    ...skillSet,
    members: (skillSet.members ?? []).sort((a: any, b: any) => a.position - b.position),
  }

  return successResponse(result)
}

// PATCH /api/skill-sets/[id] — update skill set metadata or publish
// Body: { name?: string, description?: string, is_published?: boolean }
// Constraint: cannot edit name/description after first mint
// Constraint: cannot publish if power_level === 0
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { data: skillSet, error: fetchError } = await supabaseAdmin
    .from('skill_sets')
    .select('id, creator_agent_id, power_level, is_published')
    .eq('id', params.id)
    .single()

  if (fetchError || !skillSet) return errorResponse('Skill set not found', 404)
  if (skillSet.creator_agent_id !== auth.agentId) return errorResponse('Forbidden', 403)

  const body = await req.json()
  const { name, description, is_published } = body

  // Check if any mints have happened (locks name/description)
  if (name !== undefined || description !== undefined) {
    const { count } = await supabaseAdmin
      .from('collections')
      .select('id', { count: 'exact', head: true })
      .eq('skill_set_id', params.id)

    // Check if any of those collections have minted_count > 0
    const { data: mintedCollections } = await supabaseAdmin
      .from('collections')
      .select('minted_count')
      .eq('skill_set_id', params.id)
      .gt('minted_count', 0)

    if (mintedCollections && mintedCollections.length > 0) {
      return errorResponse('Cannot edit name or description after first mint', 409)
    }
  }

  // Validate publish attempt
  if (is_published === true && skillSet.power_level === 0) {
    return errorResponse('Cannot publish a skill set with no skills', 400)
  }

  const updates: Record<string, any> = {}
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) return errorResponse('name is required')
    if (name.trim().length > 200) return errorResponse('name must be 200 characters or less')
    updates.name = name.trim()
  }
  if (description !== undefined) updates.description = description?.trim() ?? null
  if (is_published !== undefined) updates.is_published = Boolean(is_published)

  if (Object.keys(updates).length === 0) return errorResponse('No valid fields to update')

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('skill_sets')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (updateError || !updated) return errorResponse('Failed to update skill set', 500)

  return successResponse(updated)
}
