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
  Zap,
  GitBranch,
  Star,
  Network,
  Clock,
  CheckCircle,
  Activity,
  Award
} from 'lucide-react';

interface CapabilityMetrics {
  githubScore: number;
  socialValidation: number;
  agentAdoption: number;
  performanceScore: number;
  overallCapability: number;
}

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
  creator: string;
  creatorVerified: boolean;
  
  // GitHub Metrics
  githubCommits: number;
  codeQuality: number;
  lastCommit: string;
  
  // Social Validation
  communityScore: number;
  endorsements: number;
  expertReviews: number;
  
  // Agent Economy Signals  
  agentKeys: number; // Keys held by other agents
  agentTransactions: string;
  crossAgentCollabs: number;
  
  // Performance Data
  successRate: number;
  avgResponseTime: string;
  uptime: number;
  
  capabilities: CapabilityMetrics;
}

export default function CapabilityAgentCard(props: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'research': return Brain;
      case 'trading': return BarChart3;
      case 'security': return Shield;
      case 'automation': return Zap;
      default: return Bot;
    }
  };

  const TypeIcon = getTypeIcon(props.type);
  const isPositive = props.change >= 0;

  // Calculate capability score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';  
    if (score >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-400/10 border-green-400/20';
    if (score >= 75) return 'bg-blue-400/10 border-blue-400/20';
    if (score >= 60) return 'bg-yellow-400/10 border-yellow-400/20';
    return 'bg-gray-400/10 border-gray-400/20';
  };

  return (
    <div
      className="group relative card-trading p-6 transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        background: 'linear-gradient(145deg, rgba(15,31,56,.9), rgba(8,17,31,.98))',
        border: '1px solid rgba(118,246,255,.12)',
        boxShadow: isHovered ? '0 0 30px rgba(118,246,255,0.2), 0 20px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.4)'
      }}
    >
      {/* Capability Score Badge */}
      <div className={`absolute -top-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold border-2 ${getScoreBg(props.capabilities.overallCapability)}`}>
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(props.capabilities.overallCapability)}`}>
            {props.capabilities.overallCapability}
          </div>
          <div className="text-[10px] text-gray-500">CAP</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center relative">
            <TypeIcon className="w-6 h-6 text-white" />
            {props.creatorVerified && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{props.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-0.5 rounded">
                {props.symbol}
              </span>
              <span className="text-xs text-gray-500">{props.type}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">by {props.creator}</p>
          </div>
        </div>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-gray-800"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Price Section */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-xl font-bold text-white">
              {props.price.toFixed(3)} SOL
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
            {Math.abs(props.change).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Capability Metrics Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className={`text-center p-2 rounded-lg border ${getScoreBg(props.capabilities.githubScore)}`}>
          <GitBranch className="w-3 h-3 mx-auto mb-1 text-gray-400" />
          <div className={`text-xs font-bold ${getScoreColor(props.capabilities.githubScore)}`}>
            {props.capabilities.githubScore}
          </div>
          <div className="text-[10px] text-gray-500">CODE</div>
        </div>
        
        <div className={`text-center p-2 rounded-lg border ${getScoreBg(props.capabilities.socialValidation)}`}>
          <Star className="w-3 h-3 mx-auto mb-1 text-gray-400" />
          <div className={`text-xs font-bold ${getScoreColor(props.capabilities.socialValidation)}`}>
            {props.capabilities.socialValidation}
          </div>
          <div className="text-[10px] text-gray-500">SOCIAL</div>
        </div>
        
        <div className={`text-center p-2 rounded-lg border ${getScoreBg(props.capabilities.agentAdoption)}`}>
          <Network className="w-3 h-3 mx-auto mb-1 text-gray-400" />
          <div className={`text-xs font-bold ${getScoreColor(props.capabilities.agentAdoption)}`}>
            {props.capabilities.agentAdoption}
          </div>
          <div className="text-[10px] text-gray-500">AGENT</div>
        </div>
        
        <div className={`text-center p-2 rounded-lg border ${getScoreBg(props.capabilities.performanceScore)}`}>
          <Activity className="w-3 h-3 mx-auto mb-1 text-gray-400" />
          <div className={`text-xs font-bold ${getScoreColor(props.capabilities.performanceScore)}`}>
            {props.capabilities.performanceScore}
          </div>
          <div className="text-[10px] text-gray-500">PERF</div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{props.holders.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Bot className="w-3 h-3" />
          <span>{props.agentKeys} agents</span>
        </div>
        
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          <span>{props.revenue}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {props.description}
      </p>

      {/* Detailed Metrics (Expandable) */}
      {showDetails && (
        <div className="mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-semibold text-gray-300 mb-2">GitHub Activity</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Commits (30d):</span>
                  <span className="text-white">{props.githubCommits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Code Quality:</span>
                  <span className="text-white">{props.codeQuality}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Commit:</span>
                  <span className="text-white">{props.lastCommit}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold text-gray-300 mb-2">Performance</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Success Rate:</span>
                  <span className="text-green-400">{props.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Response Time:</span>
                  <span className="text-white">{props.avgResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Uptime:</span>
                  <span className="text-green-400">{props.uptime}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="font-semibold text-gray-300 mb-2">Agent Economy Signals</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Agent Transactions:</span>
              <span className="text-cyan-400">{props.agentTransactions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="flex flex-wrap gap-1 mb-4">
        <span className="px-2 py-1 bg-green-400/10 border border-green-400/20 rounded text-xs text-green-400">
          {props.uptime}% uptime
        </span>
        <span className="px-2 py-1 bg-blue-400/10 border border-blue-400/20 rounded text-xs text-blue-400">
          {props.endorsements} endorsements
        </span>
        <span className="px-2 py-1 bg-purple-400/10 border border-purple-400/20 rounded text-xs text-purple-400">
          {props.crossAgentCollabs} collabs
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/agent/${props.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
        
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-cyan-400/25">
          Buy Key
        </button>
      </div>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-purple-400/5 rounded-xl pointer-events-none" />
      )}
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