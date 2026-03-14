'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Wallet, 
  LogOut, 
  Settings, 
  TrendingUp, 
  Copy, 
  Check,
  ChevronDown,
  Github,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, getUserWallet } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const wallet = getUserWallet();

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy wallet address:', err);
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getLoginMethodIcon = () => {
    switch (user.authMethod) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'wallet':
        return <Wallet className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getLoginMethodText = () => {
    switch (user.authMethod) {
      case 'github':
        return 'GitHub';
      case 'wallet':
        return 'Wallet';
      default:
        return 'Email';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <div className="text-white font-medium text-sm">
            {user.name}
          </div>
          <div className="text-gray-400 text-xs flex items-center space-x-1">
            {getLoginMethodIcon()}
            <span>{formatWalletAddress(wallet.address)}</span>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50">
          
          {/* User Header */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{user.name}</div>
                <div className="text-gray-400 text-sm">{user.email}</div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {getLoginMethodIcon()}
                  <span>Signed in via {getLoginMethodText()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Your Wallet</span>
              <div className="flex items-center space-x-1 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Active</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2 bg-gray-800/50 rounded-lg">
                <div className="text-white text-sm font-mono">
                  {formatWalletAddress(wallet.address)}
                </div>
              </div>
              <button
                onClick={copyWalletAddress}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                title="Copy wallet address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              {user.hasPrivateKey 
                ? 'Your wallet • You own the private keys' 
                : 'Connected external wallet'
              }
            </div>
            
            {user.hasPrivateKey && (
              <button
                onClick={() => alert('Private key export coming soon!')}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Export Private Keys
              </button>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <a
              href="/portfolio"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Wallet className="w-4 h-4" />
              <span>My Portfolio</span>
            </a>
            
            <a
              href="/collect"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Browse Cards</span>
            </a>
            
            <button
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors w-full"
              onClick={() => {
                setIsOpen(false);
                // TODO: Open settings modal
                alert('Settings coming soon!');
              }}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-700/50 py-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}