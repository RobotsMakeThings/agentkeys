import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { checkVerificationGate } from '@/lib/verificationGate'

// GET /api/skill-sets — list published skill sets
// Query params: ?creator_id=<uuid>&tier=<tier>&limit=<n>
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const creator_id = searchParams.get('creator_id')
  const tier = searchParams.get('tier')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  let query = supabaseAdmin
    .from('skill_sets')
    .select(`
      *,
      creator:agents!creator_agent_id(id, name, avatar_url, wallet_address),
      members:skill_set_members(
        id, skill_id, position,
        skill:skills(id, name, slug, current_version)
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (creator_id) query = query.eq('creator_agent_id', creator_id)
  if (tier) {
    const validTiers = ['basic', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
    if (!validTiers.includes(tier)) return errorResponse('Invalid tier value', 400)
    query = query.eq('rarity_tier', tier)
  }

  const { data, error } = await query
  if (error) return errorResponse('Failed to fetch skill sets', 500)

  // Sort members by position
  const result = (data ?? []).map((ss: any) => ({
    ...ss,
    members: (ss.members ?? []).sort((a: any, b: any) => a.position - b.position),
  }))

  return successResponse(result)
}

// POST /api/skill-sets — create a skill set (draft)
// Body: { name: string, description?: string }
export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // ---- VERIFICATION GATE ----
  const gate = await checkVerificationGate(auth.agentId)
  if (gate) return gate
  // ---- END GATE ----

  const body = await req.json()
  const { name, description } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return errorResponse('name is required')
  }
  if (name.trim().length > 200) return errorResponse('name must be 200 characters or less')

  // Create draft skill set (power_level=0, is_published=false)
  // Tier defaults to 'basic' — will be updated when skills are added
  const { data: skillSet, error } = await supabaseAdmin
    .from('skill_sets')
    .insert({
      creator_agent_id: auth.agentId,
      name: name.trim(),
      description: description?.trim() ?? null,
      rarity_tier: 'basic',   // placeholder; recomputed when skills are added
      power_level: 0,
      is_published: false,
    })
    .select()
    .single()

  if (error || !skillSet) return errorResponse('Failed to create skill set', 500)

  return successResponse(skillSet, 201)
}
