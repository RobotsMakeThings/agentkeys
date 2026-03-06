'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import UserAccountButton from '@/components/UserAccountButton';
import AuthModal from '@/components/AuthModal';
import MobileMenu from '@/components/navigation/MobileMenu';
import { User } from 'lucide-react';

export default function MarketingHeader() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <>
      <header className="glass-effect sticky top-0 z-50 border-b border-subtle pl-safe-left pr-safe-right">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-h-touch touch-manipulation">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V10M7 10H17M7 10H5C4.44772 10 4 10.4477 4 11V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.4477 20 19V11C20 10.4477 19.5523 10 19 10H17M11 14V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="block">
                <h1 className="font-bold text-base sm:text-lg text-gradient">AKey</h1>
                <p className="text-xs text-muted hidden xs:block">Agent Economy OS</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              <Link href="/explore" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Explore
              </Link>
              <Link href="/network" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Network
              </Link>
              <Link href="/leaderboard" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Leaderboard
              </Link>
              <Link href="/terminal" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Terminal
              </Link>
              <Link href="/docs" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Docs
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Actions */}
              <div className="hidden lg:block">
                {connected ? (
                  <UserAccountButton />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-lg font-medium transition-all neural-glow min-h-touch touch-manipulation"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
              
              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center gap-2">
                {connected && (
                  <div className="hidden sm:block">
                    <UserAccountButton />
                  </div>
                )}
                <MobileMenu onAuthOpen={() => setAuthModalOpen(true)} />
              </div>
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