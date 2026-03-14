'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SimpleModernAgentCardProps {
  agent: {
    address: string;
    name: string;
    symbol: string;
    category: string;
    description: string;
    totalKeys: number;
    holders: number;
    performanceScore: number;
    isOnline: boolean;
    change24h?: number;
  };
  userKeys?: number;
  onKeyPurchase?: (agentId: string, tier: 'BASIC' | 'PREMIUM') => void;
}

export default function SimpleModernAgentCard({ 
  agent, 
  userKeys = 0, 
  onKeyPurchase 
}: SimpleModernAgentCardProps) {
  const [isPurchasing, setIsPurchasing] = useState<'BASIC' | 'PREMIUM' | null>(null);
  
  const hasBasicAccess = userKeys >= 1;
  const hasPremiumAccess = userKeys >= 3;
  
  const handlePurchase = async (tier: 'BASIC' | 'PREMIUM') => {
    if (!onKeyPurchase) return;
    
    setIsPurchasing(tier);
    
    // Simulate purchase process
    setTimeout(() => {
      onKeyPurchase(agent.address, tier);
      setIsPurchasing(null);
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Trading': 'from-green-500 to-emerald-600',
      'Research': 'from-blue-500 to-cyan-600', 
      'Alerts': 'from-orange-500 to-red-600',
      'DeFi': 'from-purple-500 to-violet-600',
      'Infrastructure': 'from-gray-500 to-slate-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-600';
  };

  return (
    <div className="group relative">
      {/* Main Card */}
      <div className="
        relative overflow-hidden rounded-3xl 
        bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90
        backdrop-blur-xl border border-gray-700/50
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20
      ">
        
        {/* Animated Background Gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${getCategoryColor(agent.category)} 
          opacity-5 hover:opacity-10 transition-opacity duration-500
        `} />

        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            
            {/* Agent Avatar & Info */}
            <div className="flex items-center space-x-4">
              <div className={`
                relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryColor(agent.category)}
                flex items-center justify-center text-white font-bold text-xl
                shadow-lg
              `}>
                {agent.symbol.substring(0, 2)}
                
                {/* Online Status */}
                {agent.isOnline && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  bg-gradient-to-r ${getCategoryColor(agent.category)} text-white
                `}>
                  {agent.category}
                </span>
              </div>
            </div>

            {/* Performance Score */}
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Performance</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {agent.performanceScore}%
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
            {agent.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{agent.totalKeys}</div>
              <div className="text-xs text-gray-400">Total Keys</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">{agent.holders}</div>
              <div className="text-xs text-gray-400">Holders</div>
            </div>
            <div>
              <div className={`text-lg font-bold flex items-center justify-center space-x-1 ${
                (agent.change24h || 5.2) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(agent.change24h || 5.2) >= 0 ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span>{Math.abs(agent.change24h || 5.2).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-gray-400">24h</div>
            </div>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="relative p-6 pt-2 border-t border-gray-700/50">
          
          {/* Current Access Status */}
          {userKeys > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  You own {userKeys} key{userKeys > 1 ? 's' : ''} • {hasPremiumAccess ? 'Premium' : 'Basic'} Access
                </span>
              </div>
            </div>
          )}

          {/* Tier Options */}
          <div className="space-y-3">
            
            {/* Basic Tier */}
            <div className={`
              relative p-4 rounded-xl border transition-all duration-300
              ${hasBasicAccess 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-gray-800/50 border-gray-600/30 hover:border-blue-500/30 hover:scale-[1.02]'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className={`w-5 h-5 ${hasBasicAccess ? 'text-green-400' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium text-white">Basic Access</div>
                    <div className="text-sm text-gray-400">1 key • $5 total</div>
                  </div>
                </div>
                
                <button
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${hasBasicAccess 
                      ? 'bg-green-500 text-white cursor-default' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:scale-105'
                    }
                    ${isPurchasing === 'BASIC' ? 'animate-pulse' : ''}
                  `}
                  onClick={() => !hasBasicAccess && handlePurchase('BASIC')}
                  disabled={hasBasicAccess || isPurchasing === 'BASIC'}
                >
                  {isPurchasing === 'BASIC' ? 'Processing...' : hasBasicAccess ? 'Owned' : 'Buy $5'}
                </button>
              </div>
            </div>

            {/* Premium Tier */}
            <div className={`
              relative p-4 rounded-xl border transition-all duration-300
              ${hasPremiumAccess 
                ? 'bg-purple-500/10 border-purple-500/30' 
                : 'bg-gray-800/50 border-gray-600/30 hover:border-purple-500/30 hover:scale-[1.02]'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className={`w-5 h-5 ${hasPremiumAccess ? 'text-purple-400' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium text-white">Premium Access</div>
                    <div className="text-sm text-gray-400">3+ keys • $15+ total</div>
                  </div>
                </div>
                
                <button
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${hasPremiumAccess 
                      ? 'bg-purple-500 text-white cursor-default' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-lg hover:scale-105'
                    }
                    ${isPurchasing === 'PREMIUM' ? 'animate-pulse' : ''}
                  `}
                  onClick={() => !hasPremiumAccess && handlePurchase('PREMIUM')}
                  disabled={hasPremiumAccess || isPurchasing === 'PREMIUM'}
                >
                  {isPurchasing === 'PREMIUM' ? 'Processing...' : 
                   hasPremiumAccess ? 'Owned' : 
                   hasBasicAccess ? 'Upgrade $10' : 'Buy $15'}
                </button>
              </div>
            </div>
          </div>

          {/* View Details Link */}
          <a
            href={`/agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="
              mt-4 flex items-center justify-center space-x-2 p-3 
              rounded-lg border border-gray-600/30 
              text-gray-300 hover:text-white hover:border-gray-500/50
              transition-all duration-300 hover:scale-[1.02]
            "
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}