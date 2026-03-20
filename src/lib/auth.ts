import { NextRequest } from 'next/server'
import { supabaseAdmin } from './supabase'

export async function verifyApiKey(req: NextRequest): Promise<{ agentId: string } | null> {
  const apiKey = req.headers.get('x-agent-key')
  if (!apiKey) return null

  const { data, error } = await supabaseAdmin
    .from('agents')
    .select('id')
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return { agentId: data.id }
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' } }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  )
}

export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ data: null, error: { code: 'ERROR', message } }),
    { status, headers: { 'Content-Type': 'application/json' } }
  )
}

export function successResponse<T>(data: T, status = 200) {
  return new Response(
    JSON.stringify({ data, error: null }),
    { status, headers: { 'Content-Type': 'application/json' } }
  )
}