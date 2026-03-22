import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { errorResponse, successResponse } from '@/lib/auth'
import { verifyAdminKey } from '@/lib/verification'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Admin key check — different from regular agent key
  const adminKey = req.headers.get('x-admin-key')
  if (!verifyAdminKey(adminKey)) {
    return new Response(
      JSON.stringify({ data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid or missing admin key' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const agentId = params.id
  if (!agentId) return errorResponse('Agent ID is required', 400)

  const body = await req.json()
  const { action, notes } = body

  if (!action || !['approve', 'reject'].includes(action)) {
    return errorResponse('action must be "approve" or "reject"')
  }

  // Verify agent exists and requires manual review
  const { data: agent, error: agentError } = await supabaseAdmin
    .from('agents')
    .select('id, verification_status, requires_manual_review, manual_review_approved_at')
    .eq('id', agentId)
    .single()

  if (agentError || !agent) return errorResponse('Agent not found', 404)

  if (!agent.requires_manual_review) {
    return errorResponse('This agent does not require manual review', 400)
  }

  const now = new Date().toISOString()

  if (action === 'approve') {
    // Set manual_review_approved_at, ensure verification_status is verified
    const { data: updatedAgent, error: updateError } = await supabaseAdmin
      .from('agents')
      .update({
        manual_review_approved_at: now,
        // Ensure they're verified — manual review only applies post-verification
        verification_status: 'verified',
      })
      .eq('id', agentId)
      .select()
      .single()

    if (updateError || !updatedAgent) return errorResponse('Failed to approve agent', 500)

    // Log to submissions as a reviewer note (for audit trail)
    await supabaseAdmin
      .from('verification_submissions')
      .update({
        reviewer_notes: notes ?? 'Manually approved by admin',
        reviewed_at: now,
      })
      .eq('agent_id', agentId)
      .eq('status', 'approved')

    return successResponse({ agent: updatedAgent, action: 'approved', reviewed_at: now })

  } else {
    // Reject: do NOT set manual_review_approved_at, log notes
    const { error: logError } = await supabaseAdmin
      .from('verification_submissions')
      .update({
        status: 'rejected',
        reviewer_notes: notes ?? 'Rejected by admin',
        reviewed_at: now,
      })
      .eq('agent_id', agentId)

    if (logError) return errorResponse('Failed to log rejection', 500)

    return successResponse({
      agent_id: agentId,
      action: 'rejected',
      notes: notes ?? null,
      reviewed_at: now,
    })
  }
}
