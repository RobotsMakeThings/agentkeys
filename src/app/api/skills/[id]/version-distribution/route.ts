import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

interface VersionBucket {
  version: number
  change_type: string
  holder_count: number
  percentage: number
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Verify caller owns this skill (creator-only endpoint)
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, current_version, agent_id')
    .eq('id', params.id)
    .eq('agent_id', auth.agentId)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found or unauthorized', 404)

  // Find all collections for this skill
  const { data: collections } = await supabaseAdmin
    .from('collections')
    .select('id')
    .eq('skill_id', params.id)

  const collectionIds = (collections ?? []).map((c: { id: string }) => c.id)

  if (collectionIds.length === 0) {
    return successResponse([])
  }

  // Fetch all active holdings with their active_version
  const { data: holdings, error: holdingsError } = await supabaseAdmin
    .from('card_holdings')
    .select('owner_agent_id, active_version')
    .eq('skill_access_active', true)
    .in('collection_id', collectionIds)

  if (holdingsError) return errorResponse('Failed to fetch holdings', 500)

  if (!holdings || holdings.length === 0) {
    return successResponse([])
  }

  // Deduplicate: one agent may hold multiple cards
  const agentVersionMap = new Map<string, number | null>()
  for (const h of holdings) {
    if (!agentVersionMap.has(h.owner_agent_id)) {
      agentVersionMap.set(h.owner_agent_id, h.active_version)
    }
  }

  const totalHolders = agentVersionMap.size

  // Group by resolved version
  // NULL active_version → counts as current_version (following latest)
  const versionCounts = new Map<number, number>()
  Array.from(agentVersionMap.values()).forEach((activeVersion) => {
    const resolved = activeVersion ?? skill.current_version
    versionCounts.set(resolved, (versionCounts.get(resolved) ?? 0) + 1)
  })

  // Fetch change_type for each version present
  const versionNumbers = Array.from(versionCounts.keys()) as number[]

  const { data: versionRows } = await supabaseAdmin
    .from('skill_versions')
    .select('version, change_type')
    .eq('skill_id', params.id)
    .in('version', versionNumbers)

  const changeTypeByVersion = new Map<number, string>(
    (versionRows ?? []).map((r: { version: number; change_type: string }) => [r.version, r.change_type])
  )

  // Build response, sorted by version descending
  const result: VersionBucket[] = (Array.from(versionCounts.entries()) as [number, number][])
    .sort((a, b) => b[0] - a[0])
    .map(([version, holder_count]) => ({
      version,
      change_type: changeTypeByVersion.get(version) ?? 'unknown',
      holder_count,
      percentage: totalHolders > 0 ? Math.round((holder_count / totalHolders) * 1000) / 10 : 0,
    }))

  return successResponse(result)
}
