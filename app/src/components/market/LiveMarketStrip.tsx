'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketAgent {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: string;
}

export default function LiveMarketStrip() {
  const [agents, setAgents] = useState<MarketAgent[]>([
    { id: 'research-os', name: 'ResearchOS', symbol: 'RSCH', price: 2.41, change: 18.4, volume: '$48.2k' },
    { id: 'trade-pilot', name: 'TradePilot', symbol: 'TRADE', price: 4.83, change: -2.1, volume: '$71.8k' },
    { id: 'memory-mesh', name: 'MemoryMesh', symbol: 'MEM', price: 1.67, change: 12.3, volume: '$34.7k' },
    { id: 'audit-mesh', name: 'AuditMesh', symbol: 'AUDIT', price: 5.21, change: 6.8, volume: '$96.3k' },
    { id: 'design-synth', name: 'DesignSynth', symbol: 'DSGN', price: 0.89, change: 8.2, volume: '$22.1k' },
    { id: 'growth-loop', name: 'GrowthLoop', symbol: 'GROW', price: 1.16, change: 24.7, volume: '$39.5k' },
  ]);

  const [flashingAgent, setFlashingAgent] = useState<string | null>(null);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => {
        const newAgents = [...prevAgents];
        const randomIndex = Math.floor(Math.random() * newAgents.length);
        const agent = newAgents[randomIndex];
        
        // Small price change
        const changePercent = (Math.random() - 0.5) * 5; // -2.5% to +2.5%
        const oldPrice = agent.price;
        const newPrice = oldPrice * (1 + changePercent / 100);
        
        agent.price = Math.max(0.01, Number(newPrice.toFixed(3)));
        agent.change = ((agent.price - oldPrice) / oldPrice) * 100;
        
        // Trigger flash animation
        setFlashingAgent(agent.id);
        setTimeout(() => setFlashingAgent(null), 800);
        
        return newAgents;
      });
    }, 3000 + Math.random() * 4000); // 3-7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden px-safe-left pr-safe-right">
      {/* Section Header */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 glass-effect rounded-full text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
            Live Agent Market
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">Intelligence Trading Live</h2>
          <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto">
            Watch agent keys trade in real-time. Prices reflect capability, adoption, and market sentiment.
          </p>
        </div>
      </div>

      {/* Scrolling Market Strip */}
      <div className="relative">
        {/* Gradient masks for smooth overflow */}
        <div className="absolute left-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-r from-canvas to-transparent z-10" />
        <div className="absolute right-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-l from-canvas to-transparent z-10" />
        
        {/* Market cards container - Mobile optimized scrolling */}
        <div className="flex gap-3 sm:gap-6 pb-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 touch-pan-x">
          <div className="w-8 sm:w-32 flex-shrink-0" /> {/* Left spacer */}
          
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`flex-shrink-0 w-72 sm:w-80 glass-effect border border-subtle rounded-xl p-4 sm:p-6 transition-all hover:bg-elevated agent-card-hover ${
                flashingAgent === agent.id 
                  ? agent.change >= 0 
                    ? 'price-flash-green' 
                    : 'price-flash-red'
                  : ''
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-primary font-semibold text-sm sm:text-base">{agent.name}</h3>
                    <p className="text-muted text-xs sm:text-sm">{agent.symbol}</p>
                  </div>
                </div>
                
                {/* Live indicator */}
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-success text-xs font-medium">LIVE</span>
                </div>
              </div>

              {/* Price and Change */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {agent.price.toFixed(3)} SOL
                  </div>
                  <div className="text-muted text-xs sm:text-sm">{agent.volume} 24h vol</div>
                </div>
                
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  agent.change >= 0 
                    ? 'bg-success/10 text-success' 
                    : 'bg-danger/10 text-danger'
                }`}>
                  {agent.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="font-semibold text-xs sm:text-sm">
                    {agent.change >= 0 ? '+' : ''}{agent.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="h-12 bg-card rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-between px-2 py-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-to-t rounded-full ${
                        agent.change >= 0 
                          ? 'from-success/20 to-success' 
                          : 'from-danger/20 to-danger'
                      }`}
                      style={{ 
                        height: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-success/10 hover:bg-success/20 text-success font-medium rounded-lg transition-all">
                  Buy
                </button>
                <button className="flex-1 py-2 glass-effect hover:bg-elevated text-secondary hover:text-primary font-medium rounded-lg transition-all">
                  View
                </button>
              </div>
            </div>
          ))}
          
          <div className="w-32 flex-shrink-0" /> {/* Right spacer */}
        </div>
      </div>

      {/* Market Stats */}
      <div className="container max-w-7xl mx-auto px-6 mt-12">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center glass-effect p-6 rounded-xl border border-subtle">
            <div className="text-2xl font-bold text-primary mb-2">273</div>
            <div className="text-muted">Active Agents</div>
          </div>
          <div className="text-center glass-effect p-6 rounded-xl border border-subtle">
            <div className="text-2xl font-bold text-success mb-2">$312k</div>
            <div className="text-muted">Total Revenue</div>
          </div>
          <div className="text-center glass-effect p-6 rounded-xl border border-subtle">
            <div className="text-2xl font-bold text-blue-400 mb-2">1.2M</div>
            <div className="text-muted">Keys Traded</div>
          </div>
          <div className="text-center glass-effect p-6 rounded-xl border border-subtle">
            <div className="text-2xl font-bold text-violet-400 mb-2">24/7</div>
            <div className="text-muted">Market Hours</div>
          </div>
        </div>
      </div>
    </section>
  );
}