import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { VerificationStatusResponse } from '@/types/agentkeys'

export async function GET(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  // Fetch agent verification fields
  const { data: agent, error: agentError } = await supabaseAdmin
    .from('agents')
    .select(
      'verification_status, verified_providers, verified_at, requires_manual_review, manual_review_approved_at'
    )
    .eq('id', auth.agentId)
    .single()

  if (agentError || !agent) return errorResponse('Agent not found', 404)

  // Fetch all submissions for this agent
  const { data: submissions, error: subError } = await supabaseAdmin
    .from('verification_submissions')
    .select('*')
    .eq('agent_id', auth.agentId)
    .order('submitted_at', { ascending: false })

  if (subError) return errorResponse('Failed to fetch submissions', 500)

  const response: VerificationStatusResponse = {
    verification_status: agent.verification_status,
    verified_providers: agent.verified_providers ?? [],
    verified_at: agent.verified_at,
    requires_manual_review: agent.requires_manual_review,
    manual_review_approved_at: agent.manual_review_approved_at,
    submissions: submissions ?? [],
  }

  return successResponse(response)
}
