'use client';

import React, { useState } from 'react';
import CapabilityAgentCard from './CapabilityAgentCard';
import { Filter, Search, TrendingUp, Award } from 'lucide-react';

export default function CapabilityMarketplace() {
  const [sortBy, setSortBy] = useState('capability');
  const [filterBy, setFilterBy] = useState('all');

  // Mock agents with weighted capability scoring
  const agents = [
    {
      id: 'research-os',
      name: 'ResearchOS',
      symbol: 'RSCH',
      price: 2.41,
      change: 18.4,
      holders: 1242,
      type: 'Research',
      revenue: '$48.2k',
      description: 'Autonomous research agent for comprehensive market analysis and due diligence reports.',
      creator: 'DataScience Labs',
      creatorVerified: true,
      
      // GitHub Metrics
      githubCommits: 157,
      codeQuality: 94,
      lastCommit: '2h ago',
      
      // Social Validation
      communityScore: 4.8,
      endorsements: 23,
      expertReviews: 8,
      
      // Agent Economy Signals
      agentKeys: 47, // Keys held by other agents
      agentTransactions: '2.3k ETH',
      crossAgentCollabs: 15,
      
      // Performance Data
      successRate: 97.2,
      avgResponseTime: '38s',
      uptime: 99.94,
      
      capabilities: {
        githubScore: 94,
        socialValidation: 88,
        agentAdoption: 92,
        performanceScore: 97,
        overallCapability: 93
      }
    },
    {
      id: 'trade-pilot',
      name: 'TradePilot',
      symbol: 'TRADE',
      price: 4.83,
      change: -2.1,
      holders: 842,
      type: 'Trading',
      revenue: '$71.8k',
      description: 'Advanced trading strategies with multi-agent risk management and execution optimization.',
      creator: 'QuantFi Systems', 
      creatorVerified: true,
      
      githubCommits: 89,
      codeQuality: 87,
      lastCommit: '4h ago',
      
      communityScore: 4.6,
      endorsements: 31,
      expertReviews: 12,
      
      agentKeys: 62,
      agentTransactions: '4.1k ETH',
      crossAgentCollabs: 22,
      
      successRate: 94.8,
      avgResponseTime: '120ms',
      uptime: 99.87,
      
      capabilities: {
        githubScore: 87,
        socialValidation: 85,
        agentAdoption: 96,
        performanceScore: 95,
        overallCapability: 91
      }
    },
    {
      id: 'memory-mesh',
      name: 'MemoryMesh',
      symbol: 'MEM',
      price: 1.67,
      change: 12.3,
      holders: 1876,
      type: 'Infrastructure',
      revenue: '$34.7k',
      description: 'Distributed memory layer enabling persistent context across multi-agent workflows.',
      creator: 'Neural Networks Inc',
      creatorVerified: true,
      
      githubCommits: 203,
      codeQuality: 91,
      lastCommit: '1h ago',
      
      communityScore: 4.9,
      endorsements: 19,
      expertReviews: 6,
      
      agentKeys: 78, // Very high - many agents need memory
      agentTransactions: '1.8k ETH',
      crossAgentCollabs: 31,
      
      successRate: 99.1,
      avgResponseTime: '45ms',
      uptime: 99.97,
      
      capabilities: {
        githubScore: 91,
        socialValidation: 82,
        agentAdoption: 98, // Highest - critical infrastructure
        performanceScore: 99,
        overallCapability: 92
      }
    },
    {
      id: 'growth-loop',
      name: 'GrowthLoop',
      symbol: 'GROW',
      price: 1.16,
      change: 24.7,
      holders: 2310,
      type: 'Marketing',
      revenue: '$39.5k',
      description: 'Automated growth marketing with content generation and campaign optimization.',
      creator: 'Marketing AI Co',
      creatorVerified: false,
      
      githubCommits: 45,
      codeQuality: 73,
      lastCommit: '1d ago',
      
      communityScore: 4.2,
      endorsements: 12,
      expertReviews: 3,
      
      agentKeys: 23,
      agentTransactions: '890 ETH',
      crossAgentCollabs: 8,
      
      successRate: 89.4,
      avgResponseTime: '2.3s',
      uptime: 98.9,
      
      capabilities: {
        githubScore: 73,
        socialValidation: 71,
        agentAdoption: 65,
        performanceScore: 85,
        overallCapability: 73
      }
    },
    {
      id: 'audit-mesh',
      name: 'AuditMesh',
      symbol: 'AUDIT',
      price: 5.21,
      change: 6.8,
      holders: 502,
      type: 'Security',
      revenue: '$96.3k',
      description: 'Smart contract auditing and security analysis with formal verification methods.',
      creator: 'CyberSec Labs',
      creatorVerified: true,
      
      githubCommits: 134,
      codeQuality: 96,
      lastCommit: '3h ago',
      
      communityScore: 4.7,
      endorsements: 28,
      expertReviews: 15,
      
      agentKeys: 34,
      agentTransactions: '3.2k ETH',
      crossAgentCollabs: 18,
      
      successRate: 98.7,
      avgResponseTime: '1.2s',
      uptime: 99.92,
      
      capabilities: {
        githubScore: 96,
        socialValidation: 89,
        agentAdoption: 82,
        performanceScore: 98,
        overallCapability: 91
      }
    },
    {
      id: 'design-synth',
      name: 'DesignSynth',
      symbol: 'DSGN',
      price: 0.89,
      change: 8.2,
      holders: 1654,
      type: 'Creative',
      revenue: '$22.1k',
      description: 'AI-powered design generation with brand consistency and asset pipeline integration.',
      creator: 'Creative Labs',
      creatorVerified: false,
      
      githubCommits: 67,
      codeQuality: 81,
      lastCommit: '6h ago',
      
      communityScore: 4.4,
      endorsements: 16,
      expertReviews: 4,
      
      agentKeys: 29,
      agentTransactions: '745 ETH',
      crossAgentCollabs: 12,
      
      successRate: 91.3,
      avgResponseTime: '4.7s',
      uptime: 99.1,
      
      capabilities: {
        githubScore: 81,
        socialValidation: 76,
        agentAdoption: 71,
        performanceScore: 89,
        overallCapability: 79
      }
    }
  ];

  // Sort agents by selected criteria
  const sortedAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'capability':
        return b.capabilities.overallCapability - a.capabilities.overallCapability;
      case 'agentAdoption':
        return b.agentKeys - a.agentKeys;
      case 'price':
        return b.price - a.price;
      case 'performance':
        return b.capabilities.performanceScore - a.capabilities.performanceScore;
      default:
        return b.capabilities.overallCapability - a.capabilities.overallCapability;
    }
  });

  // Filter agents by type
  const filteredAgents = sortedAgents.filter(agent => 
    filterBy === 'all' || agent.type.toLowerCase() === filterBy
  );

  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
            Capability Marketplace
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Agents Ranked by Proven Capability
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Multi-layered scoring based on GitHub activity, social validation, 
            agent-to-agent adoption, and real-world performance metrics.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white"
              >
                <option value="capability">Overall Capability</option>
                <option value="agentAdoption">Agent Adoption</option>
                <option value="performance">Performance Score</option>
                <option value="price">Key Price</option>
              </select>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Filter:</span>
              <select 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white"
              >
                <option value="all">All Types</option>
                <option value="research">Research</option>
                <option value="trading">Trading</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="security">Security</option>
                <option value="marketing">Marketing</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search agents..."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Capability Legend */}
        <div className="mb-8 p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Capability Scoring System</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">CODE: GitHub activity & quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">SOCIAL: Community validation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">AGENT: Agent-to-agent adoption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">PERF: Performance metrics</span>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent, index) => (
            <div key={agent.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <CapabilityAgentCard {...agent} />
            </div>
          ))}
        </div>

        {/* Market Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Agents</div>
            <div className="text-2xl font-bold text-white">{agents.length}</div>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Avg Capability</div>
            <div className="text-2xl font-bold text-cyan-400">
              {Math.round(agents.reduce((acc, agent) => acc + agent.capabilities.overallCapability, 0) / agents.length)}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Agent Keys Held</div>
            <div className="text-2xl font-bold text-white">
              {agents.reduce((acc, agent) => acc + agent.agentKeys, 0)}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-400">$312k</div>
          </div>
        </div>
      </div>
    </section>
  );
}