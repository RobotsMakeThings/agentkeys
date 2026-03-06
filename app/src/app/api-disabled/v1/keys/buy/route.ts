import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const buyKeysSchema = z.object({
  agent_id: z.string().min(1, "Agent ID is required"),
  amount: z.number().int().min(1).max(1000),
  max_price_sol: z.number().positive().optional(),
  priority: z.enum(['standard', 'high', 'urgent']).default('standard')
});

export async function POST(request: NextRequest) {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: "unauthorized",
        message: "Missing or invalid Authorization header"
      }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const body = await request.json();
    
    // Validate request body
    const validation = buyKeysSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: "validation_error",
        details: validation.error.issues
      }, { status: 400 });
    }

    const { agent_id, amount, max_price_sol, priority } = validation.data;
    
    // TODO: Validate buyer's API key and get buyer info
    const buyer = { 
      id: "agent_abc123", 
      wallet_address: "4tYYdhWSGMdAs9rcB35MwL2AFVJX6WY2kjATrJP97GEA",
      balance_sol: 100.0 
    };
    
    // TODO: Get target agent info and current key price
    const targetAgent = {
      id: agent_id,
      name: "ResearchOS",
      current_price_sol: 2.41,
      available_keys: 1000,
      market_cap_sol: 2990.0
    };

    if (!targetAgent) {
      return NextResponse.json({
        success: false,
        error: "agent_not_found",
        message: "Target agent not found"
      }, { status: 404 });
    }

    // Check if enough keys are available
    if (amount > targetAgent.available_keys) {
      return NextResponse.json({
        success: false,
        error: "insufficient_supply",
        message: `Only ${targetAgent.available_keys} keys available`,
        available_keys: targetAgent.available_keys
      }, { status: 400 });
    }

    // Calculate total cost (price + fees)
    const keyPrice = targetAgent.current_price_sol;
    const subtotal = keyPrice * amount;
    const platformFee = subtotal * 0.05; // 5% platform fee
    const creatorFee = subtotal * 0.02; // 2% creator fee
    const totalCost = subtotal + platformFee + creatorFee;

    // Check price limit if specified
    if (max_price_sol && keyPrice > max_price_sol) {
      return NextResponse.json({
        success: false,
        error: "price_too_high",
        message: `Current price ${keyPrice} SOL exceeds your max price ${max_price_sol} SOL`,
        current_price: keyPrice,
        max_price: max_price_sol
      }, { status: 400 });
    }

    // Check buyer's balance
    if (totalCost > buyer.balance_sol) {
      return NextResponse.json({
        success: false,
        error: "insufficient_balance",
        message: "Insufficient SOL balance for this purchase",
        required: totalCost,
        available: buyer.balance_sol
      }, { status: 400 });
    }

    // TODO: Execute the trade on Solana blockchain
    // 1. Create transaction
    // 2. Transfer SOL to smart contract
    // 3. Mint keys to buyer
    // 4. Distribute fees
    
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock successful transaction
    const transaction = {
      id: transactionId,
      type: "key_purchase",
      buyer_id: buyer.id,
      seller_agent_id: agent_id,
      amount,
      price_per_key: keyPrice,
      total_cost: totalCost,
      platform_fee: platformFee,
      creator_fee: creatorFee,
      priority,
      status: "completed",
      blockchain_tx: `https://solscan.io/tx/${transactionId}`,
      timestamp: new Date().toISOString()
    };

    // Calculate new access tier
    const newKeyCount = 15 + amount; // Assume buyer had 15 keys
    let accessTier = "Standard";
    if (newKeyCount >= 20) accessTier = "Enterprise";
    else if (newKeyCount >= 5) accessTier = "Premium";

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${amount} keys to ${targetAgent.name}! 🔑`,
      transaction,
      summary: {
        keys_purchased: amount,
        total_cost_sol: totalCost,
        new_access_tier: accessTier,
        new_total_keys: newKeyCount
      },
      access_unlocked: {
        hub_access: amount >= 1,
        premium_content: newKeyCount >= 10,
        priority_routing: newKeyCount >= 5,
        enterprise_features: newKeyCount >= 20
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Key purchase error:', error);
    
    return NextResponse.json({
      success: false,
      error: "internal_error",
      message: "Failed to process key purchase. Please try again."
    }, { status: 500 });
  }
}