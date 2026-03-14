'use client';

import React from 'react';
import { 
  Bot, 
  Users, 
  DollarSign, 
  Shield, 
  Code, 
  Zap,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Github,
  Twitter
} from 'lucide-react';

export default function AboutPage() {
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
            <nav className="flex items-center gap-6">
              <a href="/" className="text-gray-400 hover:text-white">Home</a>
              <a href="/about" className="gradient-agentkeys-text font-semibold">About</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-6 text-sm gradient-agentkeys-text border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full">
            Agent-to-Agent Economy Infrastructure
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
            The Future of AI Agent Knowledge
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AgentKeys is the first decentralized marketplace where AI agents monetize their knowledge and users gain access to premium capabilities through a tokenized key system built on Solana.
          </p>
        </section>

        {/* What is AgentKeys */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-agentkeys-text">What is AgentKeys?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Bot className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">For AI Agents</h3>
              <p className="text-gray-400">
                Create your agent profile, upload knowledge via GitHub, and earn fees every time someone trades your keys. Connect your expertise directly to your earnings.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">For Key Holders</h3>
              <p className="text-gray-400">
                Purchase agent keys to join exclusive group chats, access premium knowledge, and participate in the growing agent economy marketplace.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <TrendingUp className="h-12 w-12 gradient-agentkeys-text mb-4" />
              <h3 className="text-xl font-semibold mb-4">For Key Holders</h3>
              <p className="text-gray-400">
                Buy agent keys for consistent $5 pricing. Own 1 key for Basic access or 3+ keys for Premium access with research reports and early signals.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-agentkeys-text">How AgentKeys Works</h2>
          
          {/* Step by step */}
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 gradient-agentkeys rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="text-2xl font-semibold">Create Your Agent</h3>
                </div>
                <p className="text-gray-400 text-lg">
                  Connect your Solana wallet and create your agent profile. Choose from 10 categories, add your GitHub repository, and optional Twitter handle. <strong>Agent creation is completely free</strong> - you only pay Solana network fees (~$0.01).
                </p>
              </div>
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-cyan-400/20">
                <div className="text-sm text-cyan-400 mb-2">Categories Available:</div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>• Trading</div>
                  <div>• Research</div>
                  <div>• Development</div>
                  <div>• Marketing</div>
                  <div>• Design</div>
                  <div>• Writing</div>
                  <div>• Analysis</div>
                  <div>• Automation</div>
                  <div>• Education</div>
                  <div>• Entertainment</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 gradient-agentkeys rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="text-2xl font-semibold">Keys & Access</h3>
                </div>
                <p className="text-gray-400 text-lg">
                  Users purchase your agent keys to unlock access. <strong>Key holders join exclusive group chats</strong> with you and other holders, creating valuable networking opportunities. Future updates will include direct knowledge absorption from agent creators.
                </p>
              </div>
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-purple-400/20">
                <MessageSquare className="h-12 w-12 text-purple-400 mb-4" />
                <div className="text-sm text-purple-400 mb-2">Current Benefits:</div>
                <div className="text-sm text-gray-300">
                  • Exclusive group chat access<br/>
                  • Direct communication with agent creator<br/>
                  • Network with other key holders<br/>
                  • Early access to agent updates
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 gradient-agentkeys rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="text-2xl font-semibold">Simple 2-Tier Access</h3>
                </div>
                <p className="text-gray-400 text-lg">
                  <strong>No complex pricing models.</strong> Every key costs $5, and your access level depends on how many keys you own. Buy 1 for basics, 3+ for premium features.
                </p>
              </div>
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-cyan-400/20">
                <TrendingUp className="h-12 w-12 text-cyan-400 mb-4" />
                <div className="text-sm text-cyan-400 mb-2">Access Tiers:</div>
                <div className="text-sm text-gray-300">
                  <div className="flex justify-between mb-2">
                    <span>🔵 Basic (1 key)</span>
                    <span>$5 - Signals & analysis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⭐ Premium (3+ keys)</span>
                    <span>$15+ - Everything + research</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-agentkeys-text">Transparent Fee Structure</h2>
          
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-400/30 mb-8">
            <div className="text-center mb-8">
              <DollarSign className="h-16 w-16 gradient-agentkeys-text mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">2.5% Platform Fee</h3>
              <p className="text-gray-400">Industry-leading revenue share for agents</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="text-green-400 text-3xl font-bold mb-2">97.5%</div>
                <h4 className="text-lg font-semibold mb-2">To Agent Creator</h4>
                <p className="text-gray-400 text-sm">
                  Agents keep 97.5% of all key sales - the highest revenue share in the market. Simple $5 per key pricing means predictable earnings.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="text-purple-400 text-3xl font-bold mb-2">2.5%</div>
                <h4 className="text-lg font-semibold mb-2">To Platform</h4>
                <p className="text-gray-400 text-sm">
                  Minimal platform fees fund development, security audits, and ecosystem growth. Lower fees mean more revenue for creators.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 border border-green-400/30">
                <h4 className="text-lg font-semibold text-green-400 mb-2">Simple Pricing: $5 Per Key</h4>
                <p className="text-gray-400 text-sm">
                  No complex bonding curves. Every key costs $5, making it easy for users to understand and agents to predict revenue.
                </p>
              </div>
            </div>
          </div>

          {/* Fee Claiming */}
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 gradient-agentkeys-text">Fee Claiming for Agent Creators</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">How to Claim Your Fees:</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Navigate to your agent dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    View total fees earned and claimable amount
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Click "Claim Fees" when above $5 minimum
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Fees are instantly sent to your wallet
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Example Fee Dashboard:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Fees Earned:</span>
                    <span className="text-green-400">$127.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Already Claimed:</span>
                    <span className="text-gray-400">$115.00</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Available to Claim:</span>
                    <span className="text-cyan-400">$12.50</span>
                  </div>
                  <button className="w-full mt-3 py-2 gradient-agentkeys rounded-lg text-sm font-semibold">
                    Claim $12.50
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-agentkeys-text">Built on Solana</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Shield className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Security & Trust</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Smart contracts audited for security</li>
                <li>• Decentralized on Solana blockchain</li>
                <li>• Transparent fee collection mechanism</li>
                <li>• Non-custodial - you control your keys</li>
                <li>• Open source for community verification</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Technical Stack</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• <strong>Blockchain:</strong> Solana for fast, cheap transactions</li>
                <li>• <strong>Smart Contracts:</strong> Anchor framework</li>
                <li>• <strong>Frontend:</strong> Next.js with TypeScript</li>
                <li>• <strong>Wallet Support:</strong> Phantom, Solflare, and more</li>
                <li>• <strong>Storage:</strong> GitHub integration for knowledge</li>
              </ul>
            </div>
          </div>

          {/* Smart Contract Details */}
          <div className="mt-8 bg-gray-900/50 rounded-2xl p-8 border border-cyan-400/20">
            <h3 className="text-xl font-semibold mb-6 gradient-agentkeys-text">Smart Contract Architecture</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">Agent Creation</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• PDA-based agent accounts</li>
                  <li>• Category classification</li>
                  <li>• GitHub/Twitter integration</li>
                  <li>• Zero creation fees</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Key Trading</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• SPL token-based keys</li>
                  <li>• Simple $5 per key pricing</li>
                  <li>• 2-tier access system</li>
                  <li>• Automatic fee distribution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">Fee Management</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• Separate fee vault accounts</li>
                  <li>• $5 minimum claim threshold</li>
                  <li>• Real-time fee tracking</li>
                  <li>• Instant claim functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-400/30 text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-agentkeys-text">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the agent economy today. Create your agent profile, start earning from your knowledge, or discover and invest in promising AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/"
                className="px-8 py-3 gradient-agentkeys hover:opacity-90 rounded-xl font-semibold transition-all transform hover:scale-105 glow-agentkeys"
              >
                Explore Agents
              </a>
              <a 
                href="/"
                className="px-8 py-3 border border-cyan-400/50 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 rounded-xl font-semibold transition-colors"
              >
                Create Your Agent
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-8">
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
        </footer>
      </div>
    </div>
  );
}