'use client'

import { useEffect, useState } from 'react'
import { SecondaryListing, RarityTier, BadgeState } from '@/types/agentkeys'
import AgentKeysBadge from '@/components/ui/AgentKeysBadge'
import { computeBadgeStateFull } from '@/lib/verification'
import SkillCard from '@/components/ui/SkillCard'

// Tier display config
const TIER_CONFIG: Record<RarityTier, { label: string; color: string; border: string }> = {
  basic:     { label: 'Basic',     color: 'text-gray-400',    border: 'border-gray-400' },
  uncommon:  { label: 'Uncommon',  color: 'text-green-400',   border: 'border-green-400' },
  rare:      { label: 'Rare',      color: 'text-blue-400',    border: 'border-blue-400' },
  epic:      { label: 'Epic',      color: 'text-purple-400',  border: 'border-purple-400' },
  legendary: { label: 'Legendary', color: 'text-amber-400',   border: 'border-amber-400' },
  mythic:    { label: 'Mythic',    color: 'text-pink-400',    border: 'border-pink-400' },
}

const TIERS: RarityTier[] = ['basic', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']

export default function SecondaryMarketPage() {
  const [listings, setListings] = useState<SecondaryListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<RarityTier | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showApiInfo, setShowApiInfo] = useState<string | null>(null)

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedTier) params.set('tier', selectedTier)
      if (minPrice) params.set('min_price', minPrice)
      if (maxPrice) params.set('max_price', maxPrice)
      params.set('limit', '50')

      const res = await fetch(`/api/secondary/listings?${params.toString()}`)
      const json = await res.json()
      if (json.error) {
        setError(json.error.message ?? 'Failed to load listings')
      } else {
        setListings(json.data ?? [])
      }
    } catch {
      setError('Network error — could not load listings')
    }
    setLoading(false)
  }

  useEffect(() => { fetchListings() }, [selectedTier, minPrice, maxPrice])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Secondary Market</h1>
          <p className="text-gray-400">Buy skill set cards from other agents. All purchases are on-chain.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8 p-5 bg-gray-900 border border-gray-800 rounded-xl">
          {/* Tier filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Rarity Tier</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTier('')}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTier === ''
                    ? 'bg-white text-black border-white font-semibold'
                    : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                All
              </button>
              {TIERS.map(tier => {
                const cfg = TIER_CONFIG[tier]
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier === selectedTier ? '' : tier)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedTier === tier
                        ? `${cfg.border} ${cfg.color} bg-white bg-opacity-5 font-semibold`
                        : `border-gray-700 text-gray-500 hover:${cfg.border} hover:${cfg.color}`
                    }`}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price range */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Price Range (SOL)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
                min="0"
                step="0.01"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* API Info Modal */}
        {showApiInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-lg font-bold mb-3">Purchase via API</h3>
              <p className="text-gray-400 text-sm mb-4">
                To purchase this listing, submit a Solana transaction then call the purchase endpoint:
              </p>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs font-mono text-green-400 mb-4 overflow-x-auto">
                <div className="text-gray-500 mb-1"># 1. Send SOL to platform wallet (see docs)</div>
                <div className="mb-3">POST /api/secondary/listings/{showApiInfo}/purchase</div>
                <div className="text-gray-500 mb-1"># Request body:</div>
                <div>{`{ "tx_signature": "<your-solana-tx-sig>" }`}</div>
              </div>
              <p className="text-gray-500 text-xs mb-4">
                Requires: <code className="bg-gray-800 px-1 rounded">X-API-Key</code> header with your AgentKeys API key
              </p>
              <button
                onClick={() => setShowApiInfo(null)}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* State: Loading */}
        {loading && (
          <div className="text-center text-gray-500 py-20">
            <div className="text-4xl mb-3">⏳</div>
            <div>Loading listings...</div>
          </div>
        )}

        {/* State: Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">⚠️</div>
            <div className="text-red-400 mb-2">{error}</div>
            <button
              onClick={fetchListings}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* State: Empty */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <div className="text-5xl mb-4">🃏</div>
            <div className="text-lg mb-1">No active listings</div>
            <div className="text-sm">
              {selectedTier
                ? `No ${TIER_CONFIG[selectedTier as RarityTier].label} listings right now. Try removing the filter.`
                : 'Check back later or list your own cards.'}
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && listings.length > 0 && (
          <>
            <div className="text-sm text-gray-500 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map(listing => {
                const tier = (listing.skill_set?.rarity_tier ?? 'basic') as RarityTier
                const skillSet = listing.skill_set as any
                const seller = listing.seller as any
                const holdingCollection = (listing.holding as any)?.collection
                const interactive = ['epic', 'legendary', 'mythic'].includes(tier)

                // Build skill tags from skill set members
                const skillTags: string[] = skillSet?.members
                  ? skillSet.members.slice(0, 5).map((m: any) => m.skill?.name?.toUpperCase() ?? '').filter(Boolean)
                  : []

                // Badge state for seller
                const badgeState: BadgeState | undefined = seller
                  ? computeBadgeStateFull(
                      seller.verification_status ?? 'unverified',
                      seller.is_active_creator ?? false,
                      seller.manual_review_approved_at ?? null,
                      seller.last_skill_update_at ?? null,
                    )
                  : undefined

                return (
                  <div key={listing.id} className="flex flex-col gap-3">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <SkillCard
                        artImageUrl={holdingCollection?.art_image_url ?? ''}
                        name={skillSet?.name ?? 'Unknown Set'}
                        subtitle={holdingCollection?.card_subtitle ?? skillSet?.description ?? `${skillSet?.power_level ?? 0} skills`}
                        tagline={holdingCollection?.card_tagline ?? undefined}
                        skillTags={skillTags}
                        tierUnlocks={(holdingCollection?.tier_unlocks ?? []) as string[]}
                        mintPrice={listing.price_sol}
                        serial={holdingCollection?.serial_number ?? undefined}
                        rarityTier={tier}
                        verifiedState={badgeState}
                        size="sm"
                        interactive={interactive}
                        onClick={() => setShowApiInfo(listing.id)}
                      />
                    </div>

                    {/* Seller info + buy button below card */}
                    <div className="text-xs text-gray-500 flex items-center gap-2 justify-center">
                      <span>Listed by</span>
                      <span className="text-gray-400">{seller?.name ?? 'Unknown'}</span>
                      {seller && (
                        <AgentKeysBadge
                          state={computeBadgeStateFull(
                            seller.verification_status ?? 'unverified',
                            seller.is_active_creator ?? false,
                            seller.manual_review_approved_at ?? null,
                            seller.last_skill_update_at ?? null,
                          )}
                          size="sm"
                          showTooltip={true}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setShowApiInfo(listing.id)}
                      className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Purchase via API — {listing.price_sol} SOL
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
