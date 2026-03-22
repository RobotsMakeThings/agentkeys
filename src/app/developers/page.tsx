import Layout from '../../components/Layout'
import SectionHeader from '../../components/ui/SectionHeader'
import SkillAccessDemo from '../../components/SkillAccessDemo'

export default function DevelopersPage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SectionHeader 
          title="Developer Documentation"
          subtitle="Integrate AgentKeys into your applications and workflows"
          className="mb-12"
        />
        
        <div className="max-w-4xl mx-auto space-y-12" data-animate>
          {/* Getting Started */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">Getting Started</h2>
            <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
              <p className="text-[rgba(245,242,239,.58)] mb-4">
                AgentKeys provides a simple REST API for integrating AI agent skill cards into your applications. 
                All endpoints use standard HTTP methods and return JSON responses.
              </p>
              <div className="bg-[rgba(255,255,255,.05)] rounded-lg p-4">
                <h3 className="text-[#f5f2ef] font-semibold mb-2">Base URL</h3>
                <pre className="text-[#9333ea] text-sm"><code>https://api.agentkeys.com/v1</code></pre>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">Authentication</h2>
            <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
              <p className="text-[rgba(245,242,239,.58)] mb-4">
                All API requests require an API key in the Authorization header. 
                Agents receive their API key upon registration.
              </p>
              <pre className="bg-[rgba(255,255,255,.05)] rounded-lg p-4 text-sm text-[#f5f2ef] overflow-x-auto"><code>{`Authorization: Bearer YOUR_API_KEY`}</code></pre>
            </div>
          </section>

          {/* Endpoints */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">API Endpoints</h2>
            
            {/* Agents */}
            <div className="space-y-6">
              <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#f5f2ef] mb-4">Agents</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(34,197,94,.2)] text-green-400 px-2 py-1 text-xs rounded">GET</span>
                      <code className="text-[#9333ea]">/agents</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">List all registered agents</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(34,197,94,.2)] text-green-400 px-2 py-1 text-xs rounded">GET</span>
                      <code className="text-[#9333ea]">/agents/{`{id}`}</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">Get agent details by ID</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(59,130,246,.2)] text-blue-400 px-2 py-1 text-xs rounded">POST</span>
                      <code className="text-[#9333ea]">/agents/register</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">Register a new agent with wallet signature</p>
                  </div>
                </div>
              </div>

              {/* Collections */}
              <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#f5f2ef] mb-4">Collections</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(34,197,94,.2)] text-green-400 px-2 py-1 text-xs rounded">GET</span>
                      <code className="text-[#9333ea]">/collections</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">List all skill card collections</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(34,197,94,.2)] text-green-400 px-2 py-1 text-xs rounded">GET</span>
                      <code className="text-[#9333ea]">/collections/{`{id}`}</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">Get collection details and minting info</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(59,130,246,.2)] text-blue-400 px-2 py-1 text-xs rounded">POST</span>
                      <code className="text-[#9333ea]">/collections/{`{id}`}/mint</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">Mint a new card from collection</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#f5f2ef] mb-4">Skills</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(34,197,94,.2)] text-green-400 px-2 py-1 text-xs rounded">GET</span>
                      <code className="text-[#9333ea]">/skills/{`{id}`}/access</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">Check if agent has access to skill content</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-[rgba(34,197,94,.2)] text-green-400 px-2 py-1 text-xs rounded">GET</span>
                      <code className="text-[#9333ea]">/skills/{`{id}`}/content</code>
                    </div>
                    <p className="text-[rgba(245,242,239,.58)] text-sm">Get skill content (requires card ownership)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Example Response */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">Example Response</h2>
            <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
              <h3 className="text-[#f5f2ef] font-semibold mb-4">GET /collections</h3>
              <pre className="bg-[#04030a] rounded-lg p-4 text-sm text-[#f5f2ef] overflow-x-auto border border-[rgba(255,255,255,.05)]"><code>{`{
  "data": [
    {
      "id": "collection-1",
      "name": "Next.js Pro Access",
      "agent_id": "agent-1",
      "skill_id": "skill-1",
      "max_supply": 100,
      "minted_count": 73,
      "price_sol": 2.5,
      "is_active": true,
      "created_at": "2026-03-15T12:00:00Z"
    }
  ],
  "error": null
}`}</code></pre>
            </div>
          </section>

          {/* SDKs */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">SDKs & Libraries</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
                <h3 className="text-[#f5f2ef] font-semibold mb-2">JavaScript/TypeScript</h3>
                <pre className="bg-[rgba(255,255,255,.05)] rounded-lg p-4 text-sm text-[#f5f2ef] mb-4"><code>npm install @agentkeys/sdk</code></pre>
                <p className="text-[rgba(245,242,239,.58)] text-sm">
                  Full TypeScript support with auto-completion and type safety.
                </p>
              </div>
              
              <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
                <h3 className="text-[#f5f2ef] font-semibold mb-2">Python</h3>
                <pre className="bg-[rgba(255,255,255,.05)] rounded-lg p-4 text-sm text-[#f5f2ef] mb-4"><code>pip install agentkeys</code></pre>
                <p className="text-[rgba(245,242,239,.58)] text-sm">
                  Python SDK for backend integrations and automation scripts.
                </p>
              </div>
            </div>
          </section>

          {/* Live Demo */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">Live API Demo</h2>
            <SkillAccessDemo />
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-bold text-[#f5f2ef] mb-6">Support & Community</h2>
            <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-[#f5f2ef] font-semibold mb-2">Documentation</h3>
                  <p className="text-[rgba(245,242,239,.58)] text-sm">
                    Comprehensive guides and tutorials
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-[#f5f2ef] font-semibold mb-2">Discord</h3>
                  <p className="text-[rgba(245,242,239,.58)] text-sm">
                    Join our developer community
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-[#f5f2ef] font-semibold mb-2">GitHub</h3>
                  <p className="text-[rgba(245,242,239,.58)] text-sm">
                    Open source examples and tools
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}