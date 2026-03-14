'use client';

import React, { useState } from 'react';
import { 
  User, 
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function UserAccountButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  if (!connected || !publicKey) {
    return null;
  }

  const shortAddress = `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-white font-medium text-sm">{shortAddress}</div>
          <div className="text-gray-400 text-xs">Connected</div>
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">Wallet Connected</div>
                <div className="text-gray-400 text-sm">Solana Mainnet</div>
              </div>
            </div>
            
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 w-full p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-gray-300 font-mono text-sm flex-1 text-left">
                {publicKey.toString()}
              </span>
              {addressCopied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          <div className="p-2">
            <Link 
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Dashboard</span>
            </Link>
            
            <Link 
              href="/portfolio"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Portfolio</span>
            </Link>
            
            <button
              onClick={() => {
                window.open(`https://solscan.io/account/${publicKey.toString()}`, '_blank');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">View on Solscan</span>
            </button>
            
            <hr className="border-gray-700 my-2" />
            
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Settings would open a settings modal
              }}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Settings</span>
            </button>
            
            <button
              onClick={() => {
                disconnect();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-red-900/20 rounded-lg transition-colors text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}