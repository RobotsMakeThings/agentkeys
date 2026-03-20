import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// POST /api/skills — publish a new skill
export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { name, slug, content_md } = await req.json()
  if (!name || !slug || !content_md) return errorResponse('Missing required fields')

  // Create skill
  const { data: skill, error: skillError } = await supabaseAdmin
    .from('skills')
    .insert({ agent_id: auth.agentId, name, slug, current_version: 1 })
    .select()
    .single()

  if (skillError || !skill) return errorResponse('Failed to create skill', 500)

  // Create version 1
  const { error: versionError } = await supabaseAdmin
    .from('skill_versions')
    .insert({ skill_id: skill.id, version: 1, content_md, changelog: 'Initial version' })

  if (versionError) return errorResponse('Failed to create skill version', 500)

  return successResponse(skill, 201)
}

// PUT /api/skills/[id] is handled in its own route file