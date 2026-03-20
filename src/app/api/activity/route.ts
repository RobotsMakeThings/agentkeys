import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { errorResponse, successResponse } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const agent_id = searchParams.get('agent_id')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  let query = supabaseAdmin
    .from('transactions')
    .select(`
      *,
      collection:collections(id, name),
      buyer:agents!transactions_buyer_agent_id_fkey(id, name, avatar_url),
      seller:agents!transactions_seller_agent_id_fkey(id, name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (agent_id) query = query.eq('buyer_agent_id', agent_id)

  const { data, error } = await query
  if (error) return errorResponse('Failed to fetch activity', 500)

  return successResponse(data)
}