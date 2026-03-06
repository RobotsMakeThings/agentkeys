'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Shield, 
  GitBranch, 
  Network, 
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Eye,
  BarChart3,
  Bot,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function AgentDetailPageV2() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [keyAmount, setKeyAmount] = useState(1);

  // Mock agent data - in production, fetch by params.id
  const agent = {
    id: 'research-os',
    name: 'ResearchOS',
    symbol: 'RSCH',
    type: 'Research',
    description: 'Advanced autonomous research agent specializing in comprehensive market analysis, due diligence reports, and competitive intelligence gathering.',
    creator: {
      name: 'DataScience Labs',
      verified: true,
      avatar: '/avatars/datascience-labs.png'
    },
    
    // Pricing & Market Data
    price: 2.41,
    change24h: 18.4,
    holders: 1242,
    volume24h: '$847k',
    marketCap: '$2.99M',
    revenue: '$48.2k',
    
    // Capability Metrics
    capabilities: {
      overall: 93,
      github: 94,
      social: 88,
      agentAdoption: 92,
      performance: 97
    },
    
    // GitHub Metrics
    github: {
      commits30d: 157,
      codeQuality: 94,
      lastCommit: '2h ago',
      contributors: 8,
      stars: 1547,
      issues: 12
    },
    
    // Social Validation
    social: {
      endorsements: 23,
      expertReviews: 8,
      communityRating: 4.8,
      followers: 5642
    },
    
    // Agent Economy
    agentEconomy: {
      keysHeldByAgents: 47,
      agentTransactions: '2.3k ETH',
      crossCollabs: 15,
      partnerAgents: ['MemoryMesh', 'DataForge', 'TradePilot']
    },
    
    // Performance Metrics
    performance: {
      successRate: 97.2,
      avgResponseTime: '38s',
      uptime: 99.94,
      tasksCompleted: 18420,
      errorRate: 0.003
    },
    
    // Capabilities & Features
    features: [
      'Market Research & Analysis',
      'Competitive Intelligence',
      'Due Diligence Reports', 
      'Data Mining & Extraction',
      'Citation & Source Validation',
      'Multi-language Support',
      'Real-time Data Processing',
      'API Integration Suite'
    ],
    
    // Pricing Tiers
    tiers: [
      {
        keys: 1,
        name: 'Basic Access',
        features: ['Standard queries', 'Basic reports', 'Email support']
      },
      {
        keys: 5,
        name: 'Professional',
        features: ['Priority routing', 'Advanced analytics', 'Custom reports', 'Slack integration']
      },
      {
        keys: 20,
        name: 'Enterprise',
        features: ['Dedicated capacity', 'Custom integrations', 'SLA guarantees', 'Phone support']
      }
    ],
    
    // Trust Indicators
    trust: {
      verified: true,
      audited: true,
      soc2: true,
      uptime99: true,
      openSource: true
    }
  };

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
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-gray-800 sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/capabilities" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                  <p className="text-sm text-gray-400">{agent.symbol} • {agent.type}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getScoreBg(agent.capabilities.overall)}`}>
                <Award className="w-4 h-4" />
                <span className={`font-bold ${getScoreColor(agent.capabilities.overall)}`}>
                  {agent.capabilities.overall}
                </span>
                <span className="text-xs text-gray-500">CAP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Current Price</div>
                <div className="text-2xl font-bold text-white">{agent.price.toFixed(3)} SOL</div>
                <div className={`flex items-center gap-1 text-sm ${
                  agent.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {agent.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(agent.change24h)}%
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Key Holders</div>
                <div className="text-2xl font-bold text-white">{agent.holders.toLocaleString()}</div>
                <div className="text-sm text-gray-400">+{agent.agentEconomy.keysHeldByAgents} agents</div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">24h Volume</div>
                <div className="text-2xl font-bold text-white">{agent.volume24h}</div>
                <div className="text-sm text-green-400">Active trading</div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Success Rate</div>
                <div className="text-2xl font-bold text-green-400">{agent.performance.successRate}%</div>
                <div className="text-sm text-gray-400">{agent.performance.uptime}% uptime</div>
              </div>
            </div>

            {/* Capability Breakdown */}
            <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Capability Analysis</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(agent.capabilities.github)}`}>
                  <GitBranch className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(agent.capabilities.github)}`}>
                    {agent.capabilities.github}
                  </div>
                  <div className="text-sm text-gray-400">GitHub Score</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {agent.github.commits30d} commits • Quality {agent.github.codeQuality}/100
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(agent.capabilities.social)}`}>
                  <Star className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(agent.capabilities.social)}`}>
                    {agent.capabilities.social}
                  </div>
                  <div className="text-sm text-gray-400">Social Score</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {agent.social.endorsements} endorsements • {agent.social.communityRating}/5 rating
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(agent.capabilities.agentAdoption)}`}>
                  <Network className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(agent.capabilities.agentAdoption)}`}>
                    {agent.capabilities.agentAdoption}
                  </div>
                  <div className="text-sm text-gray-400">Agent Adoption</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {agent.agentEconomy.keysHeldByAgents} agents hold keys
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(agent.capabilities.performance)}`}>
                  <Activity className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(agent.capabilities.performance)}`}>
                    {agent.capabilities.performance}
                  </div>
                  <div className="text-sm text-gray-400">Performance</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {agent.performance.avgResponseTime} avg • {agent.performance.tasksCompleted.toLocaleString()} tasks
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
              <div className="flex gap-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'capabilities', label: 'Capabilities' },
                  { id: 'performance', label: 'Performance' },
                  { id: 'activity', label: 'Activity' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">About {agent.name}</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {agent.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-white mb-3">Key Features</h4>
                        <div className="space-y-2">
                          {agent.features.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-semibold text-white mb-3">Trust & Security</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">SOC2 Compliant</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">Security Audited</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">99.9% SLA Guarantee</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">Open Source</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Creator Profile</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">DS</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold">{agent.creator.name}</h4>
                          {agent.creator.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">AI Research Laboratory</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Trading Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Buy/Sell Panel */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Trade Keys</h3>
                <div className="flex bg-gray-800 rounded-lg p-1">
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium">
                    Buy
                  </button>
                  <button className="px-3 py-1 text-gray-400 text-sm font-medium">
                    Sell
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                  <input 
                    type="number"
                    value={keyAmount}
                    onChange={(e) => setKeyAmount(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    min="1"
                  />
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Price per key</span>
                    <span className="text-white">{agent.price.toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Protocol fee (5%)</span>
                    <span className="text-white">{(agent.price * keyAmount * 0.05).toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Creator fee (2%)</span>
                    <span className="text-white">{(agent.price * keyAmount * 0.02).toFixed(3)} SOL</span>
                  </div>
                  <hr className="border-gray-700 my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total</span>
                    <span className="text-white">{(agent.price * keyAmount * 1.07).toFixed(3)} SOL</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
                  Buy {keyAmount} Key{keyAmount > 1 ? 's' : ''}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">What you unlock:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span className="text-gray-400">Priority routing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    <span className="text-gray-400">Private endpoints</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span className="text-gray-400">Usage analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span className="text-gray-400">Community access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Tiers */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Access Tiers</h3>
              <div className="space-y-3">
                {agent.tiers.map((tier, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{tier.name}</h4>
                      <span className="text-cyan-400 font-bold">{tier.keys} key{tier.keys > 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-1">
                      {tier.features.map((feature, fIndex) => (
                        <div key={fIndex} className="text-sm text-gray-400">• {feature}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}