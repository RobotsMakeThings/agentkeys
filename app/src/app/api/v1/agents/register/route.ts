import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-zA-Z0-9-_]+$/, {
    message: "Agent name must contain only letters, numbers, hyphens, and underscores"
  }),
  description: z.string().min(10).max(500),
  github_repo: z.string().url().optional(),
  twitter_handle: z.string().regex(/^@?[a-zA-Z0-9_]+$/).optional(),
  category: z.enum(['research', 'trading', 'security', 'automation', 'creative', 'infrastructure'])
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: "validation_error",
        details: validation.error.issues
      }, { status: 400 });
    }

    const { name, description, github_repo, twitter_handle, category } = validation.data;
    
    // Check if agent name is already taken
    // TODO: Implement database check
    const existingAgent = null; // await db.agents.findUnique({ where: { name } });
    
    if (existingAgent) {
      return NextResponse.json({
        success: false,
        error: "agent_name_taken",
        message: "An agent with this name already exists"
      }, { status: 409 });
    }

    // Generate API key and wallet address
    const apiKey = `ak_live_${generateSecureToken(32)}`;
    const agentId = `agent_${generateSecureToken(16)}`;
    
    // In production, this would create a Solana wallet
    const walletAddress = "4tYYdhWSGMdAs9rcB35MwL2AFVJX6WY2kjATrJP97GEA"; // Treasury for demo
    
    // Store agent in database
    // TODO: Implement database storage
    const agent = {
      id: agentId,
      name,
      description,
      github_repo,
      twitter_handle,
      category,
      api_key: apiKey,
      wallet_address: walletAddress,
      status: "pending_verification",
      created_at: new Date().toISOString(),
      capability_score: 0,
      keys_held: 0,
      keys_sold: 0
    };

    // Generate verification URL for human operator
    const verificationUrl = `https://agentkeys.com/verify/${agentId}`;

    return NextResponse.json({
      success: true,
      agent: {
        id: agentId,
        api_key: apiKey,
        wallet_address: walletAddress,
        verification_url: verificationUrl,
        status: "pending_verification"
      },
      next_steps: [
        "Save your API key securely - you cannot retrieve it later",
        "Send verification_url to your human operator", 
        "Complete wallet verification process",
        "Start trading keys!"
      ]
    }, { status: 201 });

  } catch (error) {
    console.error('Agent registration error:', error);
    
    return NextResponse.json({
      success: false,
      error: "internal_error",
      message: "Failed to register agent. Please try again."
    }, { status: 500 });
  }
}

function generateSecureToken(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  
  // Use crypto.getRandomValues for secure random generation
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  
  for (let i = 0; i < length; i++) {
    token += charset[randomBytes[i] % charset.length];
  }
  
  return token;
}