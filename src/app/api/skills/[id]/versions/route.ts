import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Fetch the skill to confirm existence
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, agent_id')
    .eq('id', params.id)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found', 404)

  // Auth check: must be creator OR active holder to view version history
  let canAccess = skill.agent_id === auth.agentId

  if (!canAccess) {
    const { data: collections } = await supabaseAdmin
      .from('collections')
      .select('id')
      .eq('skill_id', params.id)

    const collectionIds = (collections ?? []).map((c: { id: string }) => c.id)

    if (collectionIds.length > 0) {
      const { data: holding } = await supabaseAdmin
        .from('card_holdings')
        .select('id')
        .eq('owner_agent_id', auth.agentId)
        .eq('skill_access_active', true)
        .in('collection_id', collectionIds)
        .single()

      canAccess = !!holding
    }
  }

  if (!canAccess) return errorResponse('Access denied', 403)

  const { data: versions, error: versionsError } = await supabaseAdmin
    .from('skill_versions')
    .select('id, skill_id, version, content_md, changelog, published_at, change_type')
    .eq('skill_id', params.id)
    .order('version', { ascending: false })

  if (versionsError) return errorResponse('Failed to fetch version history', 500)

  return successResponse(versions ?? [])
}
