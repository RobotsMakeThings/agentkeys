'use client';

import React, { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  BarChart3,
  Activity,
  Zap,
  Clock,
  ArrowUpRight,
  Plus,
  Settings,
  Bell,
  Filter,
  Download,
  RefreshCw,
  Bot,
  Key,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  keys: number;
  entryPrice: number;
  currentPrice: number;
  value: number;
  change24h: number;
  capabilities: number;
  lastUsed: string;
  status: 'active' | 'paused' | 'maintenance';
}

interface UsageMetric {
  agentId: string;
  agentName: string;
  requests: number;
  successRate: number;
  avgResponseTime: string;
  cost: number;
  trend: 'up' | 'down' | 'stable';
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [timeframe, setTimeframe] = useState('7d');

  // Mock portfolio data
  const portfolioItems: PortfolioItem[] = [
    {
      id: 'research-os',
      name: 'ResearchOS',
      symbol: 'RSCH',
      keys: 15,
      entryPrice: 1.84,
      currentPrice: 2.41,
      value: 36.15,
      change24h: 18.4,
      capabilities: 93,
      lastUsed: '2h ago',
      status: 'active'
    },
    {
      id: 'trade-pilot',
      name: 'TradePilot',
      symbol: 'TRADE',
      keys: 8,
      entryPrice: 4.12,
      currentPrice: 4.83,
      value: 38.64,
      change24h: -2.1,
      capabilities: 91,
      lastUsed: '5m ago',
      status: 'active'
    },
    {
      id: 'memory-mesh',
      name: 'MemoryMesh',
      symbol: 'MEM',
      keys: 25,
      entryPrice: 1.21,
      currentPrice: 1.67,
      value: 41.75,
      change24h: 12.3,
      capabilities: 92,
      lastUsed: '1h ago',
      status: 'active'
    },
    {
      id: 'audit-mesh',
      name: 'AuditMesh',
      symbol: 'AUDIT',
      keys: 3,
      entryPrice: 4.89,
      currentPrice: 5.21,
      value: 15.63,
      change24h: 6.8,
      capabilities: 91,
      lastUsed: '1d ago',
      status: 'paused'
    }
  ];

  const usageMetrics: UsageMetric[] = [
    {
      agentId: 'research-os',
      agentName: 'ResearchOS',
      requests: 147,
      successRate: 97.2,
      avgResponseTime: '38s',
      cost: 4.23,
      trend: 'up'
    },
    {
      agentId: 'trade-pilot',
      agentName: 'TradePilot',
      requests: 89,
      successRate: 94.8,
      avgResponseTime: '120ms',
      cost: 7.56,
      trend: 'up'
    },
    {
      agentId: 'memory-mesh',
      agentName: 'MemoryMesh',
      requests: 234,
      successRate: 99.1,
      avgResponseTime: '45ms',
      cost: 2.12,
      trend: 'stable'
    }
  ];

  // Calculate portfolio totals
  const totalValue = portfolioItems.reduce((sum, item) => sum + item.value, 0);
  const totalPnL = portfolioItems.reduce((sum, item) => {
    const pnl = (item.currentPrice - item.entryPrice) * item.keys;
    return sum + pnl;
  }, 0);
  const totalPnLPercentage = (totalPnL / (totalValue - totalPnL)) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'maintenance': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <Activity className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/20">
        <div className="container max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your agent portfolio and usage analytics</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
              </select>
              
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
              
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-gray-400">Portfolio Value</span>
              </div>
              <div className="text-2xl font-bold text-white">{totalValue.toFixed(2)} SOL</div>
              <div className={`flex items-center gap-1 text-sm ${
                totalPnLPercentage >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {totalPnLPercentage >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(totalPnLPercentage).toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Key className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Total Keys</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {portfolioItems.reduce((sum, item) => sum + item.keys, 0)}
              </div>
              <div className="text-sm text-gray-400">
                {portfolioItems.length} agents
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Usage Today</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {usageMetrics.reduce((sum, metric) => sum + metric.requests, 0)}
              </div>
              <div className="text-sm text-green-400">
                97.3% success rate
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">Spend Today</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {usageMetrics.reduce((sum, metric) => sum + metric.cost, 0).toFixed(2)} SOL
              </div>
              <div className="text-sm text-gray-400">
                Within budget
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-700 mb-8">
          {[
            { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
            { id: 'usage', label: 'Usage Analytics', icon: Activity },
            { id: 'activity', label: 'Recent Activity', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Agent Portfolio</h2>
              <div className="flex items-center gap-3">
                <Link 
                  href="/capabilities" 
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Buy Keys
                </Link>
                
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {portfolioItems.map(item => {
                const pnl = (item.currentPrice - item.entryPrice) * item.keys;
                const pnlPercentage = ((item.currentPrice - item.entryPrice) / item.entryPrice) * 100;
                
                return (
                  <div key={item.id} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{item.symbol}</span>
                            <span>•</span>
                            <span>{item.keys} keys</span>
                            <span>•</span>
                            <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{item.value.toFixed(2)} SOL</div>
                        <div className={`flex items-center gap-1 text-sm ${
                          pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {pnlPercentage >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} SOL ({Math.abs(pnlPercentage).toFixed(1)}%)
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Entry Price</div>
                        <div className="text-white font-medium">{item.entryPrice.toFixed(3)} SOL</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Current Price</div>
                        <div className="text-white font-medium">{item.currentPrice.toFixed(3)} SOL</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">24h Change</div>
                        <div className={`font-medium ${
                          item.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Capability Score</div>
                        <div className="text-cyan-400 font-medium">{item.capabilities}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Last Used</div>
                        <div className="text-white font-medium">{item.lastUsed}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                      <Link 
                        href={`/agent/${item.id}`}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                          Buy More
                        </button>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                          Sell Keys
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Usage Analytics Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Usage Analytics</h2>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                  Export Data
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {usageMetrics.map(metric => (
                <div key={metric.agentId} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{metric.agentName}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <span className="text-sm text-gray-400">
                        {metric.trend === 'up' ? 'Increasing' : metric.trend === 'down' ? 'Decreasing' : 'Stable'}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{metric.requests}</div>
                      <div className="text-sm text-gray-400">Requests</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">{metric.successRate}%</div>
                      <div className="text-sm text-gray-400">Success Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">{metric.avgResponseTime}</div>
                      <div className="text-sm text-gray-400">Avg Response</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">{metric.cost.toFixed(2)} SOL</div>
                      <div className="text-sm text-gray-400">Total Cost</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {[
                { type: 'purchase', agent: 'ResearchOS', amount: 3, price: '2.41 SOL', time: '2h ago', status: 'completed' },
                { type: 'usage', agent: 'TradePilot', description: 'Market analysis request', time: '3h ago', status: 'completed' },
                { type: 'sale', agent: 'MemoryMesh', amount: 2, price: '1.67 SOL', time: '1d ago', status: 'completed' },
                { type: 'usage', agent: 'AuditMesh', description: 'Security audit', time: '2d ago', status: 'failed' }
              ].map((activity, index) => (
                <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      
                      <div>
                        <div className="text-white font-medium">
                          {activity.type === 'purchase' && `Bought ${activity.amount} keys of ${activity.agent}`}
                          {activity.type === 'sale' && `Sold ${activity.amount} keys of ${activity.agent}`}
                          {activity.type === 'usage' && `${activity.agent}: ${activity.description}`}
                        </div>
                        <div className="text-sm text-gray-400">
                          {activity.price && `at ${activity.price}`} • {activity.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {activity.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm ${
                        activity.status === 'completed' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}