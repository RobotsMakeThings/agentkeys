'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Crown, 
  Star, 
  Gem, 
  Zap,
  Eye,
  BarChart3,
  MessageSquare,
  Bell,
  Shield,
  Database,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface ApiTier {
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  supply: number;
  price: number;
  icon: React.ElementType;
  color: string;
  features: {
    category: string;
    items: {
      name: string;
      description: string;
      available: boolean;
    }[];
  }[];
}

interface AgentAPITiersProps {
  agentName: string;
  agentCategory: string;
  userOwnedTier?: string;
}

export default function AgentAPITiers({ 
  agentName, 
  agentCategory, 
  userOwnedTier 
}: AgentAPITiersProps) {
  
  // Example: Oshi Trading Agent API Tiers
  const apiTiers: ApiTier[] = [
    {
      name: "COMMON ACCESS",
      rarity: "COMMON",
      supply: 500,
      price: 0.2,
      icon: Lock,
      color: "gray",
      features: [
        {
          category: "Basic Signals",
          items: [
            { name: "Daily Market Summary", description: "End-of-day market analysis", available: true },
            { name: "Major Price Alerts", description: "Alerts for 10%+ moves", available: true },
            { name: "Weekly Performance Report", description: "Agent's trading performance", available: true },
            { name: "Public Discord Access", description: "Community discussion", available: true }
          ]
        },
        {
          category: "API Limits",
          items: [
            { name: "100 API Calls/Day", description: "Rate limited access", available: true },
            { name: "Basic REST API", description: "Standard endpoints only", available: true },
            { name: "15min Delayed Data", description: "Not real-time", available: true }
          ]
        }
      ]
    },
    {
      name: "RARE ACCESS", 
      rarity: "RARE",
      supply: 100,
      price: 1.5,
      icon: Star,
      color: "blue",
      features: [
        {
          category: "Enhanced Signals",
          items: [
            { name: "Real-Time Trading Signals", description: "Live buy/sell signals", available: true },
            { name: "Risk Analysis", description: "Position sizing recommendations", available: true },
            { name: "Market Sentiment Data", description: "Social sentiment scores", available: true },
            { name: "Entry/Exit Alerts", description: "Precise timing signals", available: true }
          ]
        },
        {
          category: "API Features",
          items: [
            { name: "1,000 API Calls/Day", description: "Higher rate limits", available: true },
            { name: "WebSocket Streams", description: "Real-time data feeds", available: true },
            { name: "5min Delayed Data", description: "Near real-time", available: true }
          ]
        },
        {
          category: "Community",
          items: [
            { name: "Private Discord Channel", description: "Rare holders only", available: true },
            { name: "Monthly Q&A", description: "Direct agent interaction", available: true }
          ]
        }
      ]
    },
    {
      name: "EPIC ACCESS",
      rarity: "EPIC", 
      supply: 25,
      price: 5.0,
      icon: Gem,
      color: "purple",
      features: [
        {
          category: "Premium Intelligence",
          items: [
            { name: "Alpha Signals", description: "High-conviction early plays", available: true },
            { name: "Portfolio Analysis", description: "Personal portfolio review", available: true },
            { name: "Custom Alerts", description: "Personalized signal filters", available: true },
            { name: "Research Reports", description: "Deep-dive analysis docs", available: true }
          ]
        },
        {
          category: "API Premium",
          items: [
            { name: "10,000 API Calls/Day", description: "Professional limits", available: true },
            { name: "Real-Time Data", description: "Zero delay feeds", available: true },
            { name: "Historical Data API", description: "Years of backtest data", available: true },
            { name: "Custom Webhooks", description: "Your own integrations", available: true }
          ]
        },
        {
          category: "Direct Access",
          items: [
            { name: "Weekly 1-on-1 Call", description: "15min strategy session", available: true },
            { name: "Priority Support", description: "Fast response times", available: true }
          ]
        }
      ]
    },
    {
      name: "LEGENDARY ACCESS",
      rarity: "LEGENDARY",
      supply: 5, 
      price: 25.0,
      icon: Crown,
      color: "yellow",
      features: [
        {
          category: "Elite Intelligence",
          items: [
            { name: "Pre-Signal Alpha", description: "Signals before public release", available: true },
            { name: "Strategy Co-Creation", description: "Help design trading strategies", available: true },
            { name: "Revenue Sharing", description: "5% of agent's profits", available: true },
            { name: "Exclusive Research", description: "Legendary-only deep research", available: true }
          ]
        },
        {
          category: "Unlimited API",
          items: [
            { name: "Unlimited API Calls", description: "No rate limits", available: true },
            { name: "Custom Endpoints", description: "Bespoke API development", available: true },
            { name: "White-label Access", description: "Rebrand and resell data", available: true }
          ]
        },
        {
          category: "Partnership Level",
          items: [
            { name: "Monthly Strategy Session", description: "60min deep dive call", available: true },
            { name: "Agent Development Input", description: "Influence roadmap", available: true },
            { name: "First Access to New Agents", description: "Early mint privileges", available: true }
          ]
        }
      ]
    }
  ];

  const getTierByRarity = (rarity: string) => {
    return apiTiers.find(tier => tier.rarity === rarity);
  };

  const userTier = userOwnedTier ? getTierByRarity(userOwnedTier) : null;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {agentName} API Access Tiers
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Each NFT card grants API access to {agentName}'s intelligence. Higher rarity = more features and data.
        </p>
        
        {userTier && (
          <div className="mt-6 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30">
            <Unlock className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold">
              You have {userTier.name} - API Enabled
            </span>
          </div>
        )}
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {apiTiers.map((tier, index) => {
          const isOwned = userTier?.rarity === tier.rarity;
          const hasAccess = userTier && apiTiers.findIndex(t => t.rarity === userTier.rarity) >= index;
          
          return (
            <div 
              key={tier.rarity}
              className={`
                relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300
                ${isOwned 
                  ? `bg-gradient-to-br from-${tier.color}-500/20 to-${tier.color}-600/20 border-${tier.color}-500/50 shadow-2xl shadow-${tier.color}-500/20`
                  : hasAccess
                    ? `bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30`
                    : `bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/30`
                }
                hover:scale-105
              `}
            >
              
              {/* Tier Header */}
              <div className="text-center mb-6">
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-${tier.color}-500 to-${tier.color}-600 shadow-lg
                `}>
                  <tier.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                
                <div className="space-y-1 text-sm">
                  <div className="text-gray-400">Supply: {tier.supply}</div>
                  <div className={`text-${tier.color}-400 font-bold`}>
                    {tier.price} SOL
                  </div>
                </div>
                
                {/* Access Status */}
                <div className="mt-3">
                  {isOwned ? (
                    <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                      <Unlock className="w-4 h-4" />
                      <span className="font-bold">OWNED</span>
                    </div>
                  ) : hasAccess ? (
                    <div className="flex items-center justify-center space-x-2 text-blue-400 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>ACCESSIBLE</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {tier.features.map((category, catIndex) => (
                  <div key={catIndex}>
                    <h4 className="text-sm font-bold text-white mb-2">{category.category}</h4>
                    <ul className="space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2 text-xs">
                          <div className={`
                            w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0
                            ${(isOwned || hasAccess) && item.available
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-700/50 text-gray-500'
                            }
                          `}>
                            {(isOwned || hasAccess) && item.available ? '✓' : '×'}
                          </div>
                          <div>
                            <div className={`font-medium ${
                              (isOwned || hasAccess) && item.available ? 'text-white' : 'text-gray-500'
                            }`}>
                              {item.name}
                            </div>
                            <div className="text-gray-400">{item.description}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {isOwned ? (
                  <button className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg cursor-default">
                    OWNED - API ACTIVE
                  </button>
                ) : (
                  <button className={`
                    w-full px-4 py-3 font-bold rounded-lg transition-all duration-300
                    bg-gradient-to-r from-${tier.color}-600 to-${tier.color}-700 
                    hover:from-${tier.color}-500 hover:to-${tier.color}-600 
                    text-white hover:shadow-lg hover:shadow-${tier.color}-500/30
                  `}>
                    MINT {tier.price} SOL
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* API Integration Guide */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🔑 How NFT API Authentication Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-black/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">1. Wallet Verification</h4>
            <p className="text-gray-400 text-sm">
              API checks your wallet for {agentName} NFT cards
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-black/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">2. Access Level Grant</h4>
            <p className="text-gray-400 text-sm">
              Your highest rarity card determines API access level
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-black/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">3. Real-Time Intelligence</h4>
            <p className="text-gray-400 text-sm">
              Instant access to agent's intelligence based on your tier
            </p>
          </div>
        </div>
        
        {/* Code Example */}
        <div className="mt-8 p-4 rounded-lg bg-black/50 border border-gray-700/50">
          <h4 className="font-bold text-white mb-3">Example API Call:</h4>
          <code className="text-green-400 text-sm block">
            {`curl -H "Authorization: Wallet 0x..." https://api.agentcards.io/oshi/signals
// Returns data based on your NFT tier`}
          </code>
        </div>
      </div>
    </div>
  );
}