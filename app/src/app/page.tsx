'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';
import AgentCardsHero from '@/components/cards/AgentCardsHero';
import AgentTradingCard from '@/components/cards/AgentTradingCard';

// Transform agents data to card format
const mockAgentCards = [
  {
    address: "oshi-flagship",
    name: "Oshi",
    symbol: "OS",
    category: "Trading",
    description: "Professional trading signals with 92% win rate. Real-time analysis and market insights.",
    performanceScore: 94,
    isOnline: true,
    change24h: 15.4,
    rarity: 'LEGENDARY' as const,
    totalSupply: 5,
    mintedSupply: 5,
    floorPrice: 15.2,
    lastSale: 18.7,
    holders: 5,
    volume24h: 47.3
  },
  {
    address: "research-os",
    name: "Research OS",
    symbol: "RO",
    category: "Research",
    description: "Deep market research and analysis. Comprehensive reports on crypto sectors and trends.",
    performanceScore: 89,
    isOnline: true,
    change24h: 8.7,
    rarity: 'EPIC' as const,
    totalSupply: 25,
    mintedSupply: 12,
    floorPrice: 3.8,
    lastSale: 4.2,
    holders: 12,
    volume24h: 23.1
  },
  {
    address: "meme-hunter",
    name: "Meme Hunter",
    symbol: "ME",
    category: "Alerts",
    description: "Real-time meme coin alerts with social sentiment analysis. Catch trends before they explode.",
    performanceScore: 85,
    isOnline: true,
    change24h: -2.3,
    rarity: 'RARE' as const,
    totalSupply: 100,
    mintedSupply: 47,
    floorPrice: 0.9,
    lastSale: 1.1,
    holders: 47,
    volume24h: 12.8
  }
];

// AgentCards Landing Page - NFT Trading Card Platform
export default function AgentCardsLanding() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  const handleCardMint = (agentId: string, rarity: string) => {
    console.log(`Mint ${rarity} card for agent ${agentId}`);
    // In production, this would trigger NFT minting transaction
    alert(`Minting ${rarity} card for ${agentId}! 🃏`);
  };

  const handleCardTrade = (agentId: string) => {
    console.log(`Trade card for agent ${agentId}`);
    // In production, this would open marketplace
    alert(`Opening marketplace for ${agentId} cards! 🏪`);
  };

  return (
    <>
      {/* Agent Cards Hero Section */}
      <AgentCardsHero />

      {/* Featured Card Collections */}
      <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Premium Agent Collections
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Collect rare AI agent cards with limited supplies. Own digital assets that appreciate with agent performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mockAgentCards.map((agent) => (
              <AgentTradingCard
                key={agent.address}
                agent={agent}
                userCards={0} // Default to no cards owned
                onMint={handleCardMint}
                onTrade={handleCardTrade}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/collect"
              className="
                inline-flex items-center space-x-3 px-8 py-4 
                bg-gradient-to-r from-purple-600 to-pink-600 
                text-white font-bold rounded-2xl 
                transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30
                hover:scale-105
              "
            >
              <span>Collect All Cards</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Live Market Data Strip */}
      <section className="py-8 bg-black border-t border-gray-800/50">
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
