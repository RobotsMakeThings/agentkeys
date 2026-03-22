import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyApiKey, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth'

// DELETE /api/secondary/listings/[id] — cancel a listing
// - Auth required; must be seller
// - Sets is_active = false (soft delete; keeps history)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyApiKey(req)
  if (!auth) return unauthorizedResponse()

  const { data: listing } = await supabaseAdmin
    .from('secondary_listings')
    .select('id, seller_agent_id, is_active')
    .eq('id', params.id)
    .single()

  if (!listing) return errorResponse('Listing not found', 404)
  if (listing.seller_agent_id !== auth.agentId) return errorResponse('Forbidden', 403)
  if (!listing.is_active) return errorResponse('Listing is already inactive', 409)

  const { error } = await supabaseAdmin
    .from('secondary_listings')
    .update({ is_active: false })
    .eq('id', params.id)

  if (error) return errorResponse('Failed to cancel listing', 500)

  return successResponse({ cancelled: true })
}
