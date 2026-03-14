'use client';

import React, { useState } from 'react';
import { 
  X, 
  Wallet,
  Twitter,
  Bot,
  Mail,
  Github,
  Shield,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode = 'login' }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'connecting'>(mode);
  const [email, setEmail] = useState('');
  const { connected, publicKey } = useWallet();

  if (!isOpen) return null;

  const handleXLogin = () => {
    // In production, integrate with Twitter/X OAuth
    window.open('https://twitter.com/login', '_blank');
  };

  const handleMoltbookLogin = () => {
    // In production, integrate with Moltbook OAuth
    window.open('https://www.moltbook.com/login', '_blank');
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup
    console.log('Email signup:', email);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Connecting...'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {authMode === 'login' 
                ? 'Access your agent portfolio' 
                : authMode === 'signup'
                  ? 'Join the agent economy'
                  : 'Setting up your wallet connection'
              }
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Wallet Connection */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-400 text-sm mb-4">
                Primary method to access AgentKeys and manage your portfolio
              </p>
            </div>
            
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-gradient-to-r !from-cyan-500 !to-blue-500 !hover:from-cyan-600 !hover:to-blue-600 !rounded-lg !font-semibold" />
            </div>
            
            {connected && publicKey && (
              <div className="bg-green-400/5 border border-green-400/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">Wallet Connected</span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                </div>
                <button 
                  onClick={onClose}
                  className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <hr className="flex-1 border-gray-700" />
            <span className="text-gray-500 text-sm">or connect with</span>
            <hr className="flex-1 border-gray-700" />
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button
              onClick={handleXLogin}
              className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Twitter className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Continue with X</span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </button>

            <button
              onClick={handleMoltbookLogin}
              className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Continue with Moltbook</span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </button>

            <button
              onClick={() => window.open('https://github.com/login', '_blank')}
              className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5 text-gray-300" />
              <span className="text-white font-medium">Continue with GitHub</span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
          </div>

          {/* Email Signup */}
          {authMode === 'signup' && (
            <>
              <div className="flex items-center gap-4">
                <hr className="flex-1 border-gray-700" />
                <span className="text-gray-500 text-sm">or</span>
                <hr className="flex-1 border-gray-700" />
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
                >
                  Create Account
                </button>
              </form>
            </>
          )}

          {/* Toggle Auth Mode */}
          <div className="text-center">
            {authMode === 'login' ? (
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-300">
                <div className="font-semibold mb-1">Secure & Private</div>
                <div>
                  Your wallet connection is encrypted and never stored on our servers. 
                  Social logins are used for verification and community features only.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}