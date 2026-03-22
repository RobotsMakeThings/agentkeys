import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'
import { validateProviderUrl } from '@/lib/verification'
import { VerificationProvider, VerifiedProvider } from '@/types/agentkeys'

const VALID_PROVIDERS: VerificationProvider[] = ['github', 'x', 'modelbook']

export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const body = await req.json()
  const { provider, profile_url } = body

  // Validate provider
  if (!provider || !VALID_PROVIDERS.includes(provider as VerificationProvider)) {
    return errorResponse('provider must be one of: github, x, modelbook')
  }

  // Validate URL format
  const urlValidation = validateProviderUrl(provider as VerificationProvider, profile_url)
  if (!urlValidation.valid) {
    return errorResponse(urlValidation.error ?? 'Invalid profile_url', 400)
  }

  const normalizedUrl = profile_url.trim()
  const now = new Date().toISOString()

  // Upsert submission record (UNIQUE on agent_id + provider)
  const { data: submission, error: submissionError } = await supabaseAdmin
    .from('verification_submissions')
    .upsert(
      {
        agent_id: auth.agentId,
        provider,
        profile_url: normalizedUrl,
        status: 'approved',  // MVP: auto-approve valid URLs
        reviewed_at: now,
        reviewer_notes: 'Auto-approved: valid URL pattern',
      },
      { onConflict: 'agent_id,provider' }
    )
    .select()
    .single()

  if (submissionError || !submission) {
    return errorResponse('Failed to record verification submission', 500)
  }

  // Fetch current agent state
  const { data: agent, error: agentFetchError } = await supabaseAdmin
    .from('agents')
    .select('id, verification_status, verified_providers, verified_at')
    .eq('id', auth.agentId)
    .single()

  if (agentFetchError || !agent) {
    return errorResponse('Agent not found', 404)
  }

  // Build updated verified_providers array
  const existingProviders: VerifiedProvider[] = agent.verified_providers ?? []
  const filteredProviders = existingProviders.filter((p: VerifiedProvider) => p.provider !== provider)
  const updatedProviders: VerifiedProvider[] = [
    ...filteredProviders,
    {
      provider: provider as VerificationProvider,
      profile_url: normalizedUrl,
      verified_at: now,
    },
  ]

  // Set verified_at only if this is the first verification
  const verifiedAt = agent.verified_at ?? now

  // Update agents table
  const { data: updatedAgent, error: updateError } = await supabaseAdmin
    .from('agents')
    .update({
      verification_status: 'verified',
      verified_providers: updatedProviders,
      verified_at: verifiedAt,
    })
    .eq('id', auth.agentId)
    .select()
    .single()

  if (updateError || !updatedAgent) {
    return errorResponse('Failed to update verification status', 500)
  }

  return successResponse(
    {
      agent: updatedAgent,
      submission,
      message: `Verification approved. Welcome to the verified creator network.`,
    },
    200
  )
}
