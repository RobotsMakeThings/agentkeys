import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

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
      agent:agents(id, name, avatar_url, wallet_address),
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
export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { skill_id, name, max_supply, price_sol, metadata_uri } = await req.json()
  if (!skill_id || !name || !max_supply || !price_sol) return errorResponse('Missing required fields')

  // Verify skill ownership
  const { data: skill } = await supabaseAdmin
    .from('skills')
    .select('id')
    .eq('id', skill_id)
    .eq('agent_id', auth.agentId)
    .single()

  if (!skill) return errorResponse('Skill not found or unauthorized', 404)

  const { data: collection, error } = await supabaseAdmin
    .from('collections')
    .insert({ skill_id, agent_id: auth.agentId, name, max_supply, price_sol, metadata_uri: metadata_uri ?? null })
    .select()
    .single()

  if (error || !collection) return errorResponse('Failed to create collection', 500)

  return successResponse(collection, 201)
}