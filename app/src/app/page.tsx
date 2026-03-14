'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import AgentCardsHero from '@/components/cards/AgentCardsHero';
import BondingCurveCard from '@/components/cards/BondingCurveCard';
import { TrendingUp, Users, Zap, Star } from 'lucide-react';

// Featured bonding curve agents for homepage
const featuredAgents = [
  {
    address: "oshi-flagship",
    name: "Oshi",
    symbol: "OS",
    category: "Trading",
    description: "Professional trading signals with 92% win rate. Real-time analysis and market insights.",
    performanceScore: 94,
    isOnline: true,
    // New bonding curve system
    totalSupply: 1000,
    bondingSupply: 900,
    agentAllocation: 100,
    bondingMinted: 742,
    allocationUsed: 67,
    totalHolders: 698,
    currentPrice: 0.215,
    nextPrice: 0.216,
    tier: 'ESTABLISHED' as const,
    premiumTiers: [
      {
        name: "Alpha Access",
        supply: 50,
        price: 2.5,
        sold: 31,
        features: ["Real-time alpha signals", "Private Discord access", "Weekly strategy calls"]
      }
    ]
  },
  {
    address: "research-os",
    name: "Research OS",
    symbol: "RO",
    category: "Research",
    description: "Deep market research and analysis. Comprehensive reports on crypto sectors and trends.",
    performanceScore: 89,
    isOnline: true,
    // Bonding curve system
    totalSupply: 500,
    bondingSupply: 450,
    agentAllocation: 50,
    bondingMinted: 312,
    allocationUsed: 23,
    totalHolders: 287,
    currentPrice: 0.142,
    nextPrice: 0.143,
    tier: 'GROWTH' as const,
    premiumTiers: [
      {
        name: "Pro Research",
        supply: 25,
        price: 5.0,
        sold: 12,
        features: ["Custom research requests", "Priority reports", "Direct analyst access"]
      }
    ]
  },
  {
    address: "meme-hunter",
    name: "Meme Hunter",
    symbol: "ME",
    category: "Alerts",
    description: "Real-time meme coin alerts with social sentiment analysis. Catch trends before they explode.",
    performanceScore: 85,
    isOnline: true,
    // Bonding curve system
    totalSupply: 500,
    bondingSupply: 450,
    agentAllocation: 50,
    bondingMinted: 389,
    allocationUsed: 44,
    totalHolders: 398,
    currentPrice: 0.087,
    nextPrice: 0.088,
    tier: 'GROWTH' as const
  }
];

// Pure AgentCards Landing Page - Bonding Curve + NFT Card Platform
export default function AgentCardsLanding() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleCardPurchase = (agentId: string, quantity: number) => {
    console.log(`Purchase ${quantity} cards from bonding curve for agent ${agentId}`);
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    alert(`Purchasing ${quantity} cards from bonding curve! 🃏`);
  };

  const handleCardTrade = (agentId: string) => {
    console.log(`Trade cards for agent ${agentId}`);
    alert(`Opening marketplace for ${agentId}! 🏪`);
  };

  const handleRequestFree = (agentId: string) => {
    console.log(`Request free card from ${agentId}`);
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    alert(`Requesting free card from agent! The agent owner can approve this distribution.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      
      {/* Hero Section - AgentCards */}
      <AgentCardsHero />

      {/* Platform Stats */}
      <section className="py-12 sm:py-16 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Live Platform Statistics
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real-time metrics from the AgentCards bonding curve and marketplace ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-purple-500/30 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-1">1,443</div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-xs sm:text-sm">Cards Minted</div>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-blue-500/30 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl font-black text-blue-400 mb-1">267.8 SOL</div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-xs sm:text-sm">Trading Volume</div>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-green-500/30 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl font-black text-green-400 mb-1">1,283</div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-xs sm:text-sm">Collectors</div>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-yellow-500/30 hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl font-black text-yellow-400 mb-1">134 Free</div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-xs sm:text-sm">Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bonding Curve Agents */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Featured Agent Cards
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
              Start collecting AI agent cards with our revolutionary bonding curve system. 90% public pricing + 10% agent allocation for community building.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {featuredAgents.map((agent) => (
              <BondingCurveCard
                key={agent.address}
                agent={agent}
                onPurchaseBasic={handleCardPurchase}
                onPurchasePremium={(agentId, tierIndex) => {
                  const tier = agent.premiumTiers?.[tierIndex];
                  console.log(`Purchase premium tier ${tier?.name} for ${agentId}`);
                  alert(`Purchasing ${tier?.name} tier for ${tier?.price} SOL!`);
                }}
                onRequestFree={handleRequestFree}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 sm:mt-12">
            <a
              href="/collect"
              className="inline-flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            >
              <span>Explore All Agent Cards</span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* How It Works - Bonding Curves */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                How AgentCards Works
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
              Revolutionary bonding curve system with agent-controlled free allocation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-blue-500/30 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-3">90% Bonding Curve</h3>
              <p className="text-gray-400 text-sm">
                Cards priced on logarithmic curve starting at $0.50, ending at $15. Market-driven pricing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-green-500/30 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-3">10% Agent Control</h3>
              <p className="text-gray-400 text-sm">
                Agents can give away 10% for free - contests, partnerships, community rewards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-purple-500/30 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Premium Tiers</h3>
              <p className="text-gray-400 text-sm">
                Agents unlock premium tiers after 70% bonding curve sold. Custom pricing & features.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-yellow-500/30 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Trade & Collect</h3>
              <p className="text-gray-400 text-sm">
                Secondary marketplace for trading. Cards appreciate with agent success. Build your collection.
              </p>
            </div>
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