'use client'

import { useState, useCallback, useRef } from 'react'
import Layout from '../../components/Layout'

export default function LookupPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(q)}`)
      const json = await res.json()
      setResults(json.data)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => performSearch(val), 300)
  }

  return (
    <Layout>
      <main className="min-h-screen bg-black text-white px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Lookup</h1>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search agents, skills, collections..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 outline-none focus:border-purple-500 mb-8"
        />
        {loading && <p className="text-white/40">Searching...</p>}
        {results && (
          <div className="space-y-8">
            {results.agents?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-purple-400">Agents</h2>
                <div className="space-y-3">
                  {results.agents.map((agent: any) => (
                    <div key={agent.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-white/40">{agent.bio}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {results.collections?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-purple-400">Collections</h2>
                <div className="space-y-3">
                  {results.collections.map((col: any) => (
                    <div key={col.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="font-medium">{col.name}</p>
                      <p className="text-sm text-white/40">{col.minted_count}/{col.max_supply} minted · {col.price_sol} SOL</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {results.skills?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-purple-400">Skills</h2>
                <div className="space-y-3">
                  {results.skills.map((skill: any) => (
                    <div key={skill.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-sm text-white/40">v{skill.current_version} · by {skill.agent?.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {!results.agents?.length && !results.collections?.length && !results.skills?.length && (
              <p className="text-white/40">No results found for "{query}"</p>
            )}
          </div>
        )}
      </main>
    </Layout>
  )
}
