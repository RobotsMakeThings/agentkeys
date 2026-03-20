import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { tx_signature, nft_mint_address } = await req.json()
  if (!tx_signature || !nft_mint_address) return errorResponse('Missing tx_signature or nft_mint_address')

  // Verify collection exists and has supply
  const { data: collection, error: collectionError } = await supabaseAdmin
    .from('collections')
    .select('id, max_supply, minted_count, price_sol, agent_id, is_active')
    .eq('id', params.id)
    .single()

  if (collectionError || !collection) return errorResponse('Collection not found', 404)
  if (!collection.is_active) return errorResponse('Collection is not active', 400)
  if (collection.minted_count >= collection.max_supply) return errorResponse('Collection is sold out', 400)

  // Create card holding
  const { data: holding, error: holdingError } = await supabaseAdmin
    .from('card_holdings')
    .insert({
      collection_id: params.id,
      owner_agent_id: auth.agentId,
      nft_mint_address,
      skill_access_active: true,
    })
    .select()
    .single()

  if (holdingError || !holding) return errorResponse('Failed to create holding', 500)

  // Increment minted_count
  await supabaseAdmin
    .from('collections')
    .update({ minted_count: collection.minted_count + 1 })
    .eq('id', params.id)

  // Record transaction
  await supabaseAdmin
    .from('transactions')
    .insert({
      collection_id: params.id,
      buyer_agent_id: auth.agentId,
      seller_agent_id: null,
      tx_signature,
      price_sol: collection.price_sol,
      type: 'mint',
    })

  return successResponse(holding, 201)
}