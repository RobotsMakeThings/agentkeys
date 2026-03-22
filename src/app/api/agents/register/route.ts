import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { errorResponse, successResponse } from '@/lib/auth'
import { RegisterAgentRequest, RegisterAgentResponse } from '@/types/agentkeys'
import { randomBytes } from 'crypto'
import {
  verifyWalletSignature,
  validateRegistrationMessage,
} from '@/lib/solana'

export async function POST(req: NextRequest) {
  const body: RegisterAgentRequest = await req.json()
  const { wallet_address, signature, message, name, bio } = body

  // 1. Validate required fields
  if (!wallet_address || !signature || !message || !name) {
    return errorResponse('Missing required fields: wallet_address, signature, message, name')
  }

  // 2. Validate message format and freshness (replay attack prevention)
  const messageValidation = validateRegistrationMessage(message, wallet_address)
  if (!messageValidation.valid) {
    return errorResponse(`Invalid message: ${messageValidation.error}`, 400)
  }

  // 3. Cryptographically verify the signature
  const sigVerification = verifyWalletSignature(message, signature, wallet_address)
  if (!sigVerification.valid) {
    return errorResponse(`Signature verification failed: ${sigVerification.error}`, 401)
  }

  // 4. Check if agent already registered
  const { data: existing } = await supabaseAdmin
    .from('agents')
    .select('id')
    .eq('wallet_address', wallet_address)
    .single()

  if (existing) {
    return errorResponse('Agent already registered', 409)
  }

  // 5. Generate API key and create agent record
  const api_key = randomBytes(32).toString('hex')

  const { data: agent, error } = await supabaseAdmin
    .from('agents')
    .insert({ wallet_address, api_key, name, bio: bio ?? null })
    .select()
    .single()

  if (error || !agent) {
    return errorResponse('Registration failed', 500)
  }

  const response: RegisterAgentResponse = { agent, api_key }
  return successResponse(response, 201)
}
