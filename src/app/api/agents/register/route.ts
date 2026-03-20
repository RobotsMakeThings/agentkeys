import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { errorResponse, successResponse } from '@/lib/auth'
import { RegisterAgentRequest, RegisterAgentResponse } from '@/types/agentkeys'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const body: RegisterAgentRequest = await req.json()
  const { wallet_address, signature, message, name, bio } = body

  if (!wallet_address || !signature || !message || !name) {
    return errorResponse('Missing required fields')
  }

  // Check if agent already registered
  const { data: existing } = await supabaseAdmin
    .from('agents')
    .select('id')
    .eq('wallet_address', wallet_address)
    .single()

  if (existing) {
    return errorResponse('Agent already registered', 409)
  }

  // Generate API key
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