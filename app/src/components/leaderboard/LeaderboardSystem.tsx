'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  DollarSign, 
  Activity,
  Filter,
  Search,
  ChevronDown,
  Star,
  Zap,
  Target,
  Briefcase,
  Palette,
  Shield,
  Download,
  Calendar
} from 'lucide-react';
// Chart removed to fix build issues
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Agent {
  id: string;
  name: string;
  symbol: string;
  category: 'Trading' | 'Research' | 'Creative' | 'Infrastructure';
  price: number;
  volume24h: number;
  holders: number;
  marketCap: number;
  change24h: number;
  change7d: number;
  change30d: number;
  createdAt: Date;
  creator: string;
  creatorEarnings: number;
  capabilities: string[];
  momentum: number;
  performance: { timestamp: Date; value: number }[];
  partnerships: string[];
  integrations: number;
  avgRating: number;
  totalReviews: number;
}

const MOCK_AGENTS: Agent[] = [
  {
    id: 'oshi-flagship',
    name: 'Oshi',
    symbol: 'OSHI',
    category: 'Trading',
    price: 4.23,
    volume24h: 18420,
    holders: 142,
    marketCap: 4090.41,
    change24h: 7.2,
    change7d: 18.3,
    change30d: 89.7,
    createdAt: new Date(),
    creator: 'oshi-team',
    creatorEarnings: 2847.33,
    capabilities: ['Kalshi Trading', '15m BTC Predictions', 'Risk Management'],
    momentum: 9.8,
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 2.5 + Math.sin(i / 3) * 0.8 + (i * 0.06)
    })),
    partnerships: ['Kalshi', 'Discord'],
    integrations: 12,
    avgRating: 4.9,
    totalReviews: 89
  },
  {
    id: 'data-oracle',
    name: 'DataOracle',
    symbol: 'DATA',
    category: 'Research',
    price: 6.21,
    volume24h: 45230,
    holders: 324,
    marketCap: 2012400,
    change24h: 12.3,
    change7d: 28.7,
    change30d: 156.2,
    createdAt: new Date('2024-01-15'),
    creator: '0x1a2b3c4d',
    creatorEarnings: 15420.30,
    capabilities: ['Data Analysis', 'Market Research', 'Trend Prediction'],
    momentum: 9.2,
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 4.5 + Math.sin(i / 5) * 1.5 + (i * 0.05)
    })),
    partnerships: ['TradePilot', 'ResearchOS'],
    integrations: 8,
    avgRating: 4.8,
    totalReviews: 156
  },
  {
    id: 'trade-pilot',
    name: 'TradePilot',
    symbol: 'TRADE',
    category: 'Trading',
    price: 4.83,
    volume24h: 32180,
    holders: 842,
    marketCap: 4067160,
    change24h: 8.7,
    change7d: 15.2,
    change30d: 89.4,
    createdAt: new Date('2024-02-01'),
    creator: '0x2b3c4d5e',
    creatorEarnings: 12340.80,
    capabilities: ['Automated Trading', 'Risk Management', 'Portfolio Analysis'],
    momentum: 8.1,
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 3.2 + Math.cos(i / 3) * 0.8 + (i * 0.04)
    })),
    partnerships: ['DataOracle', 'AuditMesh'],
    integrations: 12,
    avgRating: 4.6,
    totalReviews: 289
  },
  {
    id: 'creative-ai',
    name: 'CreativeAI',
    symbol: 'CREATE',
    category: 'Creative',
    price: 3.45,
    volume24h: 18650,
    holders: 1205,
    marketCap: 4157250,
    change24h: 5.4,
    change7d: 12.8,
    change30d: 67.3,
    createdAt: new Date('2024-01-20'),
    creator: '0x3c4d5e6f',
    creatorEarnings: 8960.45,
    capabilities: ['Content Generation', 'Design Creation', 'Brand Strategy'],
    momentum: 7.3,
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 2.1 + Math.random() * 0.8 + (i * 0.035)
    })),
    partnerships: ['ResearchOS'],
    integrations: 6,
    avgRating: 4.4,
    totalReviews: 178
  },
  {
    id: 'research-os',
    name: 'ResearchOS',
    symbol: 'RSCH',
    category: 'Research',
    price: 2.41,
    volume24h: 28340,
    holders: 1242,
    marketCap: 2992920,
    change24h: 3.2,
    change7d: 8.1,
    change30d: 42.7,
    createdAt: new Date('2024-01-10'),
    creator: '0x4d5e6f7g',
    creatorEarnings: 7230.60,
    capabilities: ['Research Automation', 'Data Mining', 'Report Generation'],
    momentum: 6.8,
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 1.8 + Math.sin(i / 4) * 0.3 + (i * 0.02)
    })),
    partnerships: ['DataOracle', 'CreativeAI'],
    integrations: 4,
    avgRating: 4.2,
    totalReviews: 324
  },
  {
    id: 'audit-mesh',
    name: 'AuditMesh',
    symbol: 'AUDIT',
    category: 'Infrastructure',
    price: 3.67,
    volume24h: 15420,
    holders: 567,
    marketCap: 2082890,
    change24h: 1.4,
    change7d: 4.8,
    change30d: 28.9,
    createdAt: new Date('2024-02-10'),
    creator: '0x5e6f7g8h',
    creatorEarnings: 5830.20,
    capabilities: ['Security Auditing', 'Code Analysis', 'Vulnerability Detection'],
    momentum: 5.9,
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 2.8 + Math.random() * 0.4 + (i * 0.025)
    })),
    partnerships: ['TradePilot'],
    integrations: 3,
    avgRating: 4.7,
    totalReviews: 89
  }
];

type SortMetric = 'price' | 'volume24h' | 'holders' | 'marketCap' | 'change24h' | 'change7d' | 'change30d' | 'momentum' | 'creatorEarnings';
type TimeFilter = '24h' | '7d' | '30d' | 'all';
type Category = 'all' | 'Trading' | 'Research' | 'Creative' | 'Infrastructure';

const CATEGORY_ICONS = {
  Trading: <Target className="w-4 h-4" />,
  Research: <Search className="w-4 h-4" />,
  Creative: <Palette className="w-4 h-4" />,
  Infrastructure: <Shield className="w-4 h-4" />
};

export default function LeaderboardSystem() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [sortBy, setSortBy] = useState<SortMetric>('change24h');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agents;

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(agent => agent.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy] as number;
      const bValue = b[sortBy] as number;
      return bValue - aValue;
    });

    return filtered;
  }, [agents, sortBy, categoryFilter, searchQuery]);

  const getTimeFilterChange = (agent: Agent) => {
    switch (timeFilter) {
      case '24h': return agent.change24h;
      case '7d': return agent.change7d;
      case '30d': return agent.change30d;
      case 'all': return ((agent.price - agent.performance[0].value) / agent.performance[0].value) * 100;
      default: return agent.change24h;
    }
  };

  const exportLeaderboard = () => {
    const csvContent = [
      ['Rank', 'Name', 'Symbol', 'Price', 'Change %', 'Volume', 'Holders', 'Market Cap'],
      ...filteredAndSortedAgents.map((agent, index) => [
        index + 1,
        agent.name,
        agent.symbol,
        agent.price,
        getTimeFilterChange(agent),
        agent.volume24h,
        agent.holders,
        agent.marketCap
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentkeys-leaderboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-canvas text-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Agent Leaderboard</h1>
          <p className="text-secondary">Discover top-performing agents across all categories</p>
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-card border border-subtle rounded-lg focus:border-blue outline-none"
                />
              </div>

              {/* Time Filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="px-4 py-2 bg-card border border-subtle rounded-lg focus:border-blue outline-none"
              >
                <option value="24h">24h</option>
                <option value="7d">7d</option>
                <option value="30d">30d</option>
                <option value="all">All Time</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Category)}
                className="px-4 py-2 bg-card border border-subtle rounded-lg focus:border-blue outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Trading">Trading</option>
                <option value="Research">Research</option>
                <option value="Creative">Creative</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMetric)}
                className="px-4 py-2 bg-card border border-subtle rounded-lg focus:border-blue outline-none"
              >
                <option value="change24h">24h Change</option>
                <option value="volume24h">Volume</option>
                <option value="holders">Holders</option>
                <option value="marketCap">Market Cap</option>
                <option value="price">Price</option>
                <option value="momentum">Momentum</option>
                <option value="creatorEarnings">Creator Earnings</option>
              </select>
            </div>

            <button
              onClick={exportLeaderboard}
              className="flex items-center space-x-2 px-4 py-2 bg-blue hover:bg-blue/80 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-effect rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-elevated border-b border-subtle">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Agent</th>
                  <th className="px-6 py-4 text-right font-semibold">Price</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    {timeFilter.toUpperCase()} Change
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">Volume</th>
                  <th className="px-6 py-4 text-right font-semibold">Holders</th>
                  <th className="px-6 py-4 text-right font-semibold">Market Cap</th>
                  <th className="px-6 py-4 text-center font-semibold">Momentum</th>
                  <th className="px-6 py-4 text-center font-semibold">Chart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {filteredAndSortedAgents.map((agent, index) => {
                  const change = getTimeFilterChange(agent);
                  const isPositive = change > 0;
                  
                  return (
                    <tr 
                      key={agent.id}
                      className="hover:bg-elevated/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gradient">
                            #{index + 1}
                          </span>
                          {index < 3 && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                            {CATEGORY_ICONS[agent.category]}
                          </div>
                          <div>
                            <div className="font-semibold">{agent.name}</div>
                            <div className="text-sm text-secondary flex items-center space-x-2">
                              <span>{agent.symbol}</span>
                              <span className="px-2 py-0.5 bg-card rounded text-xs">
                                {agent.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold">${agent.price.toFixed(2)}</div>
                        <div className="text-xs text-secondary">
                          {agent.totalReviews} reviews
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${
                          isPositive ? 'text-success' : 'text-danger'
                        }`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold">
                          ${agent.volume24h.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold">
                          {agent.holders.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold">
                          ${(agent.marketCap / 1000000).toFixed(2)}M
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Zap className="w-4 h-4 text-warning" />
                          <span className="font-semibold text-warning">
                            {agent.momentum.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="w-20 h-8 flex items-center justify-center">
                          <div className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '📈' : '📉'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent Detail Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-effect rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gradient mb-2">
                      {selectedAgent.name} ({selectedAgent.symbol})
                    </h2>
                    <div className="flex items-center space-x-4 text-secondary">
                      <span className="flex items-center space-x-1">
                        {CATEGORY_ICONS[selectedAgent.category]}
                        <span>{selectedAgent.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {selectedAgent.createdAt.toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Overview */}
                  <div className="col-span-full">
                    <h3 className="text-lg font-semibold mb-4">30-Day Performance</h3>
                    <div className="h-64 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-lg font-bold text-blue-400">$4.23</div>
                        <div className="text-sm text-gray-400">Current Price</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-secondary">Current Price:</span>
                        <span className="font-semibold">${selectedAgent.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">24h Volume:</span>
                        <span className="font-semibold">${selectedAgent.volume24h.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Market Cap:</span>
                        <span className="font-semibold">${(selectedAgent.marketCap / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Total Holders:</span>
                        <span className="font-semibold">{selectedAgent.holders.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Creator Earnings:</span>
                        <span className="font-semibold">${selectedAgent.creatorEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Capabilities & Partnerships */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Capabilities</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedAgent.capabilities.map((cap, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue/20 text-blue rounded-full text-sm"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Partnerships</h3>
                    <div className="space-y-2">
                      {selectedAgent.partnerships.map((partner, index) => (
                        <div key={index} className="text-secondary">
                          {partner}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}