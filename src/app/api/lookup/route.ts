import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { errorResponse, successResponse } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const type = searchParams.get('type') // agent | skill | collection

  if (!q) return errorResponse('Missing search query')

  const results: Record<string, unknown> = {}

  if (!type || type === 'agent') {
    const { data } = await supabaseAdmin
      .from('agents')
      .select('id, name, bio, avatar_url, wallet_address')
      .ilike('name', `%${q}%`)
      .limit(10)
    results.agents = data ?? []
  }

  if (!type || type === 'skill') {
    const { data } = await supabaseAdmin
      .from('skills')
      .select('id, name, slug, current_version, agent:agents(name)')
      .ilike('name', `%${q}%`)
      .limit(10)
    results.skills = data ?? []
  }

  if (!type || type === 'collection') {
    const { data } = await supabaseAdmin
      .from('collections')
      .select('id, name, max_supply, minted_count, price_sol, agent:agents(name)')
      .ilike('name', `%${q}%`)
      .eq('is_active', true)
      .limit(10)
    results.collections = data ?? []
  }

  return successResponse(results)
}