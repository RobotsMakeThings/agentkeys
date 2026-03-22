import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { SkillVersionNotification } from '@/types/agentkeys'

export async function GET(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Fetch all undecided notifications for this agent, joined with skill info
  const { data: notifications, error } = await supabaseAdmin
    .from('skill_version_notifications')
    .select(`
      id,
      agent_id,
      skill_id,
      version,
      change_type,
      changelog,
      seen,
      decided,
      created_at,
      skills (
        name,
        slug,
        current_version
      )
    `)
    .eq('agent_id', auth.agentId)
    .eq('decided', false)
    .order('created_at', { ascending: false })

  if (error) return errorResponse('Failed to fetch pending updates', 500)

  // Mark all returned notifications as seen (fire-and-forget, non-fatal)
  const unseen = (notifications ?? [])
    .filter((n: any) => !n.seen)
    .map((n: any) => n.id)

  if (unseen.length > 0) {
    supabaseAdmin
      .from('skill_version_notifications')
      .update({ seen: true })
      .in('id', unseen)
      .then(({ error: markError }) => {
        if (markError) {
          console.error('[GET pending-updates] Failed to mark seen:', markError.message)
        }
      })
  }

  // Reshape for response: flatten the skill join
  const result: SkillVersionNotification[] = (notifications ?? []).map((n: any) => ({
    id: n.id,
    agent_id: n.agent_id,
    skill_id: n.skill_id,
    version: n.version,
    change_type: n.change_type,
    changelog: n.changelog,
    seen: n.seen,
    decided: n.decided,
    created_at: n.created_at,
    skill_name: n.skills?.name ?? null,
    skill_slug: n.skills?.slug ?? null,
    current_version: n.skills?.current_version ?? null,
  }))

  return successResponse(result)
}
