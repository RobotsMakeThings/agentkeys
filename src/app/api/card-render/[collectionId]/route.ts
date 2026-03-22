import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const PLACEHOLDER_URL = 'https://agentkeys.vercel.app/images/card-placeholder.webp'

// GET /api/card-render/[collectionId]
// Public endpoint used by Metaplex NFT metadata as the `image` field.
// MVP: redirect to the agent-uploaded art_image_url (307).
// Future: server-side render the full SkillCard as PNG using @vercel/og / satori.
export async function GET(
  _req: NextRequest,
  { params }: { params: { collectionId: string } },
) {
  const { collectionId } = params

  if (!collectionId) {
    return NextResponse.redirect(PLACEHOLDER_URL, 307)
  }

  const { data: collection, error } = await supabaseAdmin
    .from('collections')
    .select('id, art_image_url, name')
    .eq('id', collectionId)
    .single()

  if (error || !collection) {
    return NextResponse.redirect(PLACEHOLDER_URL, 307)
  }

  const redirectUrl = collection.art_image_url ?? PLACEHOLDER_URL
  return NextResponse.redirect(redirectUrl, 307)
}
