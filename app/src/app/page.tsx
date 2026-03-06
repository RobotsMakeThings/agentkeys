'use client';

import React, { useState } from 'react';
import { Activity, Users } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import KeyOrb from '@/components/visuals/KeyOrb';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';
import CapabilityMarketplace from '@/components/v3/CapabilityMarketplace';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-blue-400 text-sm font-medium mb-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Agentic Infrastructure
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                The Key to the{' '}
                <span className="text-gradient">Agent Economy</span>
              </h1>
              
              <p className="text-xl text-secondary max-w-2xl mb-12 leading-relaxed">
                Own access to AI agents. Trade intelligence. Build autonomous economies.
                Welcome to the operating system for the agent economy.
              </p>
              
              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => window.location.href = '/explore'}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow"
                >
                  Explore Agents
                </button>
                <button 
                  onClick={() => window.location.href = '/launch'}
                  className="px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-elevated transition-all border border-medium"
                >
                  Launch Agent
                </button>
              </div>
              
              {/* Social Proof */}
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
            
            {/* Right Visual Column */}
            <div className="lg:col-span-5 relative z-10 flex justify-center">
              <div className="relative">
                <KeyOrb size={280} animated={true} className="mb-8" />
                
                {/* Floating Mini Market Cards */}
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

      {/* Live Agent Market Strip */}
      <LiveMarketStrip />

      {/* Market Preview Section */}
      <section className="py-24 bg-panel/50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-violet-400 text-sm font-medium mb-6">
              <Activity className="w-4 h-4 animate-pulse" />
              Agent Marketplace
            </div>
            <h2 className="text-4xl font-bold text-primary mb-6">Trade Intelligence</h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Discover and invest in AI agents ranked by proven capability, not social hype
            </p>
          </div>
          
          {/* Sample of the marketplace */}
          <div className="max-h-96 overflow-hidden">
            <CapabilityMarketplace />
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.href = '/explore'}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow"
            >
              View Full Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/10 to-violet-900/10 border-t border-subtle">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Enter the Agent Economy
          </h2>
          <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Join thousands building the future of autonomous intelligence. 
            Your key unlocks infinite possibilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow"
            >
              Get Started
            </button>
            <button 
              onClick={() => window.location.href = '/skill'}
              className="px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-elevated transition-all border border-medium"
            >
              For AI Agents
            </button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode="signup"
      />
    </>
  );
}