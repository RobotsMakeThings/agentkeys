'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Star,
  Zap,
  Lock,
  Check,
  ArrowRight
} from 'lucide-react';
import { ACCESS_TIERS, getTierFromKeys } from '@/lib/constants';
import { ContentTierBadge } from './TierDisplay';

interface Agent {
  address: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  keyPrice: number;
  totalKeys: number;
  holders: number;
  change24h?: number;
  performanceScore?: number;
  isOnline?: boolean;
  content?: Array<{
    tier: string;
    type: string;
    title: string;
  }>;
}

interface SimplifiedAgentCardProps {
  agent: Agent;
  userKeys?: number; // Keys user owns for this agent
  onKeyPurchase?: (agentId: string, tier: keyof typeof ACCESS_TIERS) => void;
  className?: string;
}

export default function SimplifiedAgentCard({ 
  agent, 
  userKeys = 0,
  onKeyPurchase,
  className = '' 
}: SimplifiedAgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const userTier = getTierFromKeys(userKeys);
  const hasBasicAccess = userKeys >= ACCESS_TIERS.BASIC.keysRequired;
  const hasPremiumAccess = userKeys >= ACCESS_TIERS.PREMIUM.keysRequired;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'trading': return <TrendingUp className="w-4 h-4" />;
      case 'research': return <Star className="w-4 h-4" />;
      case 'alerts': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div 
      className={`relative bg-card border border-border rounded-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {agent.symbol.substring(0, 2)}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white">{agent.name}</h3>
                {agent.isOnline && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {getCategoryIcon(agent.category)}
                <span>{agent.category}</span>
              </div>
            </div>
          </div>

          {/* Performance Score */}
          <div className="text-right">
            <div className="text-sm text-gray-400">Performance</div>
            <div className="text-lg font-bold text-green-400">
              {agent.performanceScore || 85}%
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {agent.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              $5
            </div>
            <div className="text-xs text-gray-400">Per Key</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-lg font-bold text-white">
                {formatNumber(agent.holders)}
              </span>
            </div>
            <div className="text-xs text-gray-400">Holders</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold flex items-center justify-center space-x-1 ${
              (agent.change24h || 5.2) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(agent.change24h || 5.2) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(agent.change24h || 5.2).toFixed(1)}%</span>
            </div>
            <div className="text-xs text-gray-400">24h</div>
          </div>
        </div>

        {/* Current Access Status */}
        {userTier && (
          <div className="mb-4">
            <ContentTierBadge 
              requiredTier={userTier} 
              userTier={userTier}
              compact={true}
            />
          </div>
        )}

        {/* Tier Pricing */}
        <div className="space-y-3 mb-4">
          {/* Basic Tier */}
          <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
            hasBasicAccess 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-gray-800/50 border-gray-600'
          }`}>
            <div className="flex items-center space-x-3">
              <Star className={`w-4 h-4 ${hasBasicAccess ? 'text-blue-400' : 'text-gray-500'}`} />
              <div>
                <div className="text-sm font-medium text-white">Basic Access</div>
                <div className="text-xs text-gray-400">Buy 1 key ($5)</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">1 key</span>
              {hasBasicAccess ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <button
                  onClick={() => onKeyPurchase && onKeyPurchase(agent.address, 'BASIC')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white transition-colors"
                >
                  Buy
                </button>
              )}
            </div>
          </div>

          {/* Premium Tier */}
          <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
            hasPremiumAccess 
              ? 'bg-purple-500/10 border-purple-500/30' 
              : 'bg-gray-800/50 border-gray-600'
          }`}>
            <div className="flex items-center space-x-3">
              <Zap className={`w-4 h-4 ${hasPremiumAccess ? 'text-purple-400' : 'text-gray-500'}`} />
              <div>
                <div className="text-sm font-medium text-white">Premium Access</div>
                <div className="text-xs text-gray-400">Buy 3+ keys ($15+)</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">3+ keys</span>
              {hasPremiumAccess ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <button
                  onClick={() => onKeyPurchase && onKeyPurchase(agent.address, 'PREMIUM')}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs text-white transition-colors"
                >
                  {hasBasicAccess ? 'Upgrade' : 'Buy'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/agent/${agent.name.toLowerCase().replace(/\s+/g, '-')}`}>
          <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2">
            <span>View Agent</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Hover Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-xl pointer-events-none" />
      )}

      {/* No Access Overlay */}
      {userKeys === 0 && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-600">
            <Lock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Locked</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Grid component for displaying multiple agent cards
export function AgentGrid({ 
  agents, 
  userKeysMap = {}, 
  onKeyPurchase,
  className = '' 
}: {
  agents: Agent[];
  userKeysMap?: { [agentId: string]: number };
  onKeyPurchase?: (agentId: string, tier: keyof typeof ACCESS_TIERS) => void;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {agents.map((agent) => (
        <SimplifiedAgentCard
          key={agent.address}
          agent={agent}
          userKeys={userKeysMap[agent.address] || 0}
          onKeyPurchase={onKeyPurchase}
        />
      ))}
    </div>
  );
}