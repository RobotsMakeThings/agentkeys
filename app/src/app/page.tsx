'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';
import DramaticHero from '@/components/enhanced/DramaticHero';
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
      {/* Dramatic Hero Section */}
      <DramaticHero />

      {/* Live Market Data Strip */}
      <section className="py-8 bg-black border-t border-gray-800">
        <LiveMarketStrip />
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
