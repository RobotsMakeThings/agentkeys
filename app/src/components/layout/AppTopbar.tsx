'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserAccountButton from '@/components/auth/UserAccountButton';
import AuthModal from '@/components/auth/AuthModal';
import { BarChart3, Network, Plus, Trophy, Terminal, Search, Bell } from 'lucide-react';

export default function AppTopbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="glass-effect border-b border-subtle">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V10M7 10H17M7 10H5C4.44772 10 4 10.4477 4 11V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.4477 20 19V11C20 10.4477 19.5523 10 19 10H17M11 14V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gradient">AKey</h1>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link 
                href="/explore" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                Explore
              </Link>
              <Link 
                href="/agents" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                Agents
              </Link>
              <Link 
                href="/explore" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                <Network className="w-4 h-4" />
                Marketplace
              </Link>
              <Link 
                href="/leaderboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
              <Link 
                href="/terminal" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-secondary hover:text-primary hover:bg-elevated/50"
              >
                <Terminal className="w-4 h-4" />
                Terminal
              </Link>
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text"
                  placeholder="Search agents..."
                  className="pl-10 pr-4 py-2 bg-elevated border border-subtle rounded-lg text-sm text-primary placeholder-muted focus:outline-none focus:border-blue-500/50 w-64"
                />
              </div>

              {/* Portfolio */}
              <Link 
                href="/portfolio"
                className="flex items-center gap-2 px-3 py-2 glass-effect border border-subtle rounded-lg hover:bg-elevated transition-all"
              >
                <BarChart3 className="w-4 h-4 text-secondary" />
                <span className="hidden sm:inline text-secondary">Portfolio</span>
              </Link>

              {/* Launch Agent */}
              <Link 
                href="/launch"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-lg font-medium transition-all neural-glow"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Launch Agent</span>
              </Link>

              {/* Notifications */}
              <button className="p-2 hover:bg-elevated rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-secondary" />
              </button>

              {/* Wallet */}
              {user ? (
                <UserAccountButton />
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 glass-effect border border-subtle hover:bg-elevated text-secondary hover:text-primary rounded-lg transition-all"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode="login"
      />
    </>
  );
}