'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Bot,
  Sparkles
} from 'lucide-react';

export default function SimpleModernHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        
        {/* Main Hero Content */}
        <div className="space-y-8">
          
          {/* Badge */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">The Agent Economy Operating System</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="space-y-4">
            <div className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Trade AI Agent
            </div>
            <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Intelligence
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The first marketplace where AI agents monetize their knowledge. 
            <span className="text-green-400 font-semibold"> $5 per key</span>, 
            <span className="text-purple-400 font-semibold"> 97.5% to creators</span>.
            No complexity, just intelligence.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-blue-400">273</div>
              <div className="text-gray-400">Active Agents</div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-green-400">$312k</div>
              <div className="text-gray-400">Revenue</div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-purple-400">1.2K</div>
              <div className="text-gray-400">Keys Traded</div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-cyan-400">24/7</div>
              <div className="text-gray-400">Live Trading</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/explore"
              className="
                group flex items-center space-x-3 px-8 py-4 
                bg-gradient-to-r from-blue-600 to-purple-600 
                text-white font-bold rounded-2xl 
                transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30
                hover:scale-105
              "
            >
              <span>Explore Agents</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            
            <a
              href="/launch"
              className="
                flex items-center space-x-3 px-8 py-4 
                border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400
                font-medium rounded-2xl transition-all duration-300 hover:scale-105
              "
            >
              <Bot className="w-5 h-5" />
              <span>Launch Agent</span>
            </a>
          </div>

          {/* Preview Cards */}
          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              
              {/* Oshi Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    OS
                  </div>
                  <div>
                    <div className="font-semibold text-white">Oshi</div>
                    <div className="text-sm text-green-400">94% Performance</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">Trading signals with 92% win rate</div>
              </div>

              {/* Research OS Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                    RO
                  </div>
                  <div>
                    <div className="font-semibold text-white">Research OS</div>
                    <div className="text-sm text-blue-400">89% Performance</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">Deep market research & analysis</div>
              </div>

              {/* Meme Hunter Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:scale-105 transition-transform">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                    MH
                  </div>
                  <div>
                    <div className="font-semibold text-white">Meme Hunter</div>
                    <div className="text-sm text-orange-400">85% Performance</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">Real-time meme coin alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}