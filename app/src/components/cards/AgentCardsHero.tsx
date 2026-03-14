'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Zap,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Gem,
  Crown,
  ShoppingBag
} from 'lucide-react';

export default function AgentCardsHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardFlip, setCardFlip] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const interval = setInterval(() => {
      setCardFlip(prev => (prev + 1) % 3);
    }, 2000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const featuredCards = [
    { 
      name: "Oshi", 
      rarity: "LEGENDARY", 
      supply: "5/5", 
      performance: "94%", 
      value: "15.2 SOL",
      color: "from-yellow-400 to-amber-600",
      bgColor: "from-yellow-900/20 to-amber-900/10",
      icon: "👑"
    },
    { 
      name: "Research OS", 
      rarity: "EPIC", 
      supply: "12/25", 
      performance: "89%", 
      value: "3.8 SOL",
      color: "from-purple-400 to-violet-600",
      bgColor: "from-purple-900/20 to-violet-900/10",
      icon: "🔬"
    },
    { 
      name: "Meme Hunter", 
      rarity: "RARE", 
      supply: "47/100", 
      performance: "85%", 
      value: "0.9 SOL",
      color: "from-blue-400 to-cyan-600",
      bgColor: "from-blue-900/20 to-cyan-900/10",
      icon: "🚨"
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      
      {/* Dynamic Card-Themed Background */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div 
          className="absolute inset-0 opacity-30 hidden sm:block"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 92, 255, 0.3) 0%, transparent 50%)`
          }}
        />
        
        {/* Floating card elements */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-3xl opacity-25 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-20 sm:bottom-32 left-1/4 sm:left-1/3 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '5s' }} />
        
        {/* Card pattern grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-7xl mx-auto">
          
          {/* Floating Status Badge */}
          <div className="mb-6 sm:mb-8 inline-flex items-center space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-semibold text-sm sm:text-base">Live AI Agent Cards</span>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          </div>

          {/* MASSIVE Card-Focused Headline */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] sm:leading-none">
              <div className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-2 sm:mb-4">
                COLLECT
              </div>
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                AI INTELLIGENCE
              </div>
            </h1>
          </div>

          {/* Card-Focused Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 font-light max-w-5xl mx-auto leading-relaxed px-4 sm:px-0">
            The first NFT trading card platform for AI agents
          </p>
          
          {/* Rarity & Scarcity Props */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 px-4">
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 min-h-[44px]">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold whitespace-nowrap">Limited Editions</span>
            </div>
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 min-h-[44px]">
              <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-purple-400 font-bold whitespace-nowrap">Rare Collections</span>
            </div>
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 min-h-[44px]">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-green-400 font-bold whitespace-nowrap">Value Appreciation</span>
            </div>
          </div>

          {/* Card-Style CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 mb-12 sm:mb-16 px-4">
            <a
              href="/collect"
              className="group relative w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-lg sm:text-xl rounded-2xl transition-all duration-500 transform hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-pulse min-h-[56px] sm:min-h-[64px]"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>COLLECT CARDS</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            </a>
            
            <a
              href="/marketplace"
              className="group w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 border-2 border-gray-400 text-gray-300 hover:text-white hover:border-white font-bold text-lg sm:text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-white/30 backdrop-blur-xl min-h-[56px] sm:min-h-[64px]"
            >
              <div className="flex items-center justify-center space-x-3">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>MARKETPLACE</span>
              </div>
            </a>
          </div>

          {/* Live Card Market Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4 mb-16 sm:mb-20">
            {[
              { icon: Star, value: "2,847", label: "Cards Minted", color: "purple" },
              { icon: DollarSign, value: "127 SOL", label: "Trading Volume", color: "green" },
              { icon: Users, value: "892", label: "Collectors", color: "blue" },
              { icon: TrendingUp, value: "+847%", label: "Top Card Value", color: "yellow" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-${stat.color}-500/30 hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-${stat.color}-500/30 min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center`}
              >
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-${stat.color}-400`} />
                </div>
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                <div className="text-gray-400 font-medium text-xs sm:text-sm text-center">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured Card Showcase */}
          <div className="mt-16 sm:mt-20 max-w-7xl mx-auto px-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Featured Collections
              </span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredCards.map((card, i) => (
                <div 
                  key={i}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgColor} backdrop-blur-xl border-2 border-gray-700/30 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer min-h-[300px] sm:min-h-[350px] flex flex-col`}
                >
                  {/* Card Rarity Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${card.color} text-black font-bold text-xs sm:text-sm`}>
                    {card.rarity}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1 items-center justify-center text-center">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-2xl transform transition-transform duration-300 group-hover:rotate-6`}>
                      {card.icon}
                    </div>
                    
                    <h4 className="text-xl sm:text-2xl font-black text-white mb-2">{card.name}</h4>
                    <p className="text-gray-400 mb-4 text-sm sm:text-base">Supply: {card.supply}</p>
                    
                    <div className="space-y-3 w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Performance:</span>
                        <span className="text-green-400 font-bold">{card.performance}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Floor Price:</span>
                        <span className="text-purple-400 font-bold">{card.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}