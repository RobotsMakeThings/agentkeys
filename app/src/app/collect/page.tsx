'use client';

import React, { useState } from 'react';
import AgentTradingCard from '@/components/cards/AgentTradingCard';
import { Star, Gem, TrendingUp, BarChart3, Filter, Grid3x3, Crown, Zap } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';

// Complete Agent Cards Collection
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
    address: "audit-mesh",
    name: "Audit Mesh",
    symbol: "AM",
    category: "Security",
    description: "Smart contract auditing and vulnerability detection. Protect your DeFi investments.",
    performanceScore: 91,
    isOnline: true,
    change24h: 12.1,
    rarity: 'EPIC' as const,
    totalSupply: 25,
    mintedSupply: 7,
    floorPrice: 2.4,
    lastSale: 2.8,
    holders: 7,
    volume24h: 8.9
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
  },
  {
    address: "trade-pilot",
    name: "Trade Pilot",
    symbol: "TP",
    category: "Trading",
    description: "Automated trading strategies with risk management. Set and forget trading solutions.",
    performanceScore: 87,
    isOnline: true,
    change24h: 5.2,
    rarity: 'RARE' as const,
    totalSupply: 100,
    mintedSupply: 23,
    floorPrice: 1.3,
    lastSale: 1.5,
    holders: 23,
    volume24h: 15.7
  },
  {
    address: "alpha-scout",
    name: "Alpha Scout",
    symbol: "AS",
    category: "Research",
    description: "Early project discovery and alpha generation. Find the next big opportunities before everyone else.",
    performanceScore: 88,
    isOnline: false,
    change24h: -1.8,
    rarity: 'COMMON' as const,
    totalSupply: 500,
    mintedSupply: 156,
    floorPrice: 0.2,
    lastSale: 0.3,
    holders: 156,
    volume24h: 4.2
  }
];

export default function CardCollectionPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleCardMint = (agentId: string, rarity: string) => {
    console.log(`Mint ${rarity} card for agent ${agentId}`);
    alert(`Minting ${rarity} card! 🃏`);
  };

  const handleCardTrade = (agentId: string) => {
    console.log(`Trade card for agent ${agentId}`);
    alert(`Opening marketplace for ${agentId} cards! 🏪`);
  };

  // Filter cards based on rarity and category
  const filteredCards = mockAgentCards.filter(card => {
    const rarityMatch = selectedRarity === 'ALL' || card.rarity === selectedRarity;
    const categoryMatch = selectedCategory === 'ALL' || card.category === selectedCategory;
    return rarityMatch && categoryMatch;
  });

  const rarities = ['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
  const categories = ['ALL', 'Trading', 'Research', 'Alerts', 'Security'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Card Collection Header */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          
          {/* Status Badge */}
          <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" />
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold tracking-wider">AGENT CARD COLLECTION</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none mb-8">
            <div className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-4">
              COLLECT
            </div>
            <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI INTELLIGENCE
            </div>
          </h1>
          
          {/* Power Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
            Premium AI agent cards with limited supplies and value appreciation
          </p>
          
          {/* Collection Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: "2,847", label: "Cards Minted", color: "purple" },
              { value: "127 SOL", label: "Trading Volume", color: "green" },
              { value: "892", label: "Collectors", color: "blue" },
              { value: "+847%", label: "Top Appreciation", color: "yellow" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-${stat.color}-500/30 hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-${stat.color}-500/30`}
              >
                <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Strip */}
      <section className="py-6 border-y border-gray-800/50">
        <LiveMarketStrip />
      </section>

      {/* Card Collection Interface */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            
            {/* Rarity Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-400 font-medium">Rarity:</span>
              {rarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setSelectedRarity(rarity)}
                  className={`
                    px-4 py-2 rounded-full font-medium text-sm transition-all duration-300
                    ${selectedRarity === rarity
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  {rarity === 'ALL' ? 'All Rarities' : rarity}
                </button>
              ))}
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-400 font-medium">Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full font-medium text-sm transition-all duration-300
                    ${selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  {category === 'ALL' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCards.map((agent) => (
              <AgentTradingCard
                key={agent.address}
                agent={agent}
                userCards={0} // Default to no cards owned
                onMint={handleCardMint}
                onTrade={handleCardTrade}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredCards.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Grid3x3 className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Cards Found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more cards.</p>
            </div>
          )}
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