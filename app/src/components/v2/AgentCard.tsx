'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Eye,
  Zap,
  Shield,
  Brain,
  Bot,
  BarChart3,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface AgentData {
  id: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  change24h: number;
  holders: number;
  revenue: string;
  description: string;
  capabilities: string[];
  isVerified?: boolean;
  tasksExecuted?: number;
  chartData?: number[];
}

interface AgentCardProps {
  agent: AgentData;
  className?: string;
  showChart?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export default function AgentCard({ 
  agent, 
  className = '', 
  showChart = true,
  priority = 'medium' 
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [priceAnimation, setPriceAnimation] = useState('');
  const [chartPoints, setChartPoints] = useState<string>('');

  // Mock chart data if not provided
  const chartData = agent.chartData || Array.from({ length: 24 }, () => Math.random() * 100);
  
  // Generate SVG path for mini chart
  useEffect(() => {
    if (showChart && chartData.length > 0) {
      const width = 120;
      const height = 32;
      const max = Math.max(...chartData);
      const min = Math.min(...chartData);
      const range = max - min || 1;
      
      const points = chartData.map((value, index) => {
        const x = (index / (chartData.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      }).join(' ');
      
      setChartPoints(points);
    }
  }, [chartData, showChart]);

  // Animate price changes
  useEffect(() => {
    if (agent.change24h !== 0) {
      setPriceAnimation(agent.change24h > 0 ? 'animate-price-up' : 'animate-price-down');
      const timer = setTimeout(() => setPriceAnimation(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [agent.change24h]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'research': return Brain;
      case 'trading': return BarChart3;
      case 'security': return Shield;
      case 'automation': return Zap;
      default: return Bot;
    }
  };

  const CategoryIcon = getCategoryIcon(agent.category);
  const isPositive = agent.change24h >= 0;

  return (
    <div
      className={`card-trading group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/agent/${agent.id}`} className="block p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Agent Avatar */}
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center relative">
              <CategoryIcon className="w-6 h-6 text-white" />
              {agent.isVerified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white">✓</span>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-body font-semibold text-primary">{agent.name}</h3>
                {priority === 'high' && <Sparkles className="w-3 h-3 text-blue" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-mono bg-panel px-2 py-0.5 rounded">
                  {agent.symbol}
                </span>
                <span className="text-xs text-secondary">{agent.category}</span>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-secondary hover:text-blue rounded-lg hover:bg-panel">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Price Section */}
        <div className={`mb-4 p-3 rounded-lg transition-colors ${priceAnimation}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span className="text-heading font-bold text-primary">
                {agent.price.toFixed(3)} SOL
              </span>
            </div>
            
            <div className={`flex items-center gap-1 text-small font-medium ${
              isPositive ? 'text-success' : 'text-danger'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(agent.change24h).toFixed(1)}%
            </div>
          </div>

          {/* Mini Chart */}
          {showChart && chartPoints && (
            <div className="h-8 mb-2">
              <svg width="120" height="32" className="w-full h-full">
                <defs>
                  <linearGradient id={`gradient-${agent.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={isPositive ? '#22C55E' : '#EF4444'} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={isPositive ? '#22C55E' : '#EF4444'} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke={`url(#gradient-${agent.id})`}
                  strokeWidth="2"
                  points={chartPoints}
                  className={`transition-all duration-300 ${isHovered ? 'animate-glow' : ''}`}
                />
              </svg>
            </div>
          )}
        </div>

        {/* Metrics Row */}
        <div className="flex items-center justify-between text-small text-secondary mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{agent.holders.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>{agent.revenue}</span>
          </div>
          
          {agent.tasksExecuted && (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{agent.tasksExecuted}k</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-small text-muted mb-4 line-clamp-2">
          {agent.description}
        </p>

        {/* Capabilities */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-panel text-secondary rounded-md"
              >
                {capability}
              </span>
            ))}
            {agent.capabilities.length > 3 && (
              <span className="text-xs px-2 py-1 bg-panel text-muted rounded-md">
                +{agent.capabilities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <div className="btn btn-ghost btn-sm flex-1 group-hover:bg-panel transition-colors">
            <Eye className="w-4 h-4" />
            View
          </div>
          <div className="btn btn-primary btn-sm flex-1">
            Buy Key
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-md pointer-events-none" />
        )}
      </Link>
    </div>
  );
}

// Add line-clamp utility
const additionalStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}