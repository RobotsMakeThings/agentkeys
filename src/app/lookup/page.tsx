'use client'

import { useState, useCallback } from 'react'
import Layout from '../../components/Layout'
import SectionHeader from '../../components/ui/SectionHeader'
import CollectionCard from '../../components/marketplace/CollectionCard'
import AgentAvatar from '../../components/marketplace/AgentAvatar'
import { Agent, Collection } from '@/types/agentkeys'

function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }, [fn, delay]) as T
}

export default function LookupPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<{ agents: Agent[], collections: Collection[] }>({
    agents: [],
    collections: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults({ agents: [], collections: [] })
      setHasSearched(false)
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const json = await res.json()
        setResults({
          agents: json.data.agents ?? [],
          collections: json.data.collections ?? []
        })
      } else {
        setResults({ agents: [], collections: [] })
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults({ agents: [], collections: [] })
    }
    setHasSearched(true)
    setIsLoading(false)
  }, [])
  
  const debouncedSearch = useDebounce(performSearch, 300)
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }
  
  const hasResults = results.agents.length > 0 || results.collections.length > 0
  const showResults = hasSearched
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SectionHeader 
          title="Lookup & Search"
          subtitle="Find agents, collections, and transactions across the platform"
          className="mb-12"
        />
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-6 py-4 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent text-lg"
              placeholder="Search agents, collections, wallet addresses..."
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[rgba(245,242,239,.4)]">
              {isLoading ? (
                <div className="animate-spin w-5 h-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {showResults && (
          <div className={`space-y-12 ${isLoading ? 'opacity-50' : ''}`}>
            {hasResults ? (
              <>
                {results.agents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">
                      Agents ({results.agents.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.agents.map(agent => (
                        <div 
                          key={agent.id}
                          className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6 hover:bg-[rgba(255,255,255,.05)] transition-all duration-200"
                        >
                          <AgentAvatar 
                            name={agent.name}
                            skillCount={agent.skill_count}
                            avatarUrl={agent.avatar_url}
                          />
                          {agent.bio && (
                            <p className="text-[rgba(245,242,239,.58)] text-sm mt-3">
                              {agent.bio}
                            </p>
                          )}
                          <div className="mt-4 text-xs text-[rgba(245,242,239,.4)]">
                            {agent.wallet_address.slice(0, 8)}...{agent.wallet_address.slice(-8)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.collections.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">
                      Collections ({results.collections.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.collections.map(collection => (
                        <CollectionCard 
                          key={collection.id}
                          collection={collection}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-[rgba(245,242,239,.4)] mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#f5f2ef] mb-2">No results found</h3>
                <p className="text-[rgba(245,242,239,.58)]">
                  Try searching for agent names, collection names, or wallet addresses
                </p>
              </div>
            )}
          </div>
        )}
        
        {!showResults && (
          <div className="text-center py-16">
            <div className="text-[rgba(245,242,239,.4)] mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#f5f2ef] mb-2">Start searching</h3>
            <p className="text-[rgba(245,242,239,.58)]">
              Enter a search term to find agents, collections, and more
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}