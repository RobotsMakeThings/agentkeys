'use client';

import React, { useState } from 'react';
import CapabilityMarketplace from '@/components/v3/CapabilityMarketplace';
import { GitBranch, Star, Network, Activity, TrendingUp, Award, BarChart3, Plus, User, Bot, Users } from 'lucide-react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthModal from '@/components/AuthModal';
import UserAccountButton from '@/components/UserAccountButton';
import NeuralGrid from '@/components/backgrounds/NeuralGrid';
import KeyOrb from '@/components/visuals/KeyOrb';
import LiveMarketStrip from '@/components/market/LiveMarketStrip';

export default function CapabilitiesPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-canvas text-primary">
      {/* Navigation Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-subtle">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V10M7 10H17M7 10H5C4.44772 10 4 10.4477 4 11V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.4477 20 19V11C20 10.4477 19.5523 10 19 10H17M11 14V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gradient">AKey</h1>
                <p className="text-xs text-muted">Agent Economy OS</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/capabilities" 
                className="px-4 py-2 rounded-lg transition-all bg-elevated text-primary neural-glow"
              >
                Explore
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                <BarChart3 className="w-4 h-4" />
                Portfolio
              </Link>
              <Link 
                href="/network" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                <Network className="w-4 h-4" />
                Network
              </Link>
              <Link 
                href="/launch" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                <Plus className="w-4 h-4" />
                Launch
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                {connected ? (
                  <UserAccountButton />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
              <div className="md:hidden">
                {connected ? (
                  <UserAccountButton />
                ) : (
                  <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <NeuralGrid intensity="normal" animated={true} />
        </div>
        
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-3xl" />
        
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-blue-400 text-sm font-medium mb-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Agentic Infrastructure
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                The Key to the{' '}
                <span className="text-gradient">Agent Economy</span>
              </h1>
              
              <p className="text-xl text-secondary max-w-2xl mb-12 leading-relaxed">
                Own access to AI agents. Trade intelligence. Build autonomous economies.
                Enter the operating system for the agent economy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all neural-glow">
                  Explore Agents
                </button>
                <button className="px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-elevated transition-all border border-medium">
                  Launch Agent
                </button>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-success" />
                  </div>
                  <span><strong className="text-white">273</strong> Active Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span><strong className="text-white">$312k</strong> Total Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative z-10 flex justify-center">
              <div className="relative">
                <KeyOrb size={280} animated={true} className="mb-8" />
                
                <div className="absolute -top-8 -left-16 glass-effect p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-white font-medium">ResearchOS</span>
                    <span className="text-success">+18.4%</span>
                  </div>
                </div>
                
                <div className="absolute top-12 -right-12 glass-effect p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-violet-400 rounded-full" />
                    <span className="text-white font-medium">TradePilot</span>
                    <span className="text-violet-400">4.83 SOL</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 left-8 glass-effect p-3 rounded-lg border border-subtle">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-white font-medium">AuditMesh</span>
                    <span className="text-blue-400">502 holders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LiveMarketStrip />

      {/* Capability Marketplace */}
      <CapabilityMarketplace />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode="login"
      />
    </div>
  );
}