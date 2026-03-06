'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Search, 
  Plus, 
  BarChart3, 
  BookOpen, 
  Wallet,
  User,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = 'explore' }: NavigationProps) {
  const { publicKey, connected, disconnect } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigationItems = [
    { id: 'explore', label: 'Explore', href: '/' },
    { id: 'agents', label: 'Agents', href: '/agents' },
    { id: 'leaderboard', label: 'Leaderboard', href: '/leaderboard' },
    { id: 'docs', label: 'Docs', href: '/docs' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-strong' : 'glass'
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-heading font-semibold text-primary group-hover:text-gradient transition-colors">
              AgentKeys
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-body font-medium transition-colors relative ${
                  currentPage === item.id
                    ? 'text-primary'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-card">
              <Search className="w-5 h-5" />
            </button>

            {connected ? (
              <div className="flex items-center gap-3">
                {/* Portfolio */}
                <Link
                  href="/portfolio"
                  className="flex items-center gap-2 px-4 py-2 text-small font-medium text-secondary hover:text-primary transition-colors rounded-lg hover:bg-card"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </Link>

                {/* Create Agent */}
                <Link
                  href="/create"
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Agent</span>
                </Link>

                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-card"
                  >
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:inline text-small font-medium">
                      {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 card-elevated animate-fadeIn">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-subtle mb-2">
                          <p className="text-small font-medium text-primary">Connected Wallet</p>
                          <p className="text-xs text-muted font-mono">
                            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                          </p>
                        </div>
                        
                        <Link
                          href="/portfolio"
                          className="flex items-center gap-3 px-3 py-2 text-small text-secondary hover:text-primary hover:bg-card rounded-lg transition-colors"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Portfolio
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-3 py-2 text-small text-secondary hover:text-primary hover:bg-card rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        
                        <div className="border-t border-subtle mt-2 pt-2">
                          <button
                            onClick={disconnect}
                            className="flex items-center gap-3 px-3 py-2 text-small text-danger hover:bg-card rounded-lg transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/create"
                  className="btn btn-ghost btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Agent</span>
                </Link>
                
                <WalletMultiButton className="btn btn-primary btn-sm !bg-gradient-primary hover:!shadow-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-subtle">
          <div className="flex items-center justify-around py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-center p-2 text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}