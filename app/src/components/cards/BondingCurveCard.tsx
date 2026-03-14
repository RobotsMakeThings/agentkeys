'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Star,
  Crown,
  Users,
  Clock,
  Plus,
  Lock,
  Unlock
} from 'lucide-react';

interface BondingCurveCardProps {
  agent: {
    address: string;
    name: string;
    symbol: string;
    category: string;
    description: string;
    performanceScore: number;
    isOnline: boolean;
    // Bonding curve specific (NEW SYSTEM)
    totalSupply: number; // total cards (e.g., 1000)
    bondingSupply: number; // bonding curve cards (e.g., 900) 
    agentAllocation: number; // agent free cards (e.g., 100)
    bondingMinted: number; // sold via bonding curve
    allocationUsed: number; // distributed for free
    totalHolders: number; // unique holders (paid + free)
    currentPrice: number; // current bonding curve price
    nextPrice: number; // price of next card
    tier: 'BETA' | 'GROWTH' | 'ESTABLISHED' | 'ELITE';
    premiumTiers?: {
      name: string;
      supply: number;
      price: number;
      sold: number;
      features: string[];
    }[];
  };
  onPurchaseBasic?: (agentId: string, quantity: number) => void;
  onPurchasePremium?: (agentId: string, tierIndex: number) => void;
  onRequestFree?: (agentId: string) => void;
}

export default function BondingCurveCard({ 
  agent, 
  onPurchaseBasic,
  onPurchasePremium,
  onRequestFree
}: BondingCurveCardProps) {
  const [quantity, setQuantity] = useState(1);
  
  // Calculate progress based on bonding curve supply only
  const bondingProgressPercent = (agent.bondingMinted / agent.bondingSupply) * 100;
  const isBondingSoldOut = agent.bondingMinted >= agent.bondingSupply;
  const allocationRemaining = agent.agentAllocation - agent.allocationUsed;
  
  // Calculate total cost for quantity
  const calculateTotalCost = (qty: number) => {
    let totalCost = 0;
    for (let i = 0; i < qty; i++) {
      const cardNumber = agent.bondingMinted + i + 1;
      totalCost += calculateBondingPrice(cardNumber);
    }
    return totalCost;
  };
  
  const calculateBondingPrice = (cardNumber: number) => {
    // Improved logarithmic curve for better accessibility
    const startPrice = 0.01;
    const maxPrice = getCategoryMaxPrice(agent.category, agent.tier);
    
    // Only bonding curve cards count toward pricing
    const progress = (cardNumber - 1) / (agent.bondingSupply - 1);
    
    // Logarithmic curve for diminishing price increases
    const logProgress = Math.log(1 + progress * (Math.E - 1)) / Math.log(Math.E);
    
    return startPrice + (logProgress * (maxPrice - startPrice));
  };
  
  const getCategoryMaxPrice = (category: string, tier: string) => {
    const configs: Record<string, Record<string, number>> = {
      'Trading': { 'BETA': 0.15, 'GROWTH': 0.25, 'ESTABLISHED': 0.3, 'ELITE': 0.5 },
      'Research': { 'BETA': 0.12, 'GROWTH': 0.2, 'ESTABLISHED': 0.25, 'ELITE': 0.4 },
      'Alerts': { 'BETA': 0.08, 'GROWTH': 0.12, 'ESTABLISHED': 0.15, 'ELITE': 0.25 },
      'Security': { 'BETA': 0.2, 'GROWTH': 0.3, 'ESTABLISHED': 0.4, 'ELITE': 0.8 }
    };
    return configs[category]?.[tier] || 0.3;
  };

  return (
    <div className="group relative transform transition-all duration-500 hover:scale-105">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20">
        
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {agent.symbol.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <span className="text-sm text-blue-400 font-medium">{agent.category}</span>
              </div>
            </div>
            
            {agent.isOnline && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-bold">LIVE</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {agent.description}
          </p>
        </div>

        {/* Agent Stats Overview */}
        <div className="px-6 pb-2">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-black/20">
              <div className="text-sm font-bold text-blue-400">{agent.totalHolders}</div>
              <div className="text-xs text-gray-500">Holders</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/20">
              <div className="text-sm font-bold text-purple-400">{agent.bondingMinted}</div>
              <div className="text-xs text-gray-500">Sold</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/20">
              <div className="text-sm font-bold text-green-400">{allocationRemaining}</div>
              <div className="text-xs text-gray-500">Free Left</div>
            </div>
          </div>
        </div>

        {/* Bonding Curve Section */}
        <div className="px-6 pb-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-400">BONDING CURVE ({agent.tier})</span>
              <span className="text-sm text-gray-400">
                {agent.bondingMinted}/{agent.bondingSupply} sold
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700/50 rounded-full h-3 mb-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${bondingProgressPercent}%` }}
              />
            </div>
            
            {/* Price Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-black/30">
                <div className="text-lg font-bold text-green-400">
                  {agent.currentPrice.toFixed(3)} SOL
                </div>
                <div className="text-xs text-gray-400">Current Price</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-black/30">
                <div className="text-lg font-bold text-orange-400">
                  {agent.nextPrice.toFixed(3)} SOL
                </div>
                <div className="text-xs text-gray-400">Next Card</div>
              </div>
            </div>

            {/* Purchase Interface */}
            {!isBondingSoldOut ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="text-sm text-gray-400">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                  >
                    {[1,2,3,4,5,10].filter(q => q <= (agent.bondingSupply - agent.bondingMinted)).map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <div className="text-sm text-gray-400">
                    Total: {calculateTotalCost(quantity).toFixed(3)} SOL
                  </div>
                </div>
                
                <button
                  onClick={() => onPurchaseBasic?.(agent.address, quantity)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  BUY {quantity} CARD{quantity > 1 ? 'S' : ''} - {calculateTotalCost(quantity).toFixed(3)} SOL
                </button>
                
                {/* Free Card Request */}
                {allocationRemaining > 0 && onRequestFree && (
                  <button
                    onClick={() => onRequestFree?.(agent.address)}
                    className="w-full px-4 py-2 border border-green-500/50 text-green-400 hover:text-white hover:bg-green-500/20 font-bold rounded-lg transition-all duration-300 text-sm"
                  >
                    REQUEST FREE CARD ({allocationRemaining} available)
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                  <span className="text-orange-400 font-bold">BONDING CURVE SOLD OUT</span>
                </div>
                
                {/* Free Card Request Still Available */}
                {allocationRemaining > 0 && onRequestFree && (
                  <button
                    onClick={() => onRequestFree?.(agent.address)}
                    className="w-full px-4 py-2 border border-green-500/50 text-green-400 hover:text-white hover:bg-green-500/20 font-bold rounded-lg transition-all duration-300 text-sm"
                  >
                    REQUEST FREE CARD ({allocationRemaining} available)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Agent Allocation Section */}
        {agent.agentAllocation > 0 && (
          <div className="border-t border-gray-700/50 px-6 py-4">
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-green-400">AGENT ALLOCATION (Free Distribution)</span>
                <span className="text-sm text-gray-400">
                  {agent.allocationUsed}/{agent.agentAllocation} used
                </span>
              </div>
              
              {/* Allocation Progress Bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${(agent.allocationUsed / agent.agentAllocation) * 100}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                Agent can give away {allocationRemaining} more cards for free to build community
              </div>
            </div>
          </div>
        )}

        {/* Premium Tiers Section */}
        {agent.premiumTiers && agent.premiumTiers.length > 0 && (
          <div className="border-t border-gray-700/50 p-6 pt-4">
            <h4 className="text-sm font-bold text-purple-400 mb-4">PREMIUM TIERS</h4>
            
            <div className="space-y-3">
              {agent.premiumTiers.map((tier, index) => {
                const tierSoldOut = tier.sold >= tier.supply;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      tierSoldOut 
                        ? 'bg-gray-800/30 border-gray-600/30' 
                        : 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Crown className={`w-4 h-4 ${tierSoldOut ? 'text-gray-500' : 'text-purple-400'}`} />
                        <span className={`font-bold text-sm ${tierSoldOut ? 'text-gray-500' : 'text-white'}`}>
                          {tier.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${tierSoldOut ? 'text-gray-500' : 'text-purple-400'}`}>
                          {tier.price} SOL
                        </div>
                        <div className="text-xs text-gray-500">
                          {tier.sold}/{tier.supply}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-3">
                      {tier.features.slice(0, 2).join(' • ')}
                    </div>
                    
                    <button
                      onClick={() => !tierSoldOut && onPurchasePremium?.(agent.address, index)}
                      disabled={tierSoldOut}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                        tierSoldOut
                          ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                      }`}
                    >
                      {tierSoldOut ? 'SOLD OUT' : `BUY ${tier.name.toUpperCase()}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Tier Button (for agent owners) */}
        {agent.bondingMinted >= (agent.bondingSupply * 0.7) && (!agent.premiumTiers || agent.premiumTiers.length < 4) && (
          <div className="border-t border-gray-700/50 p-6 pt-4">
            <button className="w-full px-4 py-3 border-2 border-dashed border-gray-600/50 text-gray-400 hover:text-white hover:border-gray-500/50 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-bold">ADD PREMIUM TIER</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}