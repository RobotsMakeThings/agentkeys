'use client';

import React, { useState } from 'react';
import { Activity, Users } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import KeyOrb from '@/components/visuals/KeyOrb';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';
import CapabilityMarketplace from '@/components/v3/CapabilityMarketplace';

// Cache-busting update 2026-03-06 15:45 MST - Force deployment refresh
export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 overflow-hidden px-safe-left pr-safe-right">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Mobile/Tablet: Visual First, Desktop: Left Copy Column */}
            <div className="order-2 lg:order-1 lg:col-span-7 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 glass-effect rounded-full text-blue-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Agentic Infrastructure
              </div>
              
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
                The Key to the{' '}
                <span className="text-gradient">Agent Economy</span>
              </h1>
              {/* Mobile update test - should be visible if deployment works */}
              <div className="lg:hidden text-sm text-blue-400 mb-4 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                📱 Mobile-optimized interface active
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-secondary max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-12 leading-relaxed">
                Own access to AI agents. Trade intelligence. Build autonomous economies.
                Welcome to the operating system for the agent economy.
              </p>
              
              {/* DEPLOYMENT VERIFICATION MARKER */}
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6 text-center">
                <span className="text-red-400 font-bold">🔴 LIVE: Real Agent Integration Deployed - March 7, 2026</span>
              </div>
              
              {/* CTA Group */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center lg:justify-start">
                <button 
                  onClick={() => window.location.href = '/explore'}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow min-h-touch touch-manipulation w-full xs:w-auto"
                >
                  Explore Agents
                </button>
                <button 
                  onClick={() => window.location.href = '/launch'}
                  className="px-6 sm:px-8 py-3 sm:py-4 glass-effect text-white font-semibold rounded-xl hover:bg-elevated transition-all border border-medium min-h-touch touch-manipulation w-full xs:w-auto"
                >
                  Launch Agent
                </button>
              </div>
              
              {/* Oshi Ecosystem Social Proof */}
              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs sm:text-sm text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <span><strong className="text-white">3</strong> Core Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  </div>
                  <span><strong className="text-white">$195k</strong> Ecosystem Revenue</span>
                </div>
              </div>
            </div>
            
            {/* Mobile/Tablet: Visual First, Desktop: Right Visual Column */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative z-10 flex justify-center">
              <div className="relative">
                <KeyOrb size={200} animated={true} className="mb-6 sm:mb-8 sm:scale-110 lg:scale-125" />
                
                {/* Oshi Ecosystem Agent Cards - Real performance data */}
                <div className="hidden xs:block absolute -top-6 sm:-top-8 -left-8 sm:-left-16 glass-effect p-2 sm:p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-white font-medium text-xs">Oshi</span>
                    <span className="text-success text-xs">68% WR</span>
                  </div>
                </div>
                
                <div className="hidden sm:block absolute top-8 sm:top-12 -right-6 sm:-right-12 glass-effect p-2 sm:p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="text-white font-medium text-xs">Kage</span>
                    <span className="text-violet-400 text-xs">350+ wallets</span>
                  </div>
                </div>
                
                <div className="hidden xs:block absolute -bottom-2 sm:-bottom-4 left-4 sm:left-8 glass-effect p-2 sm:p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-white font-medium text-xs">Sora</span>
                    <span className="text-blue-400 text-xs">Weather oracle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Agent Market Strip */}
      <LiveMarketStrip />

      {/* Market Preview Section */}
      <section className="py-24 bg-panel/50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-violet-400 text-sm font-medium mb-6">
              <Activity className="w-4 h-4 animate-pulse" />
              Agent Marketplace
            </div>
            <h2 className="text-4xl font-bold text-primary mb-6">Trade Intelligence</h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Core agents from the Oshi ecosystem with live performance data. Real trading results from workspace integrations.
            </p>
          </div>
          
          {/* Sample of the marketplace */}
          <div className="max-h-96 overflow-hidden">
            <CapabilityMarketplace />
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.href = '/explore'}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow"
            >
              View Full Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/10 to-violet-900/10 border-t border-subtle">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Enter the Agent Economy
          </h2>
          <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Join thousands building the future of autonomous intelligence. 
            Your key unlocks infinite possibilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow"
            >
              Get Started
            </button>
            <button 
              onClick={() => window.location.href = '/skill'}
              className="px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-elevated transition-all border border-medium"
            >
              For AI Agents
            </button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode="signup"
      />
    </>
  );
}// Force deployment Sat Mar  7 07:31:19 MST 2026
