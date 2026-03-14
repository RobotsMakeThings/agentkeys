'use client';

import React, { useState } from 'react';
import AgentTradingCard from '@/components/cards/AgentTradingCard';
import { Star, TrendingUp, BarChart3, Wallet, Crown, Award, PlusCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock user's portfolio (in production, fetch from wallet)
const userPortfolio = [
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
    // Portfolio specific
    ownedQuantity: 1,
    purchasePrice: 12.5,
    currentValue: 15.2,
    gainLoss: 21.6 // percentage
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
    // Portfolio specific
    ownedQuantity: 2,
    purchasePrice: 3.2,
    currentValue: 3.8,
    gainLoss: 18.75
  }
];

export default function PortfolioPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected, publicKey } = useWallet();

  // Calculate portfolio stats
  const totalInvested = userPortfolio.reduce((sum, card) => sum + (card.purchasePrice * card.ownedQuantity), 0);
  const currentValue = userPortfolio.reduce((sum, card) => sum + (card.currentValue * card.ownedQuantity), 0);
  const totalGain = currentValue - totalInvested;
  const totalGainPercent = ((totalGain / totalInvested) * 100);

  const handleCardSell = (agentId: string, rarity: string) => {
    console.log(`List ${rarity} card for sale: ${agentId}`);
    alert(`Listing ${rarity} card for sale! 💰`);
  };

  const handleCardTrade = (agentId: string) => {
    console.log(`View trading options for ${agentId}`);
    alert(`Opening trading options for ${agentId}! 📊`);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8">
            Connect your wallet to view your AgentCards collection and manage your portfolio.
          </p>
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-500 hover:!to-pink-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Portfolio Header */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Wallet Info */}
          <div className="text-center mb-12">
            <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl">
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-bold tracking-wider">MY PORTFOLIO</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-none mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Your Collection
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-8">
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
            </p>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-purple-500/30">
              <div className="text-3xl font-black text-purple-400 mb-1">
                {userPortfolio.reduce((sum, card) => sum + card.ownedQuantity, 0)}
              </div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Total Cards</div>
            </div>
            
            <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-blue-500/30">
              <div className="text-3xl font-black text-blue-400 mb-1">
                {totalInvested.toFixed(1)} SOL
              </div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Invested</div>
            </div>
            
            <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-green-500/30">
              <div className="text-3xl font-black text-green-400 mb-1">
                {currentValue.toFixed(1)} SOL
              </div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">Current Value</div>
            </div>
            
            <div className={`p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border ${totalGain >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
              <div className={`text-3xl font-black mb-1 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}%
              </div>
              <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">P&L</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Collection */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {userPortfolio.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Your Cards
                  </span>
                </h2>
                
                <a
                  href="/collect"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Collect More</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {userPortfolio.map((card) => (
                  <div key={card.address} className="relative">
                    {/* Ownership Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-xs">
                      OWNED × {card.ownedQuantity}
                    </div>
                    
                    {/* P&L Badge */}
                    <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full font-bold text-xs ${
                      card.gainLoss >= 0 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {card.gainLoss >= 0 ? '+' : ''}{card.gainLoss.toFixed(1)}%
                    </div>
                    
                    <AgentTradingCard
                      agent={card}
                      userCards={card.ownedQuantity}
                      onMint={(agentId, rarity) => handleCardSell(agentId, rarity)}
                      onTrade={handleCardTrade}
                      context="portfolio"
                    />
                    
                    {/* Portfolio Stats Overlay */}
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Purchase Price</div>
                          <div className="text-white font-bold">{card.purchasePrice} SOL</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Current Value</div>
                          <div className="text-white font-bold">{card.currentValue} SOL</div>
                        </div>
                      </div>
                      
                      <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg text-sm transition-all">
                        LIST FOR SALE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Award className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Cards Yet</h3>
              <p className="text-gray-500 mb-6">Start building your collection of AI agent cards.</p>
              <a
                href="/collect"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all"
              >
                <Star className="w-5 h-5" />
                <span>Start Collecting</span>
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