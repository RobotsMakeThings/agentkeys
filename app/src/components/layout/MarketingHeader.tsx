'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserAccountButton from '@/components/auth/UserAccountButton';
import AuthModal from '@/components/auth/AuthModal';
import MobileMenu from '@/components/navigation/MobileMenu';
import { User } from 'lucide-react';

export default function MarketingHeader() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="glass-effect sticky top-0 z-50 border-b border-subtle pl-safe-left pr-safe-right">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-h-touch touch-manipulation">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 8H16V12H8V8Z" fill="currentColor"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
              </div>
              <div className="block">
                <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AgentCards</h1>
                <p className="text-xs text-muted hidden xs:block">Collect AI Intelligence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              <Link href="/collect" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Collect
              </Link>
              <Link href="/marketplace" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Marketplace
              </Link>
              <Link href="/leaderboard" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Leaderboard
              </Link>
              <Link href="/portfolio" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                Portfolio
              </Link>
              <Link href="/bonding-demo" className="text-blue-400 hover:text-blue-300 transition-colors min-h-touch flex items-center">
                NEW Cards
              </Link>
              <Link href="/auth-demo" className="text-purple-400 hover:text-purple-300 transition-colors min-h-touch flex items-center">
                NEW Auth
              </Link>
              <Link href="/about" className="text-secondary hover:text-primary transition-colors min-h-touch flex items-center">
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Actions */}
              <div className="hidden lg:block">
                {user ? (
                  <UserAccountButton />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all min-h-touch touch-manipulation"
                  >
                    Sign In
                  </button>
                )}
              </div>
              
              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center gap-2">
                {user && (
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