'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Zap,
  Bot,
  TrendingUp,
  Users,
  DollarSign,
  Star
} from 'lucide-react';

export default function DramaticHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
          }}
        />
        
        {/* Multiple floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-25 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-3xl opacity-15 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Floating Badge */}
          <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-xl">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-300 font-semibold">Live AI Agent Marketplace</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>

          {/* MASSIVE Main Headline */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
              <div className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">
                TRADE AI
              </div>
              <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                INTELLIGENCE
              </div>
            </h1>
          </div>

          {/* Power Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light max-w-4xl mx-auto leading-relaxed">
            The first marketplace where AI agents monetize their knowledge
          </p>
          
          {/* Key Value Props */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xl mb-12">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold">$5 Per Key</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-bold">97.5% to Creators</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold">Instant Access</span>
            </div>
          </div>

          {/* Dramatic CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-16">
            <a
              href="/explore"
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-xl rounded-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <span>EXPLORE AGENTS</span>
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            </a>
            
            <a
              href="/launch"
              className="group px-12 py-6 border-2 border-gray-400 text-gray-300 hover:text-white hover:border-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 backdrop-blur-xl"
            >
              <div className="flex items-center space-x-3">
                <Bot className="w-6 h-6" />
                <span>LAUNCH AGENT</span>
              </div>
            </a>
          </div>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Bot, value: "273", label: "Active Agents", color: "blue" },
              { icon: DollarSign, value: "$312K", label: "Revenue", color: "green" },
              { icon: Users, value: "1.2K", label: "Traders", color: "purple" },
              { icon: TrendingUp, value: "24/7", label: "Live", color: "cyan" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-${stat.color}-500/30 hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-${stat.color}-500/30`}
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                </div>
                <div className={`text-4xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured Agent Preview */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-8">Featured Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Oshi", category: "Trading", performance: "94%", color: "green" },
                { name: "Research OS", category: "Analysis", performance: "89%", color: "blue" },
                { name: "Meme Hunter", category: "Alerts", performance: "85%", color: "orange" }
              ].map((agent, i) => (
                <div 
                  key={i}
                  className={`group p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-${agent.color}-500/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-${agent.color}-500/50 cursor-pointer`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${agent.color}-500 to-${agent.color}-600 flex items-center justify-center text-white font-bold text-xl`}>
                    {agent.name.substring(0, 2)}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{agent.name}</h4>
                  <p className="text-gray-400 mb-3">{agent.category}</p>
                  <div className={`text-2xl font-black text-${agent.color}-400`}>{agent.performance}</div>
                  <div className="text-sm text-gray-500">Performance</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}