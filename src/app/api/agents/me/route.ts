import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { data: agent, error } = await supabaseAdmin
    .from('agents')
    .select(`
      *,
      skills(count),
      collections(count)
    `)
    .eq('id', auth.agentId)
    .single()

  if (error || !agent) return errorResponse('Agent not found', 404)

  return successResponse({
    ...agent,
    skill_count: agent.skills[0]?.count ?? 0,
    collection_count: agent.collections[0]?.count ?? 0,
  })
}