'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  Zap,
  Crown,
  Gem,
  Sparkles,
  Users,
  Eye,
  ShoppingCart,
  ArrowRight,
  ShoppingBag,
  Award
} from 'lucide-react';

interface AgentTradingCardProps {
  agent: {
    address: string;
    name: string;
    symbol: string;
    category: string;
    description: string;
    performanceScore: number;
    isOnline: boolean;
    change24h?: number;
    // New Card-Specific Properties
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    totalSupply: number;
    mintedSupply: number;
    floorPrice: number;
    lastSale: number;
    holders: number;
    volume24h: number;
  };
  userCards?: number;
  onMint?: (agentId: string, rarity: string) => void;
  onTrade?: (agentId: string) => void;
}

export default function AgentTradingCard({ 
  agent, 
  userCards = 0, 
  onMint,
  onTrade 
}: AgentTradingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  
  const hasCards = userCards > 0;
  const soldOut = agent.mintedSupply >= agent.totalSupply;
  const mintProgress = (agent.mintedSupply / agent.totalSupply) * 100;
  
  const handleMint = async () => {
    if (!onMint || soldOut) return;
    
    setIsMinting(true);
    setTimeout(() => {
      onMint(agent.address, agent.rarity);
      setIsMinting(false);
    }, 2000);
  };

  const getRarityTheme = (rarity: string) => {
    const themes = {
      'COMMON': {
        gradient: 'from-gray-400 to-gray-600',
        bgGradient: 'from-gray-900/40 via-gray-800/30 to-gray-900/40',
        borderColor: 'border-gray-500/40',
        hoverBorder: 'hover:border-gray-400/70',
        glow: 'shadow-gray-500/20',
        icon: '⚪',
        textColor: 'text-gray-300',
        supply: '500'
      },
      'RARE': {
        gradient: 'from-blue-400 to-cyan-600',
        bgGradient: 'from-blue-900/40 via-cyan-900/30 to-blue-900/40',
        borderColor: 'border-blue-500/40',
        hoverBorder: 'hover:border-blue-400/70',
        glow: 'shadow-blue-500/30',
        icon: '🔵',
        textColor: 'text-blue-300',
        supply: '100'
      },
      'EPIC': {
        gradient: 'from-purple-400 to-violet-600',
        bgGradient: 'from-purple-900/40 via-violet-900/30 to-purple-900/40',
        borderColor: 'border-purple-500/40',
        hoverBorder: 'hover:border-purple-400/70',
        glow: 'shadow-purple-500/30',
        icon: '🟣',
        textColor: 'text-purple-300',
        supply: '25'
      },
      'LEGENDARY': {
        gradient: 'from-yellow-400 to-orange-600',
        bgGradient: 'from-yellow-900/40 via-orange-900/30 to-yellow-900/40',
        borderColor: 'border-yellow-500/40',
        hoverBorder: 'hover:border-yellow-400/70',
        glow: 'shadow-yellow-500/40',
        icon: '👑',
        textColor: 'text-yellow-300',
        supply: '5'
      },
      'MYTHIC': {
        gradient: 'from-pink-400 via-purple-500 to-cyan-400',
        bgGradient: 'from-pink-900/40 via-purple-900/30 to-cyan-900/40',
        borderColor: 'border-pink-500/40',
        hoverBorder: 'hover:border-pink-400/70',
        glow: 'shadow-pink-500/50',
        icon: '💎',
        textColor: 'text-pink-300',
        supply: '1'
      }
    };
    return themes[rarity as keyof typeof themes] || themes['COMMON'];
  };

  const theme = getRarityTheme(agent.rarity);
  const change = agent.change24h || (Math.random() * 20 - 5); // Mock change for demo

  return (
    <div 
      className="group relative transform transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Outer Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
      
      {/* Main Trading Card */}
      <div className={`
        relative overflow-hidden rounded-3xl aspect-[2/3] w-full max-w-sm mx-auto
        bg-gradient-to-br ${theme.bgGradient} backdrop-blur-xl 
        border-2 ${theme.borderColor} ${theme.hoverBorder}
        transition-all duration-500
        ${isHovered ? `shadow-2xl ${theme.glow}` : 'shadow-xl shadow-black/30'}
      `}>
        
        {/* Card Header - Rarity & Supply */}
        <div className="relative p-4 pb-2">
          
          {/* Rarity Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white font-black text-xs shadow-lg flex items-center space-x-1`}>
            <span>{theme.icon}</span>
            <span>{agent.rarity}</span>
          </div>
          
          {/* Online Status */}
          {agent.isOnline && (
            <div className="absolute top-3 left-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-green-400 text-xs font-bold">LIVE</span>
            </div>
          )}
        </div>

        {/* Agent Avatar Section */}
        <div className="px-6 pb-4">
          <div className="relative">
            {/* Main Avatar */}
            <div className={`
              relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${theme.gradient}
              flex items-center justify-center text-white font-black text-3xl
              shadow-2xl transform transition-transform duration-300 group-hover:rotate-6
            `}>
              {agent.symbol.substring(0, 2)}
              
              {/* Holographic Effect */}
              {isHovered && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse" />
              )}
            </div>
            
            {/* Performance Ring */}
            <div className="absolute -inset-2 rounded-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={`url(#gradient-${agent.address})`}
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${agent.performanceScore * 2.83} 283`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id={`gradient-${agent.address}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Performance Score */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full">
                  {agent.performanceScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="px-6 pb-4 text-center">
          <h3 className="text-xl font-black text-white mb-1 truncate">{agent.name}</h3>
          <p className={`text-sm ${theme.textColor} font-medium mb-2`}>{agent.category}</p>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 min-h-[2rem]">
            {agent.description}
          </p>
        </div>

        {/* Card Stats */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Supply Progress */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Supply</span>
                <span className="text-xs font-bold text-white">
                  {agent.mintedSupply}/{agent.totalSupply}
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-1000`}
                  style={{ width: `${mintProgress}%` }}
                />
              </div>
            </div>
            
            {/* Floor Price */}
            <div className="text-center p-2 rounded-xl bg-black/20">
              <div className="text-xs text-gray-400">Floor</div>
              <div className="text-sm font-bold text-green-400">
                {agent.floorPrice.toFixed(1)} SOL
              </div>
            </div>
            
            {/* 24h Change */}
            <div className="text-center p-2 rounded-xl bg-black/20">
              <div className="text-xs text-gray-400">24h</div>
              <div className={`text-sm font-bold flex items-center justify-center space-x-1 ${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {change >= 0 ? 
                  <TrendingUp className="w-3 h-3" /> : 
                  <TrendingDown className="w-3 h-3" />
                }
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Collection Status */}
        {hasCards && (
          <div className="mx-6 mb-4 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold text-sm">
                You own {userCards} card{userCards > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          
          {/* Mint/Buy Button */}
          {!soldOut ? (
            <button
              onClick={handleMint}
              disabled={isMinting}
              className={`
                w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform
                ${isMinting 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : `bg-gradient-to-r ${theme.gradient} hover:shadow-2xl hover:scale-105 text-white hover:shadow-${agent.rarity.toLowerCase()}-500/50`
                }
                min-h-[44px] touch-manipulation
              `}
            >
              {isMinting ? 'MINTING...' : `MINT ${agent.floorPrice.toFixed(1)} SOL`}
            </button>
          ) : (
            <div className="w-full px-4 py-3 rounded-xl bg-gray-700/50 text-gray-400 font-bold text-sm text-center">
              SOLD OUT
            </div>
          )}
          
          {/* Marketplace Button */}
          <button
            onClick={() => onTrade?.(agent.address)}
            className="
              w-full flex items-center justify-center space-x-2 px-4 py-3 
              rounded-xl border-2 border-gray-600/30 
              text-gray-300 hover:text-white hover:border-white/50
              transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20
              backdrop-blur-xl font-bold text-sm
              min-h-[44px] touch-manipulation
            "
          >
            <ShoppingCart className="w-4 h-4" />
            <span>MARKETPLACE</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
        
        {/* Holographic Shine Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
      </div>
    </div>
  );
}