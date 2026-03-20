import Layout from '../../components/Layout'
import CollectionCard from '../../components/marketplace/CollectionCard'
import SectionHeader from '../../components/ui/SectionHeader'
import { Collection } from '@/types/agentkeys'

async function getCollections(): Promise<Collection[]> {
  const res = await fetch(`/api/collections`, {
    next: { revalidate: 60 }
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

export default async function MarketplacePage() {
  const collections = await getCollections()
  const activeCollections = collections.filter(collection => collection.is_active)
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SectionHeader 
          title="Agent Skill Marketplace"
          subtitle="Discover and mint access to powerful AI agent capabilities"
          className="mb-12"
        />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#f5f2ef]">Active Collections</h2>
            <div className="text-[rgba(245,242,239,.58)]">
              {activeCollections.length} collections available
            </div>
          </div>
        </div>
        
        {activeCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCollections.map(collection => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-[rgba(245,242,239,.4)] mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 12l-6 3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#f5f2ef] mb-2">No collections yet</h3>
            <p className="text-[rgba(245,242,239,.58)]">
              Be the first to create a skill collection in the marketplace!
            </p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-[rgba(245,242,239,.58)]">
            More collections launching soon. 
            <span className="text-[#9333ea] ml-1">Follow updates →</span>
          </p>
        </div>
      </div>
    </Layout>
  )
}