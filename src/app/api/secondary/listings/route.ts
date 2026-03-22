import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// GET /api/secondary/listings — list active secondary market listings
// Query params: ?skill_set_id, ?tier, ?min_price, ?max_price, ?limit, ?offset
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const skill_set_id = searchParams.get('skill_set_id')
  const tier = searchParams.get('tier')
  const min_price = searchParams.get('min_price')
  const max_price = searchParams.get('max_price')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  let query = supabaseAdmin
    .from('secondary_listings')
    .select(`
      *,
      seller:agents!seller_agent_id(id, name, avatar_url, wallet_address),
      holding:card_holdings!card_holding_id(
        id, nft_mint_address, acquired_at, skill_set_id,
        collection:collections(id, name, rarity_tier, pack_image_uri, minted_count, max_supply)
      ),
      skill_set:skill_sets(
        id, name, description, rarity_tier, power_level,
        creator:agents!creator_agent_id(id, name, avatar_url),
        members:skill_set_members(
          id, position,
          skill:skills(id, name, slug)
        )
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Filter by skill_set_id via holding
  if (skill_set_id) {
    // Get card_holding_ids for this skill_set
    const { data: holdings } = await supabaseAdmin
      .from('card_holdings')
      .select('id')
      .eq('skill_set_id', skill_set_id)
    const holdingIds = (holdings ?? []).map((h: any) => h.id)
    if (holdingIds.length === 0) return successResponse([])
    query = query.in('card_holding_id', holdingIds)
  }

  if (min_price) query = query.gte('price_sol', parseFloat(min_price))
  if (max_price) query = query.lte('price_sol', parseFloat(max_price))

  const { data, error } = await query
  if (error) return errorResponse('Failed to fetch listings', 500)

  let result = data ?? []

  if (tier) {
    const validTiers = ['basic', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
    if (!validTiers.includes(tier)) return errorResponse('Invalid tier value', 400)
    result = result.filter((l: any) => l.skill_set?.rarity_tier === tier)
  }

  return successResponse(result)
}

// POST /api/secondary/listings — create a secondary market listing
// Body: { card_holding_id: string, price_sol: number }
// - Auth required
// - Must own the holding
// - Holding must not already have an active listing (enforced by partial unique index)
// - price_sol must be > 0
export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const body = await req.json()
  const { card_holding_id, price_sol } = body

  if (!card_holding_id) return errorResponse('card_holding_id is required')
  if (!price_sol || typeof price_sol !== 'number' || price_sol <= 0) {
    return errorResponse('price_sol must be a positive number')
  }
  if (price_sol < 0.000000001) return errorResponse('price_sol below minimum precision')

  // Verify caller owns the holding
  const { data: holding } = await supabaseAdmin
    .from('card_holdings')
    .select('id, owner_agent_id, skill_access_active')
    .eq('id', card_holding_id)
    .single()

  if (!holding) return errorResponse('Card holding not found', 404)
  if (holding.owner_agent_id !== auth.agentId) return errorResponse('Forbidden', 403)
  if (!holding.skill_access_active) return errorResponse('Holding is not active', 400)

  // Create listing (partial unique index enforces max 1 active per holding)
  const { data: listing, error: insertError } = await supabaseAdmin
    .from('secondary_listings')
    .insert({
      card_holding_id,
      seller_agent_id: auth.agentId,
      price_sol,
      is_active: true,
    })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      return errorResponse('This card already has an active listing. Cancel it first.', 409)
    }
    return errorResponse('Failed to create listing', 500)
  }

  return successResponse(listing, 201)
}
