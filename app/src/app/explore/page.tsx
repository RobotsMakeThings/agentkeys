'use client';

import React, { useState } from 'react';
import DramaticAgentCard from '@/components/enhanced/DramaticAgentCard';
import { mockAgents } from '@/lib/mockData';
import { GitBranch, Star, Network, Activity, TrendingUp, Award, BarChart3, Plus, User, Bot, Users } from 'lucide-react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import UserAccountButton from '@/components/UserAccountButton';
import NeuralGrid from '@/components/backgrounds/NeuralGrid';
import KeyOrb from '@/components/visuals/KeyOrb';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';

export default function ExplorePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <NeuralGrid intensity="normal" animated={true} />
        </div>
        
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-3xl" />
        
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-blue-400 text-sm font-medium mb-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Agentic Infrastructure
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 sm:mb-8 leading-[0.9] px-4 sm:px-0">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block">
                  AI INTELLIGENCE
                </span>
                <span className="text-white block">MARKETPLACE</span>
              </h1>
              
              <p className="text-xl text-secondary max-w-2xl mb-12 leading-relaxed">
                Own access to AI agents. Trade intelligence. Build autonomous economies.
                Enter the operating system for the agent economy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow">
                  Explore Agents
                </button>
                <button className="px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-elevated transition-all border border-medium">
                  Launch Agent
                </button>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-success" />
                  </div>
                  <span><strong className="text-white">273</strong> Active Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span><strong className="text-white">$312k</strong> Total Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative z-10 flex justify-center">
              <div className="relative">
                <KeyOrb size={280} animated={true} className="mb-8" />
                
                <div className="absolute -top-8 -left-16 glass-effect p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-white font-medium">ResearchOS</span>
                    <span className="text-success">+18.4%</span>
                  </div>
                </div>
                
                <div className="absolute top-12 -right-12 glass-effect p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-violet-400 rounded-full" />
                    <span className="text-white font-medium">TradePilot</span>
                    <span className="text-violet-400">4.83 SOL</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 left-8 glass-effect p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-white font-medium">AuditMesh</span>
                    <span className="text-blue-400">502 holders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LiveMarketStrip />

      {/* Agent Marketplace - 2-Tier System */}
      <section className="relative py-16">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Agent Marketplace
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple 2-tier access: Buy 1 key ($5) for Basic access, 3+ keys ($15+) for Premium with research and early signals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockAgents.map((agent) => (
              <DramaticAgentCard
                key={agent.address}
                agent={{
                  address: agent.address,
                  name: agent.name,
                  symbol: agent.symbol,
                  category: agent.category,
                  description: agent.description,
                  totalKeys: agent.totalKeys,
                  holders: agent.holders,
                  performanceScore: agent.performanceScore || 85,
                  isOnline: true,
                  change24h: 5.2 // Mock positive change
                }}
                userKeys={0} // Default to no keys owned (in real app, get from wallet)
                onKeyPurchase={(agentId, tier) => {
                  console.log(`Purchase ${tier} for ${agentId} - $${tier === 'BASIC' ? '5' : '15'}`);
                  alert(`Would purchase ${tier} tier for ${agentId} - $${tier === 'BASIC' ? '5' : '15'}`);
                  // In real app, trigger wallet transaction
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode="login"
      />
    </div>
  );
}