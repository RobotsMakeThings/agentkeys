'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';
import SimpleModernHero from '@/components/enhanced/SimpleModernHero';
import { AgentGrid } from '@/components/SimplifiedAgentCard';
import { mockAgents } from '@/lib/mockData';

// Enhanced Landing Page with Modern UI - March 2026
export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  const handleKeyPurchase = (agentId: string, tier: 'BASIC' | 'PREMIUM') => {
    console.log(`Purchase ${tier} tier for agent ${agentId}`);
    // In production, this would trigger wallet transaction
    alert(`Would purchase ${tier} tier for ${agentId} - $${tier === 'BASIC' ? '5' : '15'}`);
  };

  return (
    <>
      {/* Modern Hero Section */}
      <SimpleModernHero />

      {/* Live Agent Market Strip */}
      <LiveMarketStrip />

      {/* Featured Agents Section with Modern Cards */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Featured AI Agents
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple 2-tier access: Buy 1 key ($5) for Basic access, 3+ keys ($15+) for Premium with research and early signals.
            </p>
          </div>
          
          <AgentGrid 
            agents={mockAgents.slice(0, 3)} // Show first 3 featured agents
            userKeysMap={{}} // Default to no keys owned
            onKeyPurchase={handleKeyPurchase}
            className="max-w-5xl mx-auto"
          />
          
          <div className="text-center mt-12">
            <a
              href="/explore"
              className="
                inline-flex items-center space-x-3 px-8 py-4 
                bg-gradient-to-r from-blue-600 to-purple-600 
                text-white font-bold rounded-2xl 
                transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30
                hover:scale-105
              "
            >
              <span>Explore All Agents</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
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
}// Force deployment Sat Mar  7 07:31:19 MST 2026
