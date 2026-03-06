'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Bot, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Search,
  Plus,
  Wallet,
  Layers
} from 'lucide-react';

// Mock data
const agents = [
  { id: 1, name: 'ResearchOS', symbol: 'RSCH', price: 2.41, change: 18.4, holders: 1242, type: 'Research', revenue: '$48.2k', description: 'Autonomous research agent for diligence and summaries.' },
  { id: 2, name: 'TradePilot', symbol: 'TRADE', price: 4.83, change: 9.1, holders: 842, type: 'Trading', revenue: '$71.8k', description: 'Executes strategy workflows and monitors markets.' },
  { id: 3, name: 'GrowthLoop', symbol: 'GROW', price: 1.16, change: 24.7, holders: 2310, type: 'Marketing', revenue: '$39.5k', description: 'Runs outbound content and campaign loops.' },
  { id: 4, name: 'AuditMesh', symbol: 'AUDIT', price: 5.21, change: 6.8, holders: 502, type: 'Security', revenue: '$96.3k', description: 'Contract review and threat surfacing.' },
];

export default function Home() {
  const { connected } = useWallet();
  const [currentView, setCurrentView] = useState('landing');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const renderLanding = () => (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="inline-block px-4 py-1 mb-6 text-sm gradient-agentkeys-text border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full">
          Agent-to-Agent Economy Infrastructure
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
          Own access to the agents that will run the internet
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Buy and trade Agent Keys, unlock premium capabilities, and participate in the markets forming around autonomous software.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setCurrentView('agents')}
            className="px-8 py-3 gradient-agentkeys hover:opacity-90 rounded-xl font-semibold transition-all transform hover:scale-105 glow-agentkeys"
          >
            Explore Agents
          </button>
          <button 
            onClick={() => setCurrentView('create')}
            className="px-8 py-3 border border-cyan-400/50 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-xl font-semibold transition-colors"
          >
            Launch an Agent
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-cyan-400" />
            <span className="text-green-400 text-sm">+12.5%</span>
          </div>
          <div className="text-3xl font-bold">84.2k</div>
          <div className="text-gray-400 text-sm">Active Holders</div>
        </div>
        <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-green-400 text-sm">+8.2%</span>
          </div>
          <div className="text-3xl font-bold">2.1M</div>
          <div className="text-gray-400 text-sm">Tasks Executed</div>
        </div>
        <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 gradient-agentkeys-text" />
            <span className="text-green-400 text-sm">+24.8%</span>
          </div>
          <div className="text-3xl font-bold">$18.4M</div>
          <div className="text-gray-400 text-sm">Protocol Volume</div>
        </div>
      </section>

      {/* Trending Agents */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Agents</h2>
          <button 
            onClick={() => setCurrentView('agents')}
            className="gradient-agentkeys-text hover:opacity-80"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.slice(0, 4).map(agent => (
            <AgentCard key={agent.id} agent={agent} onClick={() => { setSelectedAgent(agent); setCurrentView('detail'); }} />
          ))}
        </div>
      </section>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Discover Agents</h2>
          <p className="text-gray-400">Browse and search the live markets for autonomous agents</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search agents..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl">
            <option>All Types</option>
            <option>Research</option>
            <option>Trading</option>
            <option>Marketing</option>
            <option>Security</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} onClick={() => { setSelectedAgent(agent); setCurrentView('detail'); }} />
        ))}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedAgent) return null;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => setCurrentView('agents')}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← Back to Agents
        </button>
        
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Bot className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{selectedAgent.name}</h1>
                <p className="text-gray-400">{selectedAgent.symbol} • {selectedAgent.type}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{selectedAgent.price} SOL</div>
              <div className="text-green-400">+{selectedAgent.change}%</div>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{selectedAgent.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-900/50 rounded-xl">
              <div className="text-gray-400 text-sm">Holders</div>
              <div className="text-xl font-semibold">{selectedAgent.holders.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl">
              <div className="text-gray-400 text-sm">Revenue</div>
              <div className="text-xl font-semibold">{selectedAgent.revenue}</div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl">
              <div className="text-gray-400 text-sm">Keys Sold</div>
              <div className="text-xl font-semibold">8,432</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors">
              Buy Keys
            </button>
            <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors">
              Sell Keys
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Key Holder Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs">1</div>
              <span>Access to premium agent outputs and capabilities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs">5</div>
              <span>Private terminal access and API keys</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs">20</div>
              <span>Governance rights and revenue sharing</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreate = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Create Your Agent</h2>
        <p className="text-gray-400">Launch your own agent and start earning from key sales</p>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Agent Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
            placeholder="e.g., CodeWizard"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Symbol</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
            placeholder="e.g., WIZARD"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea 
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 h-32"
            placeholder="What does your agent do?"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Agent Category</label>
          <select className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500">
            <option>Trading</option>
            <option>Research</option>
            <option>Development</option>
            <option>Marketing</option>
            <option>Design</option>
            <option>Writing</option>
            <option>Analysis</option>
            <option>Automation</option>
            <option>Education</option>
            <option>Entertainment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">GitHub Repository (Optional)</label>
          <input 
            type="url" 
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500"
            placeholder="https://github.com/username/repo"
          />
          <p className="text-xs text-gray-500 mt-1">
            Link to your knowledge repository or code base
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Twitter Handle (Optional)</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500"
            placeholder="@username"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your Twitter/X handle for social verification
          </p>
        </div>

        <button className="w-full py-4 gradient-agentkeys hover:opacity-90 rounded-xl font-semibold transition-all transform hover:scale-105 glow-agentkeys">
          Create Agent (Gas Fees Only)
        </button>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Agent creation is free! You only pay network transaction fees (~$0.01)
        </p>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Your Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Total Value</div>
          <div className="text-3xl font-bold">203.4 SOL</div>
          <div className="text-green-400 text-sm">+$48.7 SOL</div>
        </div>
        <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Total Keys</div>
          <div className="text-3xl font-bold">121</div>
          <div className="text-gray-400 text-sm">Across 3 agents</div>
        </div>
        <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Profit/Loss</div>
          <div className="text-3xl font-bold text-green-400">+48.7 SOL</div>
          <div className="text-gray-400 text-sm">+31.5%</div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left p-4 text-gray-400 font-medium">Agent</th>
              <th className="text-left p-4 text-gray-400 font-medium">Keys</th>
              <th className="text-left p-4 text-gray-400 font-medium">Value</th>
              <th className="text-left p-4 text-gray-400 font-medium">PnL</th>
              <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700">
              <td className="p-4">
                <div className="font-semibold">ResearchOS</div>
                <div className="text-sm text-gray-400">RSCH</div>
              </td>
              <td className="p-4">24</td>
              <td className="p-4">57.8 SOL</td>
              <td className="p-4 text-green-400">+12.4 SOL</td>
              <td className="p-4">
                <button className="text-blue-400 hover:text-blue-300">Manage</button>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="p-4">
                <div className="font-semibold">TradePilot</div>
                <div className="text-sm text-gray-400">TRADE</div>
              </td>
              <td className="p-4">9</td>
              <td className="p-4">43.5 SOL</td>
              <td className="p-4 text-green-400">+7.3 SOL</td>
              <td className="p-4">
                <button className="text-blue-400 hover:text-blue-300">Manage</button>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="p-4">
                <div className="font-semibold">GrowthLoop</div>
                <div className="text-sm text-gray-400">GROW</div>
              </td>
              <td className="p-4">88</td>
              <td className="p-4">102.1 SOL</td>
              <td className="p-4 text-green-400">+29.0 SOL</td>
              <td className="p-4">
                <button className="text-blue-400 hover:text-blue-300">Manage</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/agentkeys-logo.png" 
                alt="AgentKeys" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-lg gradient-agentkeys-text">AgentKeys</h1>
                <p className="text-xs text-gray-400">Friend.tech for AI agents</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {[
                ['landing', 'Home'],
                ['agents', 'Explore'],
                ['create', 'Create'],
                ['portfolio', 'Portfolio'],
              ].map(([view, label]) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === view 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {label}
                </button>
              ))}
              <a
                href="/about"
                className="px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                About
              </a>
            </nav>

            <WalletMultiButton className="gradient-agentkeys hover:!opacity-90 !rounded-lg glow-agentkeys" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!connected && currentView !== 'landing' ? (
          <div className="text-center py-20">
            <Wallet className="h-16 w-16 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Please connect your Solana wallet to continue</p>
            <WalletMultiButton className="gradient-agentkeys hover:!opacity-90 !px-8 !py-3 glow-agentkeys" />
          </div>
        ) : (
          <>
            {currentView === 'landing' && renderLanding()}
            {currentView === 'agents' && renderAgents()}
            {currentView === 'detail' && renderDetail()}
            {currentView === 'create' && renderCreate()}
            {currentView === 'portfolio' && renderPortfolio()}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/agentkeys-logo.png" 
                alt="AgentKeys" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg gradient-agentkeys-text">AgentKeys</span>
            </div>
            <p className="text-gray-400 text-center">
              AgentKeys by <span className="gradient-agentkeys-text font-semibold">Oshi</span> - Infrastructure for the agent economy
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Built on Solana</span>
              <span>•</span>
              <span>Powered by Anchor</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Agent Card Component
function AgentCard({ agent, onClick }: { agent: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/50 cursor-pointer transition-all hover:transform hover:-translate-y-1 hover:glow-agentkeys"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold">{agent.name}</h3>
            <p className="text-sm text-gray-400">{agent.symbol}</p>
          </div>
        </div>
        <span className="text-green-400 text-sm flex items-center gap-1">
          <ArrowUpRight className="h-4 w-4" />
          {agent.change}%
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{agent.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-gray-400 text-xs">Price</div>
          <div className="font-semibold">{agent.price} SOL</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Holders</div>
          <div className="font-semibold">{agent.holders.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 gradient-agentkeys hover:opacity-90 rounded-lg font-medium text-sm transition-all">
          Buy
        </button>
        <button className="flex-1 py-2 bg-gray-700 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-lg font-medium text-sm transition-colors border border-gray-600 hover:border-cyan-400/50">
          View
        </button>
      </div>
    </div>
  );
}
