'use client';

import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Globe, 
  Twitter, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Activity,
  Star,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  ExternalLink,
  DollarSign,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Target,
  Award,
  Eye,
  ThumbsUp,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import OshiAgentDetail from '@/components/oshi/OshiAgentDetail';

interface AgentDetailProps {
  agentId: string;
}

interface Agent {
  id: string;
  name: string;
  symbol: string;
  description: string;
  longDescription: string;
  category: string;
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  totalSupply: number;
  circulatingSupply: number;
  ath: number;
  atl: number;
  athDate: Date;
  atlDate: Date;
  launchDate: Date;
  creator: {
    address: string;
    name: string;
    avatar: string;
    verified: boolean;
    totalEarnings: number;
    agentsCreated: number;
  };
  capabilities: string[];
  github: {
    url: string;
    stars: number;
    forks: number;
    commits: number;
    lastCommit: Date;
  };
  social: {
    website?: string;
    twitter?: string;
    discord?: string;
  };
  partnerships: { name: string; type: string; since: Date }[];
  integrations: number;
  reviews: { 
    rating: number; 
    count: number; 
    breakdown: { [key: number]: number };
    recent: Array<{
      id: string;
      user: string;
      rating: number;
      comment: string;
      date: Date;
    }>;
  };
  performance: Array<{ 
    timestamp: Date; 
    price: number; 
    volume: number; 
    holders: number;
  }>;
  activity: Array<{
    id: string;
    type: 'trade' | 'deployment' | 'update' | 'partnership' | 'review';
    title: string;
    description: string;
    timestamp: Date;
    user?: string;
    amount?: number;
  }>;
  holderDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  tradingData: {
    buyPressure: number;
    sellPressure: number;
    averageHoldTime: number;
    topHolders: Array<{
      address: string;
      percentage: number;
      keys: number;
    }>;
  };
  metrics: {
    utilization: number;
    performance: number;
    community: number;
    development: number;
  };
}

const MOCK_AGENT: Agent = {
  id: 'research-os',
  name: 'ResearchOS',
  symbol: 'RSCH',
  description: 'Autonomous research agent for comprehensive market analysis and report generation',
  longDescription: 'ResearchOS is an advanced AI agent designed to conduct thorough market research, analyze complex datasets, and generate actionable insights. Built with cutting-edge natural language processing and data mining capabilities, it serves as a powerful tool for investors, analysts, and decision-makers who need reliable, data-driven research.',
  category: 'Research',
  price: 2.41,
  change24h: 3.2,
  change7d: 8.1,
  change30d: 42.7,
  volume24h: 28340,
  marketCap: 2992920,
  holders: 1242,
  totalSupply: 1000000,
  circulatingSupply: 1242000,
  ath: 3.87,
  atl: 0.32,
  athDate: new Date('2024-02-15'),
  atlDate: new Date('2024-01-12'),
  launchDate: new Date('2024-01-10'),
  creator: {
    address: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    name: 'Dr. Alex Chen',
    avatar: '/avatars/alex-chen.png',
    verified: true,
    totalEarnings: 15420.30,
    agentsCreated: 3
  },
  capabilities: [
    'Market Research', 
    'Data Analysis', 
    'Report Generation', 
    'Trend Prediction',
    'Competitive Intelligence',
    'Financial Modeling'
  ],
  github: {
    url: 'https://github.com/alexchen/research-os',
    stars: 2341,
    forks: 423,
    commits: 1567,
    lastCommit: new Date('2024-03-05')
  },
  social: {
    website: 'https://research-os.ai',
    twitter: 'https://twitter.com/research_os',
    discord: 'https://discord.gg/research-os'
  },
  partnerships: [
    { name: 'DataOracle', type: 'Data Integration', since: new Date('2024-02-01') },
    { name: 'TradePilot', type: 'Strategy Collaboration', since: new Date('2024-01-20') }
  ],
  integrations: 8,
  reviews: {
    rating: 4.7,
    count: 324,
    breakdown: { 5: 198, 4: 89, 3: 28, 2: 6, 1: 3 },
    recent: [
      {
        id: '1',
        user: 'CryptoTrader2024',
        rating: 5,
        comment: 'Incredible research capabilities. The reports are thorough and actionable.',
        date: new Date('2024-03-04')
      },
      {
        id: '2',
        user: 'InvestorPro',
        rating: 4,
        comment: 'Great for market analysis, wish it had more real-time features.',
        date: new Date('2024-03-02')
      }
    ]
  },
  performance: Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    price: 1.8 + Math.sin(i / 4) * 0.3 + (i * 0.02) + Math.random() * 0.1,
    volume: 20000 + Math.random() * 10000,
    holders: 1000 + i * 8 + Math.random() * 20
  })),
  activity: [
    {
      id: '1',
      type: 'update',
      title: 'Code Update',
      description: 'Enhanced data processing algorithms',
      timestamp: new Date('2024-03-05T14:30:00'),
      user: 'Dr. Alex Chen'
    },
    {
      id: '2', 
      type: 'trade',
      title: 'Large Purchase',
      description: '500 keys purchased',
      timestamp: new Date('2024-03-05T12:15:00'),
      user: '0x1a2b...c9d8',
      amount: 500
    },
    {
      id: '3',
      type: 'partnership',
      title: 'New Partnership',
      description: 'Integration with DataOracle announced',
      timestamp: new Date('2024-03-04T16:20:00')
    }
  ],
  holderDistribution: [
    { range: '1-10 keys', count: 892, percentage: 71.8 },
    { range: '11-100 keys', count: 267, percentage: 21.5 },
    { range: '101-1000 keys', count: 73, percentage: 5.9 },
    { range: '1000+ keys', count: 10, percentage: 0.8 }
  ],
  tradingData: {
    buyPressure: 67.3,
    sellPressure: 32.7,
    averageHoldTime: 18.5,
    topHolders: [
      { address: '0x1a2b...c9d8', percentage: 8.4, keys: 10434 },
      { address: '0x2b3c...d9e0', percentage: 6.2, keys: 7709 },
      { address: '0x3c4d...e0f1', percentage: 5.1, keys: 6340 }
    ]
  },
  metrics: {
    utilization: 85,
    performance: 92,
    community: 78,
    development: 88
  }
};

export default function EnhancedAgentDetail({ agentId }: AgentDetailProps) {
  // Special handling for Oshi agent
  if (agentId === 'oshi-flagship' || agentId === 'oshi') {
    return <OshiAgentDetail />;
  }

  const [agent, setAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userKeys, setUserKeys] = useState(0);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const { connected } = useWallet();

  useEffect(() => {
    // In production, fetch real data based on agentId
    setAgent(MOCK_AGENT);
  }, [agentId]);

  if (!agent) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="animate-pulse text-primary">Loading agent details...</div>
    </div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-success' : 'text-danger';
  };

  const shareAgent = () => {
    if (navigator.share) {
      navigator.share({
        title: `${agent.name} (${agent.symbol})`,
        text: agent.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary">
      {/* Header */}
      <div className="glass-effect border-b border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {agent.symbol.substring(0, 2)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">
                  {agent.name}
                </h1>
                <p className="text-secondary mt-1">{agent.symbol}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="px-2 py-1 bg-blue/20 text-blue rounded">
                    {agent.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{agent.reviews.rating}</span>
                    <span className="text-secondary">({agent.reviews.count} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-muted" />
                    <span>{formatNumber(agent.holders)} holders</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-yellow-500/20 text-yellow-500' : 'hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareAgent}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Agent Metadata */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Creator Info */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold mb-4">Creator</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {agent.creator.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{agent.creator.name}</span>
                    {agent.creator.verified && (
                      <Shield className="w-4 h-4 text-blue" />
                    )}
                  </div>
                  <div className="text-xs text-secondary">
                    {agent.creator.agentsCreated} agents created
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Total Earnings:</span>
                  <span className="font-medium">{formatCurrency(agent.creator.totalEarnings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Address:</span>
                  <span className="font-mono text-xs">
                    {agent.creator.address.substring(0, 6)}...{agent.creator.address.substring(-4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold mb-4">Capabilities</h3>
              <div className="space-y-2">
                {agent.capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-card rounded-lg"
                  >
                    <Target className="w-4 h-4 text-blue" />
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Integration */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold mb-4">Development</h3>
              <a
                href={agent.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-card rounded-lg hover:bg-elevated transition-colors mb-4"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Stars:</span>
                  <span className="font-medium">{formatNumber(agent.github.stars)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Forks:</span>
                  <span className="font-medium">{formatNumber(agent.github.forks)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Commits:</span>
                  <span className="font-medium">{formatNumber(agent.github.commits)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Last Commit:</span>
                  <span className="font-medium">
                    {agent.github.lastCommit.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold mb-4">Links</h3>
              <div className="space-y-2">
                {agent.social.website && (
                  <a
                    href={agent.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Website</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                {agent.social.twitter && (
                  <a
                    href={agent.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Twitter</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                {agent.social.discord && (
                  <a
                    href={agent.social.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Discord</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Charts & Trading */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* Price & Key Stats */}
            <div className="glass-effect rounded-xl p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {formatCurrency(agent.price)}
                  </div>
                  <div className={`text-sm ${getChangeColor(agent.change24h)}`}>
                    {agent.change24h >= 0 ? '+' : ''}{agent.change24h.toFixed(1)}% (24h)
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Market Cap</div>
                  <div className="font-semibold">
                    {formatCurrency(agent.marketCap)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Volume (24h)</div>
                  <div className="font-semibold">
                    {formatCurrency(agent.volume24h)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Holders</div>
                  <div className="font-semibold">
                    {formatNumber(agent.holders)}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">7d Change:</span>
                    <span className={getChangeColor(agent.change7d)}>
                      {agent.change7d >= 0 ? '+' : ''}{agent.change7d.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">30d Change:</span>
                    <span className={getChangeColor(agent.change30d)}>
                      {agent.change30d >= 0 ? '+' : ''}{agent.change30d.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">ATH:</span>
                    <span className="font-medium">{formatCurrency(agent.ath)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">ATL:</span>
                    <span className="font-medium">{formatCurrency(agent.atl)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Price Chart (30d)</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue text-white rounded text-sm">
                    Price
                  </button>
                  <button className="px-3 py-1 hover:bg-white/10 rounded text-sm">
                    Volume
                  </button>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={agent.performance}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      stroke="rgba(255,255,255,0.5)"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [`$${value?.toFixed(2) || '0.00'}`, 'Price']}
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="var(--blue)"
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trading Interface */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold mb-4">Trading</h3>
              
              {!connected ? (
                <div className="text-center py-8">
                  <p className="text-secondary mb-4">Connect your wallet to trade</p>
                  <WalletMultiButton />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* Buy Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-success">Buy Keys</h4>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="w-full p-3 bg-card border border-subtle rounded-lg focus:border-success outline-none"
                    />
                    <div className="text-sm text-secondary">
                      Cost: {buyAmount ? formatCurrency(parseFloat(buyAmount) * agent.price) : '$0.00'}
                    </div>
                    <button className="w-full py-3 bg-success hover:bg-success/80 text-black font-semibold rounded-lg transition-colors">
                      Buy Keys
                    </button>
                  </div>

                  {/* Sell Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-danger">Sell Keys</h4>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      className="w-full p-3 bg-card border border-subtle rounded-lg focus:border-danger outline-none"
                    />
                    <div className="text-sm text-secondary">
                      You own: {userKeys} keys
                    </div>
                    <button className="w-full py-3 bg-danger hover:bg-danger/80 text-white font-semibold rounded-lg transition-colors">
                      Sell Keys
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Key Statistics */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary">Total Supply:</span>
                    <span className="font-medium">{formatNumber(agent.totalSupply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Circulating:</span>
                    <span className="font-medium">{formatNumber(agent.circulatingSupply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Buy Pressure:</span>
                    <span className="font-medium text-success">{agent.tradingData.buyPressure}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary">Launch Date:</span>
                    <span className="font-medium">{agent.launchDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Avg Hold Time:</span>
                    <span className="font-medium">{agent.tradingData.averageHoldTime} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Sell Pressure:</span>
                    <span className="font-medium text-danger">{agent.tradingData.sellPressure}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Analytics */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="glass-effect rounded-xl p-1">
              <div className="flex space-x-1">
                {['overview', 'analytics', 'community'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-blue text-white' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'overview' && (
              <>
                {/* Performance Metrics */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    {Object.entries(agent.metrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-secondary capitalize">{key}:</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <div className="w-full bg-card rounded-full h-2">
                          <div 
                            className="bg-gradient-primary rounded-full h-2"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {agent.activity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-card rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'trade' ? 'bg-success' :
                          activity.type === 'update' ? 'bg-blue' :
                          activity.type === 'partnership' ? 'bg-violet' :
                          'bg-warning'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{activity.title}</div>
                          <div className="text-xs text-secondary">
                            {activity.description}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            {activity.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partnerships */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Partnerships</h3>
                  <div className="space-y-3">
                    {agent.partnerships.map((partnership, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-xs font-bold">
                            {partnership.name.substring(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{partnership.name}</div>
                          <div className="text-xs text-secondary">{partnership.type}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'analytics' && (
              <>
                {/* Holder Distribution */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Holder Distribution</h3>
                  <div className="space-y-3">
                    {agent.holderDistribution.map((segment, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-secondary">{segment.range}</span>
                          <span className="text-sm font-medium">
                            {segment.count} ({segment.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-card rounded-full h-2">
                          <div 
                            className="bg-gradient-primary rounded-full h-2"
                            style={{ width: `${segment.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Holders */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Top Holders</h3>
                  <div className="space-y-3">
                    {agent.tradingData.topHolders.map((holder, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gradient">
                            #{index + 1}
                          </span>
                          <span className="font-mono text-xs">
                            {holder.address.substring(0, 8)}...
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatNumber(holder.keys)} keys
                          </div>
                          <div className="text-xs text-secondary">
                            {holder.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volume Chart */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Volume Trend</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={agent.performance.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="timestamp"
                          tickFormatter={(value) => new Date(value).toLocaleDateString().split('/')[1]}
                          stroke="rgba(255,255,255,0.5)"
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.5)"
                          tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: any) => [`$${formatNumber(value || 0)}`, 'Volume']}
                          contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="volume" 
                          fill="var(--blue)"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'community' && (
              <>
                {/* Reviews Summary */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Community Reviews</h3>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl font-bold text-gradient">
                      {agent.reviews.rating}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(agent.reviews.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-secondary">
                        {agent.reviews.count} total reviews
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <span className="text-xs w-6">{rating}★</span>
                        <div className="flex-1 bg-card rounded-full h-2">
                          <div 
                            className="bg-yellow-400 rounded-full h-2"
                            style={{ 
                              width: `${((agent.reviews.breakdown[rating] || 0) / agent.reviews.count) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-xs text-secondary w-8">
                          {agent.reviews.breakdown[rating] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {agent.reviews.recent.map((review) => (
                      <div key={review.id} className="border-b border-subtle pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {review.user.substring(0, 1)}
                              </span>
                            </div>
                            <span className="font-medium text-sm">{review.user}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-secondary mb-2">{review.comment}</p>
                        <div className="text-xs text-muted">
                          {review.date.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Stats */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Community Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary">Total Integrations:</span>
                      <span className="font-medium">{agent.integrations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">GitHub Stars:</span>
                      <span className="font-medium">{formatNumber(agent.github.stars)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Community Score:</span>
                      <span className="font-medium">{agent.metrics.community}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Active Partnerships:</span>
                      <span className="font-medium">{agent.partnerships.length}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}