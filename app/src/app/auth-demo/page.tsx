'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { 
  User, 
  Mail, 
  Wallet, 
  Github,
  Shield,
  Key,
  CreditCard,
  Clock
} from 'lucide-react';

export default function AuthDemoPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const features = [
    {
      icon: User,
      title: 'Multiple Login Options',
      description: 'Email, GitHub OAuth, or wallet connect - your choice',
      color: 'blue'
    },
    {
      icon: Wallet,
      title: 'Unified Profile',
      description: 'Same experience whether you connect or create new wallet',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'You Own Your Keys',
      description: 'Email/GitHub users get full private key access',
      color: 'purple'
    },
    {
      icon: Key,
      title: 'No Complexity',
      description: 'Crypto benefits without the learning curve',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      
      {/* Header */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold tracking-wider">NEW AUTH SYSTEM</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-none mb-8">
            <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              WEB2 EASE
            </div>
            <div className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              WEB3 POWER
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            Connect existing wallet OR create new account with auto-generated wallet. Perfect for crypto natives and newcomers alike.
          </p>

          {!user ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
            >
              <span>Try the New Auth System</span>
            </button>
          ) : (
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="text-green-400 font-bold">✅ You're signed in!</span>
              </div>
              <div>
                <button
                  onClick={logout}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              We handle all the crypto complexity behind the scenes, so you can focus on collecting and trading agent cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-${feature.color}-500/30 hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-${feature.color}-500/20`}
              >
                <feature.icon className={`w-12 h-12 text-${feature.color}-400 mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Info (if logged in) */}
      {user && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl border border-gray-700/50 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Your Account Details</h2>
                <p className="text-gray-400">Here's what we automatically created for you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* User Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-purple-400 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                        <div className="flex items-center space-x-1 text-xs text-purple-400 mt-1">
                          {user.authMethod === 'github' && <Github className="w-3 h-3" />}
                          {user.authMethod === 'wallet' && <Wallet className="w-3 h-3" />}
                          {user.authMethod === 'email' && <Mail className="w-3 h-3" />}
                          <span>
                            {user.authMethod === 'github' && 'GitHub Account'}
                            {user.authMethod === 'wallet' && 'Wallet Connected'}
                            {user.authMethod === 'email' && 'Email Account'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-green-400 flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span>Your Crypto Wallet</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
                      <div className="text-white font-mono text-sm break-all">
                        {user.walletAddress}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-green-400">Active & Secure</span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      user.hasPrivateKey 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-blue-500/10 border border-blue-500/30'
                    }`}>
                      <div className={`text-sm ${user.hasPrivateKey ? 'text-green-400' : 'text-blue-400'}`}>
                        <strong>
                          {user.hasPrivateKey ? '🔑 You Own This Wallet:' : '🔐 Connected Wallet:'} 
                        </strong> {user.hasPrivateKey 
                          ? 'Private keys encrypted and exportable anytime'
                          : 'Using your external wallet connection'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-8 border-t border-gray-700/50 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/collect"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Start Collecting</span>
                  </a>
                  
                  <a
                    href="/portfolio"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>View Portfolio</span>
                  </a>
                  
                  <a
                    href="/bonding-demo"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-all"
                  >
                    <span>Try New System</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Old vs New Experience
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30">
              <h3 className="text-xl font-bold text-red-400 mb-6">❌ Old Way (Crypto Wallets)</h3>
              <div className="space-y-4 text-gray-300">
                <div>• Download MetaMask or other wallet</div>
                <div>• Write down 12-24 word seed phrase</div>
                <div>• Store seed phrase safely</div>
                <div>• Connect wallet to every app</div>
                <div>• Manage private keys yourself</div>
                <div>• Risk losing everything if you forget</div>
              </div>
            </div>

            {/* New Way */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30">
              <h3 className="text-xl font-bold text-green-400 mb-6">✅ New Way (Hybrid System)</h3>
              <div className="space-y-4 text-gray-300">
                <div>• Connect existing wallet (crypto natives)</div>
                <div>• OR sign up with email/GitHub (newcomers)</div>
                <div>• Auto wallet creation with private keys</div>
                <div>• Same unified profile experience</div>
                <div>• Export keys anytime (email/GitHub users)</div>
                <div>• Best of both worlds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode="login"
      />
    </div>
  );
}