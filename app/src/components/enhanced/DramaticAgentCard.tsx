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
        
        {/* Mobile-Responsive Header Section */}
        <div className="relative p-4 sm:p-6 lg:p-8 pb-3 sm:pb-4 lg:pb-6">
          
          {/* Mobile-Optimized Online Status */}
          {agent.isOnline && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-green-400 text-xs sm:text-sm font-bold">LIVE</span>
            </div>
          )}
          
          {/* Mobile-Friendly Avatar & Category */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`
                relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${theme.gradient}
                flex items-center justify-center text-white font-black text-lg sm:text-xl lg:text-2xl
                shadow-2xl transform transition-transform duration-300 group-hover:rotate-3 flex-shrink-0
              `}>
                {agent.symbol.substring(0, 2)}
                
                {/* Mobile-friendly Sparkle Effect */}
                {isHovered && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-300 animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight truncate">
                  {agent.name}
                </div>
                <div className={`
                  inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold
                  bg-gradient-to-r ${theme.gradient} text-white shadow-lg
                `}>
                  <span className="mr-1 sm:mr-2 text-sm sm:text-lg">{theme.icon}</span>
                  <span className="truncate">{agent.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Performance Score */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="relative inline-block">
              <div className={`text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
                {agent.performanceScore}%
              </div>
              <div className="text-gray-400 font-bold tracking-widest text-xs sm:text-sm">PERFORMANCE</div>
              
              {/* Mobile-friendly Performance Ring */}
              <div className="absolute -inset-2 sm:-inset-3 lg:-inset-4 rounded-full border-2 sm:border-3 lg:border-4 border-gray-700/30" />
              <div 
                className={`absolute -inset-2 sm:-inset-3 lg:-inset-4 rounded-full border-2 sm:border-3 lg:border-4 border-transparent border-t-green-400 animate-spin`}
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>

          {/* Mobile-Optimized Description */}
          <p className="text-gray-300 text-center text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 min-h-[2.5rem] sm:min-h-[3rem] px-2">
            {agent.description}
          </p>

          {/* Mobile-Responsive Stats Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-white">{agent.totalKeys}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Keys</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-blue-400">{agent.holders}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Holders</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className={`text-lg sm:text-xl lg:text-2xl font-black flex items-center justify-center space-x-1 ${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {change >= 0 ? 
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                }
                <span className="text-sm sm:text-lg lg:text-2xl">{Math.abs(change).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">24H</div>
            </div>
          </div>
        </div>

        {/* Mobile-Responsive Access Tiers Section */}
        <div className="relative p-4 sm:p-6 lg:p-8 pt-3 sm:pt-4 bg-black/30 backdrop-blur-sm">
          
          {/* Mobile-Optimized Current Access Status */}
          {userKeys > 0 && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
                <span className="text-green-400 font-bold text-sm sm:text-base lg:text-lg">
                  You own {userKeys} key{userKeys > 1 ? 's' : ''} • {hasPremiumAccess ? 'Premium' : 'Basic'} Access
                </span>
              </div>
            </div>
          )}

          {/* Mobile-Friendly Tier Selection */}
          <div className="space-y-3 sm:space-y-4">
            
            {/* Mobile-Optimized Basic Tier */}
            <div className={`
              relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-300 touch-manipulation
              ${hasBasicAccess 
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50' 
                : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600/30 hover:border-blue-500/50 hover:scale-[1.02]'
              }
            `}>
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {hasBasicAccess ? 
                      <Unlock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-400" /> :
                      <Lock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-400" />
                    }
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-white">BASIC ACCESS</div>
                      <div className="text-xs sm:text-sm text-gray-400">1 key • $5 total</div>
                    </div>
                  </div>
                  
                  <button
                    className={`
                      w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform min-h-[44px] sm:min-h-[48px]
                      ${hasBasicAccess 
                        ? 'bg-green-500 text-white cursor-default' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-2xl hover:scale-105 sm:hover:scale-110 hover:shadow-blue-500/50'
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

            {/* Mobile-Optimized Premium Tier */}
            <div className={`
              relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-300 touch-manipulation
              ${hasPremiumAccess 
                ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/50' 
                : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600/30 hover:border-purple-500/50 hover:scale-[1.02]'
              }
            `}>
              {/* Mobile-friendly Premium Badge */}
              {!hasPremiumAccess && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xs px-2 sm:px-3 py-1 rounded-bl-lg sm:rounded-bl-xl rounded-tr-xl sm:rounded-tr-2xl">
                  PREMIUM
                </div>
              )}
              
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {hasPremiumAccess ? 
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-400" /> :
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-400" />
                    }
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-white">PREMIUM ACCESS</div>
                      <div className="text-xs sm:text-sm text-gray-400">3+ keys • $15+ total</div>
                    </div>
                  </div>
                  
                  <button
                    className={`
                      w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform min-h-[44px] sm:min-h-[48px]
                      ${hasPremiumAccess 
                        ? 'bg-purple-500 text-white cursor-default' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-2xl hover:scale-105 sm:hover:scale-110 hover:shadow-purple-500/50'
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

          {/* Mobile-Optimized View Details Button */}
          <a
            href={`/agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="
              mt-4 sm:mt-6 flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 
              rounded-xl sm:rounded-2xl border-2 border-gray-600/30 
              text-gray-300 hover:text-white hover:border-white/50
              transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20
              backdrop-blur-xl font-bold text-sm sm:text-base lg:text-lg
              min-h-[44px] touch-manipulation
            "
          >
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>VIEW AGENT DETAILS</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-2" />
          </a>
        </div>
      </div>
    </div>
  );
}