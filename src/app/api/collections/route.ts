import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { getMaxSupplyForTier } from '@/types/agentkeys'
import { checkVerificationGate } from '@/lib/verificationGate'

// GET /api/collections — public marketplace listing
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const agent_id = searchParams.get('agent_id')
  const sort = searchParams.get('sort') ?? 'recent'
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = parseInt(searchParams.get('offset') ?? '0')

  let query = supabaseAdmin
    .from('collections')
    .select(`
      *,
      agent:agents(id, name, avatar_url, wallet_address, verification_status, is_active_creator, manual_review_approved_at, last_skill_update_at),
      skill:skills(id, name, slug, current_version)
    `)
    .eq('is_active', true)
    .range(offset, offset + limit - 1)

  if (agent_id) query = query.eq('agent_id', agent_id)
  if (sort === 'popular') query = query.order('minted_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) return errorResponse('Failed to fetch collections', 500)

  return successResponse(data)
}

// POST /api/collections — create new collection
// Accepts either skill_id (legacy) or skill_set_id (new)
// For skill_set collections: validates supply cap against tier
export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // ---- VERIFICATION GATE ----
  const gate = await checkVerificationGate(auth.agentId)
  if (gate) return gate
  // ---- END GATE ----

  const body = await req.json()
  const {
    skill_id,
    skill_set_id,
    name,
    max_supply,
    price_sol,
    metadata_uri,
    pack_image_uri,
    is_free,
  } = body

  if (!skill_set_id && !skill_id) return errorResponse('Either skill_id or skill_set_id is required')
  if (skill_set_id && skill_id) return errorResponse('Provide either skill_id or skill_set_id, not both')
  if (!name) return errorResponse('name is required')
  if (!max_supply || typeof max_supply !== 'number' || max_supply < 1) {
    return errorResponse('max_supply must be a positive integer')
  }

  const isFree = is_free === true
  const priceValue = isFree ? 0 : (price_sol ?? 0)

  if (!isFree && (priceValue === undefined || priceValue <= 0)) {
    return errorResponse('price_sol is required and must be > 0 for paid collections')
  }

  if (skill_set_id) {
    // --- Skill Set Collection ---

    // Verify skill set exists and caller is creator
    const { data: skillSet } = await supabaseAdmin
      .from('skill_sets')
      .select('id, creator_agent_id, rarity_tier, power_level, is_published')
      .eq('id', skill_set_id)
      .single()

    if (!skillSet) return errorResponse('Skill set not found', 404)
    if (skillSet.creator_agent_id !== auth.agentId) return errorResponse('Forbidden', 403)
    if (skillSet.power_level === 0) return errorResponse('Cannot create collection for empty skill set', 400)

    // Enforce supply cap for tier
    const maxCap = getMaxSupplyForTier(skillSet.rarity_tier as any)
    if (max_supply > maxCap) {
      return errorResponse(
        `max_supply ${max_supply} exceeds platform cap for ${skillSet.rarity_tier} tier (max: ${maxCap})`,
        400
      )
    }

    // Auto-set requires_manual_review for Legendary/Mythic tier
    if (['legendary', 'mythic'].includes(skillSet.rarity_tier)) {
      await supabaseAdmin
        .from('agents')
        .update({ requires_manual_review: true })
        .eq('id', auth.agentId)
    }

    // Warn if is_free but tier is rare+
    if (isFree && !['basic', 'uncommon'].includes(skillSet.rarity_tier)) {
      console.warn('[CREATE-COLLECTION] Free mint for rare+ tier', {
        skill_set_id, tier: skillSet.rarity_tier, agent_id: auth.agentId,
      })
    }

    // Check: only one collection per skill set
    const { count: existingCollectionCount } = await supabaseAdmin
      .from('collections')
      .select('id', { count: 'exact', head: true })
      .eq('skill_set_id', skill_set_id)

    if (existingCollectionCount && existingCollectionCount > 0) {
      return errorResponse('A collection already exists for this skill set', 409)
    }

    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .insert({
        skill_set_id,
        skill_id: null,
        agent_id: auth.agentId,
        name,
        max_supply,
        price_sol: priceValue,
        is_free: isFree,
        rarity_tier: skillSet.rarity_tier,
        pack_image_uri: pack_image_uri ?? null,
        metadata_uri: metadata_uri ?? null,
        minted_count: 0,
        is_active: true,
      })
      .select()
      .single()

    if (error || !collection) return errorResponse('Failed to create collection', 500)

    return successResponse(collection, 201)

  } else {
    // --- Legacy Single-Skill Collection ---

    const { data: skill } = await supabaseAdmin
      .from('skills')
      .select('id')
      .eq('id', skill_id)
      .eq('agent_id', auth.agentId)
      .single()

    if (!skill) return errorResponse('Skill not found or unauthorized', 404)

    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .insert({
        skill_id,
        skill_set_id: null,
        agent_id: auth.agentId,
        name,
        max_supply,
        price_sol: priceValue,
        is_free: isFree,
        metadata_uri: metadata_uri ?? null,
        minted_count: 0,
        is_active: true,
      })
      .select()
      .single()

    if (error || !collection) return errorResponse('Failed to create collection', 500)

    return successResponse(collection, 201)
  }
}