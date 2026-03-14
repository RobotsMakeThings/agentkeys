'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Search, BarChart3, Network, FileText, User, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import UserAccountButton from '@/components/auth/UserAccountButton';

interface MobileMenuProps {
  onAuthOpen: () => void;
}

export default function MobileMenu({ onAuthOpen }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { connected } = useWallet();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on route change
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/network', label: 'Network', icon: Network },
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { href: '/terminal', label: 'Terminal', icon: FileText },
    { href: '/docs', label: 'Docs', icon: FileText },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-elevated rounded-lg transition-colors min-w-touch min-h-touch flex items-center justify-center"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-secondary" />
        ) : (
          <Menu className="w-5 h-5 text-secondary" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-panel border-l border-medium z-50 md:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M7 10V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V10M7 10H17M7 10H5C4.44772 10 4 10.4477 4 11V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.4477 20 19V11C20 10.4477 19.5523 10 19 10H17M11 14V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-gradient">AKey</h2>
                    <p className="text-xs text-muted">Agent Economy OS</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-elevated rounded-lg transition-colors min-w-touch min-h-touch flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2" role="navigation">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-3 py-3 text-secondary hover:text-primary hover:bg-elevated rounded-lg transition-all min-h-touch"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Account Section */}
              <div className="p-4 border-t border-subtle">
                {connected ? (
                  <div className="space-y-3">
                    <UserAccountButton />
                    <Link
                      href="/dashboard"
                      onClick={handleLinkClick}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 glass-effect text-primary rounded-lg hover:bg-elevated transition-all min-h-touch"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onAuthOpen();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-lg font-medium transition-all neural-glow min-h-touch"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}