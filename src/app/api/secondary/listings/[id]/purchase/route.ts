export const runtime = 'nodejs'  // Metaplex Umi requires Node.js

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { verifyTransaction } from '@/lib/solana'
import { PLATFORM_FEE_RATE, CREATOR_ROYALTY_RATE } from '@/types/agentkeys'

// POST /api/secondary/listings/[id]/purchase — buy a card from secondary market
// Body: { tx_signature: string }
//
// Fee distribution:
//   price_sol × 5%  → platform wallet (PLATFORM_WALLET_ADDRESS)
//   price_sol × 5%  → creator wallet (skill_set.creator_agent.wallet_address)
//   price_sol × 90% → seller wallet
//
// For MVP: Verify that price_sol went to platform wallet. Platform distributes
// seller and creator shares server-side via a funded platform hot wallet.
// TODO v2: Move to on-chain program that distributes splits atomically.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const body = await req.json()
  const { tx_signature } = body

  if (!tx_signature) return errorResponse('tx_signature is required')

  // --- Step 1: Fetch and validate listing ---
  const { data: listing } = await supabaseAdmin
    .from('secondary_listings')
    .select(`
      id, card_holding_id, seller_agent_id, price_sol, is_active, created_at,
      holding:card_holdings!card_holding_id(
        id, owner_agent_id, collection_id, skill_set_id, skill_access_active
      )
    `)
    .eq('id', params.id)
    .single()

  if (!listing) return errorResponse('Listing not found', 404)
  if (!listing.is_active) return errorResponse('Listing is no longer active', 410)

  // Buyer cannot buy their own listing
  if (listing.seller_agent_id === auth.agentId) {
    return errorResponse('Cannot purchase your own listing', 400)
  }

  // Verify holding is still owned by seller (race condition guard)
  const holding = listing.holding as any
  if (!holding || holding.owner_agent_id !== listing.seller_agent_id) {
    return errorResponse('Listing is stale — holding no longer owned by seller', 409)
  }

  // --- Step 2: Duplicate transaction check ---
  const { data: existingTx } = await supabaseAdmin
    .from('transactions')
    .select('id')
    .eq('tx_signature', tx_signature)
    .single()

  if (existingTx) return errorResponse('Transaction already used for a purchase', 409)

  // --- Step 3: Verify on-chain transaction ---
  const platformWallet = process.env.PLATFORM_WALLET_ADDRESS
  if (!platformWallet) {
    console.error('PLATFORM_WALLET_ADDRESS not configured')
    return errorResponse('Server configuration error', 500)
  }

  const txVerification = await verifyTransaction(
    tx_signature,
    listing.price_sol,
    platformWallet
  )

  if (!txVerification.valid) {
    return errorResponse(`Transaction verification failed: ${txVerification.error}`, 400)
  }

  // --- Step 4: Compute fee splits ---
  const price = parseFloat(listing.price_sol.toString())
  const platform_fee_sol = parseFloat((price * PLATFORM_FEE_RATE).toFixed(9))
  const creator_royalty_sol = parseFloat((price * CREATOR_ROYALTY_RATE).toFixed(9))

  // --- Step 5: Fetch creator wallet for royalty distribution ---
  // Only needed for secondary distribution; log if missing (don't block purchase)
  if (holding.skill_set_id) {
    const { data: skillSet } = await supabaseAdmin
      .from('skill_sets')
      .select('creator_agent_id, creator:agents!creator_agent_id(wallet_address)')
      .eq('id', holding.skill_set_id)
      .single()

    if (skillSet) {
      const creatorWallet = (skillSet as any).creator?.wallet_address
      // TODO v2: trigger on-chain creator royalty transfer here
      // For MVP: platform handles distribution off-band; log for reconciliation
      console.log('[SECONDARY-PURCHASE] Creator royalty', {
        creator_agent_id: skillSet.creator_agent_id,
        creator_wallet: creatorWallet,
        amount_sol: creator_royalty_sol,
        listing_id: listing.id,
      })
    }
  }

  // --- Step 6: Transfer holding ownership ---
  const { error: holdingUpdateError } = await supabaseAdmin
    .from('card_holdings')
    .update({
      owner_agent_id: auth.agentId,
      acquired_via: 'secondary',
      acquired_at: new Date().toISOString(),
    })
    .eq('id', holding.id)

  if (holdingUpdateError) {
    console.error('CRITICAL: Payment verified but holding transfer failed', {
      tx_signature, listing_id: listing.id, buyer: auth.agentId,
    })
    return errorResponse('Failed to transfer holding — contact support', 500)
  }

  // --- Step 7: Initialize holding_skill_versions for buyer (clean slate) ---
  if (holding.skill_set_id) {
    const { data: members } = await supabaseAdmin
      .from('skill_set_members')
      .select('skill_id')
      .eq('skill_set_id', holding.skill_set_id)

    if (members && members.length > 0) {
      // Delete any existing entries for this holding (from previous owner)
      await supabaseAdmin
        .from('holding_skill_versions')
        .delete()
        .eq('card_holding_id', holding.id)

      // Insert fresh entries for new owner (active_version = NULL = follow latest)
      const versionRows = members.map((m: any) => ({
        card_holding_id: holding.id,
        skill_id: m.skill_id,
        active_version: null,
      }))

      const { error: versionInsertError } = await supabaseAdmin
        .from('holding_skill_versions')
        .insert(versionRows)

      if (versionInsertError) {
        console.error('Failed to initialize holding_skill_versions for secondary buyer', {
          holding_id: holding.id, buyer: auth.agentId, error: versionInsertError,
        })
        // Non-fatal: holding transfer already succeeded; log and continue
      }
    }
  }

  // --- Step 8: Mark listing inactive ---
  await supabaseAdmin
    .from('secondary_listings')
    .update({ is_active: false })
    .eq('id', listing.id)

  // --- Step 9: Record transaction ---
  const { data: txRecord, error: txError } = await supabaseAdmin
    .from('transactions')
    .insert({
      collection_id: holding.collection_id,
      buyer_agent_id: auth.agentId,
      seller_agent_id: listing.seller_agent_id,
      tx_signature,
      price_sol: listing.price_sol,
      platform_fee_sol,
      creator_royalty_sol,
      listing_id: listing.id,
      type: 'sale',
    })
    .select()
    .single()

  if (txError) {
    console.error('Transaction record failed (non-fatal)', { tx_signature, error: txError })
  }

  // --- Step 10: Return updated holding ---
  const { data: updatedHolding } = await supabaseAdmin
    .from('card_holdings')
    .select(`
      *,
      collection:collections(*),
      skill_set:skill_sets(*, members:skill_set_members(*, skill:skills(*)))
    `)
    .eq('id', holding.id)
    .single()

  return successResponse({
    holding: updatedHolding,
    transaction: txRecord,
    fees: { platform_fee_sol, creator_royalty_sol },
  })
}
