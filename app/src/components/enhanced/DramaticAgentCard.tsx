'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Bot,
  Users,
  DollarSign,
  Lock,
  Unlock
} from 'lucide-react';

interface DramaticAgentCardProps {
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

export default function DramaticAgentCard({ 
  agent, 
  userKeys = 0, 
  onKeyPurchase 
}: DramaticAgentCardProps) {
  const [isPurchasing, setIsPurchasing] = useState<'BASIC' | 'PREMIUM' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasBasicAccess = userKeys >= 1;
  const hasPremiumAccess = userKeys >= 3;
  
  const handlePurchase = async (tier: 'BASIC' | 'PREMIUM') => {
    if (!onKeyPurchase) return;
    
    setIsPurchasing(tier);
    
    setTimeout(() => {
      onKeyPurchase(agent.address, tier);
      setIsPurchasing(null);
    }, 1500);
  };

  const getCategoryTheme = (category: string) => {
    const themes = {
      'Trading': {
        gradient: 'from-green-400 to-emerald-600',
        bgGradient: 'from-green-900/20 via-emerald-900/10 to-green-900/20',
        borderColor: 'border-green-500/30',
        hoverBorder: 'hover:border-green-400/60',
        icon: '📈',
        glow: 'shadow-green-500/30'
      },
      'Research': {
        gradient: 'from-blue-400 to-cyan-600',
        bgGradient: 'from-blue-900/20 via-cyan-900/10 to-blue-900/20',
        borderColor: 'border-blue-500/30',
        hoverBorder: 'hover:border-blue-400/60',
        icon: '🔬',
        glow: 'shadow-blue-500/30'
      },
      'Alerts': {
        gradient: 'from-orange-400 to-red-600',
        bgGradient: 'from-orange-900/20 via-red-900/10 to-orange-900/20',
        borderColor: 'border-orange-500/30',
        hoverBorder: 'hover:border-orange-400/60',
        icon: '🚨',
        glow: 'shadow-orange-500/30'
      },
      'DeFi': {
        gradient: 'from-purple-400 to-violet-600',
        bgGradient: 'from-purple-900/20 via-violet-900/10 to-purple-900/20',
        borderColor: 'border-purple-500/30',
        hoverBorder: 'hover:border-purple-400/60',
        icon: '⚡',
        glow: 'shadow-purple-500/30'
      }
    };
    return themes[category as keyof typeof themes] || themes['Research'];
  };

  const theme = getCategoryTheme(agent.category);
  const change = agent.change24h || 5.2;

  return (
    <div 
      className="group relative transform transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Main Card */}
      <div className={`
        relative overflow-hidden rounded-3xl 
        bg-gradient-to-br ${theme.bgGradient}
        backdrop-blur-xl border-2 ${theme.borderColor} ${theme.hoverBorder}
        transition-all duration-500
        ${isHovered ? `shadow-2xl ${theme.glow}` : 'shadow-xl shadow-black/50'}
      `}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header Section */}
        <div className="relative p-8 pb-6">
          
          {/* Online Status Indicator */}
          {agent.isOnline && (
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-green-400 text-sm font-bold">LIVE</span>
            </div>
          )}
          
          {/* Agent Avatar & Category */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`
                relative w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.gradient}
                flex items-center justify-center text-white font-black text-2xl
                shadow-2xl transform transition-transform duration-300 group-hover:rotate-3
              `}>
                {agent.symbol.substring(0, 2)}
                
                {/* Sparkle Effect */}
                {isHovered && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-2xl font-black text-white mb-1 tracking-tight">
                  {agent.name}
                </div>
                <div className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
                  bg-gradient-to-r ${theme.gradient} text-white shadow-lg
                `}>
                  <span className="mr-2 text-lg">{theme.icon}</span>
                  {agent.category}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Score - MASSIVE */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className={`text-6xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
                {agent.performanceScore}%
              </div>
              <div className="text-gray-400 font-bold tracking-widest">PERFORMANCE</div>
              
              {/* Performance Ring */}
              <div className="absolute -inset-4 rounded-full border-4 border-gray-700/30" />
              <div 
                className={`absolute -inset-4 rounded-full border-4 border-transparent border-t-green-400 animate-spin`}
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-center text-lg leading-relaxed mb-6 min-h-[3rem]">
            {agent.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className="text-2xl font-black text-white">{agent.totalKeys}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Keys</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className="text-2xl font-black text-blue-400">{agent.holders}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Holders</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className={`text-2xl font-black flex items-center justify-center space-x-1 ${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {change >= 0 ? 
                  <TrendingUp className="w-5 h-5" /> : 
                  <TrendingDown className="w-5 h-5" />
                }
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">24H</div>
            </div>
          </div>
        </div>

        {/* Access Tiers Section */}
        <div className="relative p-8 pt-4 bg-black/30 backdrop-blur-sm">
          
          {/* Current Access Status */}
          {userKeys > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-bold text-lg">
                  You own {userKeys} key{userKeys > 1 ? 's' : ''} • {hasPremiumAccess ? 'Premium' : 'Basic'} Access
                </span>
              </div>
            </div>
          )}

          {/* Tier Selection */}
          <div className="space-y-4">
            
            {/* Basic Tier */}
            <div className={`
              relative overflow-hidden rounded-2xl border-2 transition-all duration-300
              ${hasBasicAccess 
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50' 
                : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600/30 hover:border-blue-500/50 hover:scale-[1.02]'
              }
            `}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {hasBasicAccess ? 
                      <Unlock className="w-8 h-8 text-green-400" /> :
                      <Lock className="w-8 h-8 text-gray-400" />
                    }
                    <div>
                      <div className="text-xl font-bold text-white">BASIC ACCESS</div>
                      <div className="text-sm text-gray-400">1 key • $5 total</div>
                    </div>
                  </div>
                  
                  <button
                    className={`
                      px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform
                      ${hasBasicAccess 
                        ? 'bg-green-500 text-white cursor-default' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-2xl hover:scale-110 hover:shadow-blue-500/50'
                      }
                      ${isPurchasing === 'BASIC' ? 'animate-pulse' : ''}
                    `}
                    onClick={() => !hasBasicAccess && handlePurchase('BASIC')}
                    disabled={hasBasicAccess || isPurchasing === 'BASIC'}
                  >
                    {isPurchasing === 'BASIC' ? 'PROCESSING...' : hasBasicAccess ? 'OWNED ✓' : 'BUY $5'}
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Tier */}
            <div className={`
              relative overflow-hidden rounded-2xl border-2 transition-all duration-300
              ${hasPremiumAccess 
                ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/50' 
                : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600/30 hover:border-purple-500/50 hover:scale-[1.02]'
              }
            `}>
              {/* Premium Badge */}
              {!hasPremiumAccess && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xs px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  PREMIUM
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {hasPremiumAccess ? 
                      <Zap className="w-8 h-8 text-purple-400" /> :
                      <Zap className="w-8 h-8 text-gray-400" />
                    }
                    <div>
                      <div className="text-xl font-bold text-white">PREMIUM ACCESS</div>
                      <div className="text-sm text-gray-400">3+ keys • $15+ total</div>
                    </div>
                  </div>
                  
                  <button
                    className={`
                      px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform
                      ${hasPremiumAccess 
                        ? 'bg-purple-500 text-white cursor-default' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-2xl hover:scale-110 hover:shadow-purple-500/50'
                      }
                      ${isPurchasing === 'PREMIUM' ? 'animate-pulse' : ''}
                    `}
                    onClick={() => !hasPremiumAccess && handlePurchase('PREMIUM')}
                    disabled={hasPremiumAccess || isPurchasing === 'PREMIUM'}
                  >
                    {isPurchasing === 'PREMIUM' ? 'PROCESSING...' : 
                     hasPremiumAccess ? 'OWNED ✓' : 
                     hasBasicAccess ? 'UPGRADE $10' : 'BUY $15'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <a
            href={`/agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="
              mt-6 flex items-center justify-center space-x-3 p-4 
              rounded-2xl border-2 border-gray-600/30 
              text-gray-300 hover:text-white hover:border-white/50
              transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20
              backdrop-blur-xl font-bold text-lg
            "
          >
            <Bot className="w-6 h-6" />
            <span>VIEW AGENT DETAILS</span>
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
          </a>
        </div>
      </div>
    </div>
  );
}