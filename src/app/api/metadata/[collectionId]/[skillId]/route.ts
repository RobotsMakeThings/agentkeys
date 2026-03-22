import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { collectionId: string; skillId: string } }
) {
  const { data: collection } = await supabaseAdmin
    .from('collections')
    .select('*, skills(name, slug, current_version)')
    .eq('id', params.collectionId)
    .single()

  if (!collection) {
    return new Response('Not found', { status: 404 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agentkeys.vercel.app'

  const metadata = {
    name: collection.name,
    symbol: 'AK',
    description: `AgentKeys skill card for ${collection.skills?.name ?? 'Unknown Skill'}. Holding this card grants API access to the skill.`,
    image: `${baseUrl}/images/card-nova.webp`, // TODO: per-collection card art
    external_url: `${baseUrl}/marketplace`,
    attributes: [
      { trait_type: 'Collection ID', value: collection.id },
      { trait_type: 'Skill ID', value: collection.skill_id },
      { trait_type: 'Skill Name', value: collection.skills?.name ?? 'Unknown' },
      { trait_type: 'Version', value: collection.skills?.current_version ?? 1 },
      { trait_type: 'Max Supply', value: collection.max_supply },
      { trait_type: 'Network', value: process.env.SOLANA_NETWORK ?? 'devnet' },
    ],
    properties: {
      files: [{ uri: `${baseUrl}/images/card-nova.webp`, type: 'image/webp' }],
      category: 'image',
    },
  }

  return new Response(JSON.stringify(metadata), {
    headers: { 'Content-Type': 'application/json' },
  })
}
