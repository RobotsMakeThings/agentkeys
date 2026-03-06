'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Eye,
  ArrowUpRight,
  Bot,
  BarChart3,
  Brain,
  Shield,
  Zap
} from 'lucide-react';

interface AgentCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  holders: number;
  type: string;
  revenue: string;
  description: string;
}

export default function EnhancedAgentCard({ 
  id, name, symbol, price, change, holders, type, revenue, description 
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'research': return Brain;
      case 'trading': return BarChart3;
      case 'security': return Shield;
      case 'automation': return Zap;
      default: return Bot;
    }
  };

  const TypeIcon = getTypeIcon(type);
  const isPositive = change >= 0;

  return (
    <div
      className="group relative card-trading p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-500/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-xl pointer-events-none" />
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <TypeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-0.5 rounded">
                {symbol}
              </span>
              <span className="text-xs text-gray-500">{type}</span>
            </div>
          </div>
        </div>

        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-gray-800">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Price Section */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-xl font-bold text-white">
              {price.toFixed(3)} SOL
            </span>
          </div>
          
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>

        {/* Mock Mini Chart */}
        <div className="h-8 flex items-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`w-1 rounded-t transition-all duration-200 ${
                isPositive ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{
                height: `${Math.random() * 32 + 4}px`,
                animationDelay: isHovered ? `${i * 50}ms` : '0ms'
              }}
            />
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{holders.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          <span>{revenue}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-6 line-clamp-2">
        {description}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/agent/${id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>
        
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-blue-500/25">
          Buy Key
        </button>
      </div>
    </div>
  );
}