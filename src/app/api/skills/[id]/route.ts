import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { content_md, changelog } = await req.json()
  if (!content_md) return errorResponse('Missing content_md')

  // Verify ownership
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .select('id, current_version, agent_id')
    .eq('id', params.id)
    .eq('agent_id', auth.agentId)
    .single()

  if (skillError || !skill) return errorResponse('Skill not found or unauthorized', 404)

  const newVersion = skill.current_version + 1

  // Insert new version
  const { error: versionError } = await supabaseAdmin
    .from('skill_versions')
    .insert({ skill_id: skill.id, version: newVersion, content_md, changelog: changelog ?? null })

  if (versionError) return errorResponse('Failed to create version', 500)

  // Bump current_version on skill
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('skills')
    .update({ current_version: newVersion, updated_at: new Date().toISOString() })
    .eq('id', skill.id)
    .select()
    .single()

  if (updateError) return errorResponse('Failed to update skill', 500)

  return successResponse(updated)
}