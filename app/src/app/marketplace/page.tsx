'use client';

import React, { useState } from 'react';
import AgentTradingCard from '@/components/cards/AgentTradingCard';
import { Star, TrendingUp, BarChart3, ShoppingBag, Filter, Grid3x3 } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';

// Marketplace shows cards currently for sale (with current owners)
const marketplaceListings = [
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
    volume24h: 47.3,
    // Marketplace specific
    listingPrice: 18.9,
    seller: "0x1234...abcd",
    listingTime: "2 hours ago"
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
    volume24h: 23.1,
    // Marketplace specific
    listingPrice: 4.5,
    seller: "0x5678...efgh",
    listingTime: "5 hours ago"
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
    volume24h: 12.8,
    // Marketplace specific
    listingPrice: 1.2,
    seller: "0x9abc...ijkl",
    listingTime: "1 day ago"
  }
];

export default function MarketplacePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('PRICE_LOW');

  const handleCardPurchase = (agentId: string, rarity: string) => {
    console.log(`Purchase ${rarity} card for agent ${agentId} from marketplace`);
    alert(`Purchasing ${rarity} card from marketplace! 💰`);
  };

  const handleCardTrade = (agentId: string) => {
    console.log(`View trading options for ${agentId}`);
    alert(`Opening trading options for ${agentId}! 📊`);
  };

  // Filter and sort listings
  const filteredListings = marketplaceListings
    .filter(listing => selectedRarity === 'ALL' || listing.rarity === selectedRarity)
    .sort((a, b) => {
      switch (sortBy) {
        case 'PRICE_LOW':
          return a.listingPrice - b.listingPrice;
        case 'PRICE_HIGH':
          return b.listingPrice - a.listingPrice;
        case 'PERFORMANCE':
          return b.performanceScore - a.performanceScore;
        default:
          return 0;
      }
    });

  const rarities = ['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
  const sortOptions = [
    { value: 'PRICE_LOW', label: 'Price: Low to High' },
    { value: 'PRICE_HIGH', label: 'Price: High to Low' },
    { value: 'PERFORMANCE', label: 'Performance: High to Low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Marketplace Header */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          
          {/* Status Badge */}
          <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            <ShoppingBag className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold tracking-wider">LIVE MARKETPLACE</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none mb-8">
            <div className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent mb-4">
              TRADE
            </div>
            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI CARDS
            </div>
          </h1>
          
          {/* Power Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-light max-w-4xl mx-auto leading-relaxed">
            Buy and sell AI agent cards from other collectors at market prices
          </p>
          
          {/* Marketplace Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: "47", label: "Cards Listed", color: "green" },
              { value: "23.7 SOL", label: "24h Volume", color: "blue" },
              { value: "156", label: "Active Traders", color: "purple" },
              { value: "0.9 SOL", label: "Floor Price", color: "yellow" }
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

      {/* Marketplace Interface */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Filter & Sort Controls */}
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
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  {rarity === 'ALL' ? 'All Rarities' : rarity}
                </button>
              ))}
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:border-green-500/50 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Marketplace Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map((listing) => (
              <div key={`${listing.address}-${listing.seller}`} className="relative">
                {/* Marketplace Overlay */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-green-600 text-white font-bold text-xs">
                  FOR SALE
                </div>
                
                <AgentTradingCard
                  agent={listing}
                  userCards={0}
                  onMint={(agentId, rarity) => handleCardPurchase(agentId, rarity)}
                  onTrade={handleCardTrade}
                  context="marketplace"
                />
                
                {/* Listing Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/80 backdrop-blur-sm border border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Seller:</span>
                    <span className="text-white font-mono">{listing.seller}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-400">Listed:</span>
                    <span className="text-gray-300">{listing.listingTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-400 font-bold text-lg">
                      {listing.listingPrice} SOL
                    </span>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm transition-all">
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Listings Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or check back later for new listings.</p>
              <a
                href="/collect"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all"
              >
                <span>Browse Collection Instead</span>
              </a>
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