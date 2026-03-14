'use client';

import React from 'react';
import BondingCurveCard from '@/components/cards/BondingCurveCard';
import { Star, TrendingUp, Users, Crown } from 'lucide-react';

// Mock data demonstrating the new bonding curve system with 10% agent allocation
const bondingCurveAgents = [
  {
    address: "oshi-flagship",
    name: "Oshi",
    symbol: "OS",
    category: "Trading",
    description: "Professional trading signals with 92% win rate. Real-time analysis and market insights from proven algorithms.",
    performanceScore: 94,
    isOnline: true,
    // New bonding curve system
    totalSupply: 1000,      // Total cards
    bondingSupply: 900,     // 90% available on bonding curve
    agentAllocation: 100,   // 10% for agent to give away free
    bondingMinted: 642,     // Cards sold via bonding curve
    allocationUsed: 37,     // Free cards distributed by agent
    totalHolders: 561,      // Unique holders (642 + 37 - 118 duplicates)
    currentPrice: 0.186,    // Current bonding curve price (logarithmic)
    nextPrice: 0.187,       // Price of next card
    tier: 'ESTABLISHED' as const,
    premiumTiers: [
      {
        name: "Alpha Access",
        supply: 50,
        price: 2.5,
        sold: 31,
        features: ["Real-time alpha signals", "Private Discord access", "Weekly strategy calls"]
      },
      {
        name: "VIP Whale",
        supply: 10,
        price: 15,
        sold: 7,
        features: ["1-on-1 consultations", "Custom portfolio analysis", "Revenue sharing"]
      }
    ]
  },
  {
    address: "research-beta",
    name: "CryptoResearch AI",
    symbol: "CR",
    category: "Research",
    description: "Deep market research and fundamental analysis. Comprehensive sector reports and trend identification.",
    performanceScore: 78,
    isOnline: true,
    // Beta tier agent
    totalSupply: 500,       // Smaller total supply for beta
    bondingSupply: 450,     // 90% on bonding curve
    agentAllocation: 50,    // 10% agent allocation
    bondingMinted: 156,     // Still growing
    allocationUsed: 23,     // Agent giving away free cards strategically
    totalHolders: 167,      // Good engagement
    currentPrice: 0.067,    // Lower prices due to beta status
    nextPrice: 0.068,
    tier: 'BETA' as const
    // No premium tiers yet (hasn't reached 70% bonding curve)
  },
  {
    address: "alert-engine",
    name: "AlertBot Pro", 
    symbol: "AL",
    category: "Alerts",
    description: "High-frequency trading alerts with social sentiment analysis. Catch trends before they explode.",
    performanceScore: 88,
    isOnline: true,
    // Growth tier agent
    totalSupply: 500,
    bondingSupply: 450,
    agentAllocation: 50,
    bondingMinted: 389,     // Almost sold out bonding curve
    allocationUsed: 44,     // Used most free allocation for community building
    totalHolders: 398,      // High engagement from free cards
    currentPrice: 0.142,    // Near max for alerts category
    nextPrice: 0.143,
    tier: 'GROWTH' as const,
    premiumTiers: [
      {
        name: "Pro Alerts",
        supply: 100,
        price: 1.2,
        sold: 67,
        features: ["Sub-second alerts", "Custom filters", "API access"]
      }
    ]
  },
  {
    address: "elite-trader",
    name: "Quantum Hedge",
    symbol: "QH", 
    category: "Trading",
    description: "Institutional-grade trading algorithms with systematic alpha generation. Proven track record managing $50M+.",
    performanceScore: 97,
    isOnline: true,
    // Elite tier agent
    totalSupply: 1500,      // Large supply for institutional reach
    bondingSupply: 1350,    // 90% on bonding curve
    agentAllocation: 150,   // 10% agent allocation
    bondingMinted: 1350,    // SOLD OUT bonding curve
    allocationUsed: 89,     // Selective with free cards
    totalHolders: 1247,     // Some holders have multiple cards
    currentPrice: 0.5,      // Max price reached
    nextPrice: 0,           // No more cards on bonding curve
    tier: 'ELITE' as const,
    premiumTiers: [
      {
        name: "Professional",
        supply: 200,
        price: 5,
        sold: 200,          // Sold out
        features: ["Professional signals", "Risk management", "Portfolio optimization"]
      },
      {
        name: "Institutional",
        supply: 50,
        price: 25,
        sold: 42,
        features: ["Institutional access", "Custom strategies", "Direct alpha feed"]
      },
      {
        name: "Legendary",
        supply: 10,
        price: 100,
        sold: 8,
        features: ["Co-investment opportunities", "Strategy licensing", "Revenue sharing"]
      }
    ]
  }
];

export default function BondingDemoPage() {
  const handlePurchaseBasic = (agentId: string, quantity: number) => {
    console.log(`Purchase ${quantity} cards from bonding curve for ${agentId}`);
    alert(`Purchasing ${quantity} cards from bonding curve! This would trigger smart contract mint.`);
  };

  const handlePurchasePremium = (agentId: string, tierIndex: number) => {
    const agent = bondingCurveAgents.find(a => a.address === agentId);
    const tier = agent?.premiumTiers?.[tierIndex];
    console.log(`Purchase premium tier ${tier?.name} for ${agentId}`);
    alert(`Purchasing ${tier?.name} tier for ${tier?.price} SOL!`);
  };

  const handleRequestFree = (agentId: string) => {
    console.log(`Request free card from ${agentId}`);
    alert(`Requesting free card from agent! This would notify the agent owner who can approve the distribution.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      
      {/* Header */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-xl">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold tracking-wider">NEW BONDING CURVE SYSTEM</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-none mb-8">
            <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              IMPROVED
            </div>
            <div className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              AGENT CARDS
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            90% bonding curve + 10% agent allocation for perfect community building
          </p>
          
          {/* System Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: TrendingUp, 
                title: "Logarithmic Pricing", 
                desc: "More accessible with $0.50-$15 range",
                color: "blue" 
              },
              { 
                icon: Users, 
                title: "Agent Allocation", 
                desc: "10% for free community building",
                color: "green" 
              },
              { 
                icon: Crown, 
                title: "Tier Progression", 
                desc: "BETA → GROWTH → ESTABLISHED → ELITE",
                color: "purple" 
              },
              { 
                icon: Star, 
                title: "Fair Discovery", 
                desc: "Market determines agent value",
                color: "yellow" 
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className={`p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-${feature.color}-500/30 hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-${feature.color}-500/20`}
              >
                <feature.icon className={`w-8 h-8 text-${feature.color}-400 mx-auto mb-3`} />
                <h3 className={`text-lg font-bold text-${feature.color}-400 mb-2`}>{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonding Curve Cards Demo */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Live Bonding Curve System
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              See how different agent tiers work with the new 90/10 split system. Notice the logarithmic pricing, agent allocations, and tier-specific parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {bondingCurveAgents.map((agent) => (
              <BondingCurveCard
                key={agent.address}
                agent={agent}
                onPurchaseBasic={handlePurchaseBasic}
                onPurchasePremium={handlePurchasePremium}
                onRequestFree={handleRequestFree}
              />
            ))}
          </div>

          {/* System Explanation */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              How the New System Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <h4 className="font-bold text-blue-400 mb-2">📊 Bonding Curve (90%)</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Logarithmic pricing for accessibility</li>
                  <li>• Category-specific max prices</li>
                  <li>• Market-driven price discovery</li>
                  <li>• Agent gets 97.5% of revenue</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <h4 className="font-bold text-green-400 mb-2">🎁 Agent Allocation (10%)</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Free cards for community building</li>
                  <li>• Contests, partnerships, rewards</li>
                  <li>• Cannot be sold on bonding curve</li>
                  <li>• Can trade on secondary market</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <h4 className="font-bold text-purple-400 mb-2">💎 Premium Tiers</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Unlock at 70% bonding curve sold</li>
                  <li>• Agent-defined pricing & features</li>
                  <li>• Up to 4 additional tiers</li>
                  <li>• Community approval required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}