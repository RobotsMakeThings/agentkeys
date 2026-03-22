export const runtime = 'nodejs' // Required: Metaplex Umi uses Node.js APIs, not compatible with Edge runtime

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import {
  verifyTransaction,
  getWalletBalance,
  mintNFT,
  NFTMetadata,
} from '@/lib/solana'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // 1. Verify agent API key
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { tx_signature } = await req.json()

  // Note: nft_mint_address is NO LONGER accepted from the client.
  // The server generates it during minting. This is a security fix.
  if (!tx_signature) return errorResponse('Missing tx_signature')

  // 2. Fetch collection details
  const { data: collection, error: collectionError } = await supabaseAdmin
    .from('collections')
    .select('id, max_supply, minted_count, price_sol, agent_id, is_active, name, skill_id')
    .eq('id', params.id)
    .single()

  if (collectionError || !collection) return errorResponse('Collection not found', 404)
  if (!collection.is_active) return errorResponse('Collection is not active', 400)
  if (collection.minted_count >= collection.max_supply) return errorResponse('Collection is sold out', 400)

  // 3. Check for duplicate transaction (idempotency / replay prevention)
  const { data: existingTx } = await supabaseAdmin
    .from('transactions')
    .select('id')
    .eq('tx_signature', tx_signature)
    .single()

  if (existingTx) {
    return errorResponse('Transaction already used for a purchase', 409)
  }

  // 4. Check for duplicate holding (this agent already owns a card from this collection)
  // By design, an agent can only hold one card per collection.
  // If multiple purchases per collection are desired in future, remove this check.
  const { data: existingHolding } = await supabaseAdmin
    .from('card_holdings')
    .select('id')
    .eq('collection_id', params.id)
    .eq('owner_agent_id', auth.agentId)
    .single()

  if (existingHolding) {
    return errorResponse('Agent already holds a card from this collection', 409)
  }

  // 5. Fetch the buying agent's wallet address
  const { data: buyerAgent, error: agentError } = await supabaseAdmin
    .from('agents')
    .select('id, wallet_address')
    .eq('id', auth.agentId)
    .single()

  if (agentError || !buyerAgent) return errorResponse('Agent not found', 404)

  // 5b. Pre-flight balance check: ensure agent wallet has enough SOL for fees + purchase
  // Minimum ~0.01 SOL covers network fees; actual purchase amount is verified on-chain below.
  const MIN_BALANCE_SOL = collection.price_sol + 0.01
  const balanceCheck = await getWalletBalance(buyerAgent.wallet_address, MIN_BALANCE_SOL)
  if (!balanceCheck.sufficient) {
    return errorResponse(
      `Insufficient balance: need ${MIN_BALANCE_SOL} SOL, have ${balanceCheck.balanceSol} SOL`,
      402
    )
  }

  // 6. Verify the on-chain transaction
  const platformWallet = process.env.PLATFORM_WALLET_ADDRESS
  if (!platformWallet) {
    console.error('PLATFORM_WALLET_ADDRESS not configured')
    return errorResponse('Server configuration error', 500)
  }

  const txVerification = await verifyTransaction(
    tx_signature,
    collection.price_sol,
    platformWallet
  )

  if (!txVerification.valid) {
    return errorResponse(`Transaction verification failed: ${txVerification.error}`, 400)
  }

  // 7. Fetch skill details for NFT metadata
  const { data: skill } = await supabaseAdmin
    .from('skills')
    .select('name, slug, current_version')
    .eq('id', collection.skill_id)
    .single()

  // 8. Mint the NFT to the buyer's wallet
  const nftMetadata: NFTMetadata = {
    name: `${collection.name} #${collection.minted_count + 1}`,
    symbol: 'AK',
    description: `AgentKeys skill card for ${skill?.name ?? 'Unknown Skill'}. Grants access to skill capabilities.`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/card-image/${collection.id}`,
    attributes: [
      { trait_type: 'Collection', value: collection.name },
      { trait_type: 'Collection ID', value: collection.id },
      { trait_type: 'Skill ID', value: collection.skill_id },
      { trait_type: 'Skill Name', value: skill?.name ?? 'Unknown' },
      { trait_type: 'Version', value: skill?.current_version ?? 1 },
      { trait_type: 'Serial', value: collection.minted_count + 1 },
      { trait_type: 'Network', value: process.env.SOLANA_NETWORK ?? 'devnet' },
    ],
  }

  const mintResult = await mintNFT(
    buyerAgent.wallet_address,
    collection.id,
    collection.skill_id,
    nftMetadata
  )

  if (!mintResult.success || !mintResult.mintAddress) {
    console.error('NFT minting failed:', mintResult.error)
    return errorResponse(`NFT minting failed: ${mintResult.error}`, 500)
  }

  // 9. Create card holding with server-generated mint address
  const { data: holding, error: holdingError } = await supabaseAdmin
    .from('card_holdings')
    .insert({
      collection_id: params.id,
      owner_agent_id: auth.agentId,
      nft_mint_address: mintResult.mintAddress, // server-generated, not client-supplied
      skill_access_active: true,
    })
    .select()
    .single()

  if (holdingError || !holding) {
    // NFT was minted but DB write failed — log for manual recovery
    console.error('CRITICAL: NFT minted but holding not created', {
      mintAddress: mintResult.mintAddress,
      agentId: auth.agentId,
      collectionId: params.id,
    })
    return errorResponse('Failed to create holding record', 500)
  }

  // 10. Increment minted_count atomically
  // Use RPC function if available; otherwise increment (race condition possible at high volume)
  await supabaseAdmin
    .from('collections')
    .update({ minted_count: collection.minted_count + 1 })
    .eq('id', params.id)

  // 11. Record transaction
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

  return successResponse({
    ...holding,
    nft_mint_address: mintResult.mintAddress,
    mint_tx_signature: mintResult.txSignature,
  }, 201)
}
