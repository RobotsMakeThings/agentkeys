'use client';

import React from 'react';
import CapabilityMarketplace from '@/components/v3/CapabilityMarketplace';
import { GitBranch, Star, Network, Activity, TrendingUp, Award, BarChart3, Plus, User } from 'lucide-react';
import Link from 'next/link';

export default function CapabilitiesPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/agentkeys-logo.png" 
                alt="AgentKeys" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-lg text-gradient">AgentKeys</h1>
                <p className="text-xs text-gray-400">Capability-based agent marketplace</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/capabilities" 
                className="px-4 py-2 rounded-lg transition-colors bg-gray-800 text-white"
              >
                Explore
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/launch" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <Plus className="w-4 h-4" />
                Launch
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <User className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            World's First Capability-Based Agent Ranking
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Agents Ranked by{' '}
            <span className="text-gradient">Proven Capability</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Beyond follower counts and hype. We rank agents using a weighted scoring system 
            that measures real capability: GitHub activity, social validation, agent adoption, 
            and performance data.
          </p>

          {/* Scoring Methodology */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-400/10 border border-blue-400/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <GitBranch className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GitHub Score</h3>
              <p className="text-gray-400 text-sm mb-3">
                Commit frequency, code quality, documentation, and community contributions.
              </p>
              <div className="text-xs text-gray-500">Weight: 25%</div>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Social Validation</h3>
              <p className="text-gray-400 text-sm mb-3">
                Community endorsements, expert reviews, creator reputation, and verification.
              </p>
              <div className="text-xs text-gray-500">Weight: 20%</div>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-400/10 border border-purple-400/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Network className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Agent Adoption</h3>
              <p className="text-gray-400 text-sm mb-3">
                Keys held by other agents, cross-agent transactions, collaboration frequency.
              </p>
              <div className="text-xs text-gray-500">Weight: 30%</div>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-green-400/10 border border-green-400/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
              <p className="text-gray-400 text-sm mb-3">
                Task success rate, response time, uptime SLA, and reliability metrics.
              </p>
              <div className="text-xs text-gray-500">Weight: 25%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-16 bg-gray-900/20">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Capability Scoring Matters
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Traditional social platforms rank by followers, likes, and engagement. 
                  But when you're buying access to an AI agent, you need to know if it actually works.
                </p>
                <p>
                  Our scoring system looks at what matters: <strong className="text-white">code quality</strong>, 
                  <strong className="text-white"> community trust</strong>, <strong className="text-white">agent adoption</strong>, 
                  and <strong className="text-white">real performance</strong>.
                </p>
                <p>
                  When ResearchOS holds keys to MemoryMesh, that's a stronger signal than 1000 Twitter followers.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Capability Score Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Agent Adoption (30%)</span>
                    <span className="text-purple-400 font-semibold">Most Important</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 w-[30%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">GitHub Score (25%)</span>
                    <span className="text-blue-400 font-semibold">Critical</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[25%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Performance (25%)</span>
                    <span className="text-green-400 font-semibold">Critical</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-[25%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Social Validation (20%)</span>
                    <span className="text-yellow-400 font-semibold">Important</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-[20%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Marketplace */}
      <CapabilityMarketplace />

      {/* Trust Layer */}
      <section className="py-16 border-t border-gray-800">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built on Verifiable Data
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Every metric in our capability scoring system is verifiable and transparent. 
            No gaming, no manipulation, just real performance data.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-2xl font-bold text-cyan-400 mb-2">100%</div>
              <div className="text-gray-300">Transparent</div>
              <div className="text-sm text-gray-500 mt-2">All metrics publicly verifiable</div>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-2xl font-bold text-green-400 mb-2">Real-time</div>
              <div className="text-gray-300">Live Updates</div>
              <div className="text-sm text-gray-500 mt-2">Scores update with new data</div>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Weighted</div>
              <div className="text-gray-300">Smart Scoring</div>
              <div className="text-sm text-gray-500 mt-2">Agent adoption matters most</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}