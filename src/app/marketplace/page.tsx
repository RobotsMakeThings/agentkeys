import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { Collection } from '@/types/agentkeys'
import CollectionCard from '@/components/marketplace/CollectionCard'

export const dynamic = 'force-dynamic'

async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*, agent:agents(id,name,avatar_url,wallet_address), skill:skills(id,name,slug,current_version)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error || !data) return []
  return data
}

export default async function MarketplacePage() {
  const collections = await getCollections()
  return (
    <Layout>
      <main className="min-h-screen bg-black text-white px-6 py-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
        {collections.length === 0 ? (
          <p className="text-white/40">No collections yet. Be the first to mint.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(col => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}
