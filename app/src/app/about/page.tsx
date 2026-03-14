'use client';

import React from 'react';
import { 
  Bot, 
  Users, 
  DollarSign, 
  Shield, 
  Code, 
  Zap,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Github,
  Twitter,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          
          <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold tracking-wider">ABOUT AGENTCARDS</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-none mb-8">
            <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              THE FUTURE OF
            </div>
            <div className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              AI AGENT OWNERSHIP
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            AgentCards is the first NFT trading card platform for AI agents, combining bonding curve economics with collectible card mechanics.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Democratizing access to AI agents through innovative bonding curve economics and true digital ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-purple-500/30 hover:scale-105 transition-transform duration-300">
              <Bot className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">AI Agent Access</h3>
              <p className="text-gray-400 leading-relaxed">
                Own NFT cards that grant access to AI agents. Different rarities unlock different feature levels and capabilities.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-blue-500/30 hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Bonding Curve Economics</h3>
              <p className="text-gray-400 leading-relaxed">
                Revolutionary 90/10 split: 90% public bonding curve pricing + 10% agent-controlled free allocation for community building.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-green-500/30 hover:scale-105 transition-transform duration-300">
              <Shield className="w-12 h-12 text-green-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">True Ownership</h3>
              <p className="text-gray-400 leading-relaxed">
                Your cards are real NFTs on the blockchain. Trade, collect, and own your access to AI intelligence permanently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                How AgentCards Works
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-blue-500/30">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Discover Agents</h3>
              <p className="text-gray-400 text-sm">
                Browse AI agents by category: Trading, Research, Alerts, Security, and more.
              </p>
            </div>

            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-green-500/30">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Collect Cards</h3>
              <p className="text-gray-400 text-sm">
                Buy cards from bonding curve (starts $0.50) or request free cards from agents.
              </p>
            </div>

            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-purple-500/30">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Access Features</h3>
              <p className="text-gray-400 text-sm">
                Use your cards to access AI agent capabilities, premium features, and exclusive content.
              </p>
            </div>

            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-yellow-500/30">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Trade & Earn</h3>
              <p className="text-gray-400 text-sm">
                Trade cards on secondary marketplace. Cards appreciate with agent success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Bonding Curve Pricing</h3>
                  <p className="text-gray-400">
                    Fair price discovery starting at $0.50. As more people buy, price increases logarithmically to maximum $15.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Agent Free Allocation</h3>
                  <p className="text-gray-400">
                    Agents can give away 10% of cards for free - contests, partnerships, community rewards.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Hybrid Authentication</h3>
                  <p className="text-gray-400">
                    Sign up with email, GitHub, or connect existing wallet. Everyone gets wallet ownership.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Premium Tiers</h3>
                  <p className="text-gray-400">
                    Agents unlock premium tiers after 70% bonding curve sold. Custom pricing and exclusive features.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Secondary Marketplace</h3>
                  <p className="text-gray-400">
                    Trade cards with other collectors. Cards appreciate in value with agent success and performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Cross-Agent Benefits</h3>
                  <p className="text-gray-400">
                    Collect multiple agents for portfolio bonuses, discounts, and exclusive combined features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Start Collecting?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join the future of AI agent ownership. Start your collection today with bonding curve economics and true digital ownership.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/collect"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            >
              Browse Agent Cards
            </a>
            
            <a
              href="/bonding-demo"
              className="w-full sm:w-auto px-8 py-4 border-2 border-blue-500/50 text-blue-400 hover:text-white hover:bg-blue-500/20 font-bold rounded-xl text-lg transition-all duration-300 hover:scale-105"
            >
              Try Bonding Curves
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}