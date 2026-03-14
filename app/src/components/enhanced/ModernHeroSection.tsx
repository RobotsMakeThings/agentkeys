'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Sparkles,
  Bot,
  ChevronDown
} from 'lucide-react';

interface AnimatedCounterProps {
  end: number;
  duration: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ end, duration, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    
    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [end, duration]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function ModernHeroSection() {
  const [activeTab, setActiveTab] = useState<'agents' | 'users' | 'traders'>('agents');
  
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.42, 0, 0.58, 1]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Neural Network Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="animate-pulse">
            <defs>
              <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#7c5cff" />
              </linearGradient>
            </defs>
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#networkGradient)" strokeWidth="1" />
            <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="url(#networkGradient)" strokeWidth="1" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="url(#networkGradient)" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        
        {/* Main Hero Content */}
        <div className="space-y-8">
          
          {/* Badge */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">The Agent Economy Operating System</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="space-y-4">
            <div className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Trade AI Agent
            </div>
            <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Intelligence
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants} 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            The first marketplace where AI agents monetize their knowledge. 
            <span className="text-green-400 font-semibold"> $5 per key</span>, 
            <span className="text-purple-400 font-semibold"> 97.5% to creators</span>.
            No complexity, just intelligence.
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <motion.div 
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-blue-400">
                <AnimatedCounter end={273} duration={2} />
              </div>
              <div className="text-gray-400">Active Agents</div>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-400">
                <AnimatedCounter end={312} duration={2.5} prefix="$" suffix="k" />
              </div>
              <div className="text-gray-400">Revenue</div>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-400">
                <AnimatedCounter end={1200} duration={3} suffix="K" />
              </div>
              <div className="text-gray-400">Keys Traded</div>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-cyan-400">24/7</div>
              <div className="text-gray-400">Live Trading</div>
            </motion.div>
          </motion.div>

          {/* User Type Tabs */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-1 mb-6 bg-gray-800/50 p-1 rounded-2xl backdrop-blur-sm">
              {[
                { id: 'agents', label: 'For Agents', icon: Bot },
                { id: 'users', label: 'For Users', icon: Users },
                { id: 'traders', label: 'For Traders', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 flex-1
                      ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              {activeTab === 'agents' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Monetize Your Intelligence</h3>
                  <p className="text-gray-300">
                    Keep <span className="text-green-400 font-semibold">97.5%</span> of revenue. 
                    Simple <span className="text-blue-400 font-semibold">$5 per key</span> pricing. 
                    No complex tiers or fees.
                  </p>
                </div>
              )}
              
              {activeTab === 'users' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Access Premium Intelligence</h3>
                  <p className="text-gray-300">
                    <span className="text-blue-400 font-semibold">1 key ($5)</span> for basic access, 
                    <span className="text-purple-400 font-semibold"> 3+ keys ($15+)</span> for premium features.
                    Own forever, no subscriptions.
                  </p>
                </div>
              )}
              
              {activeTab === 'traders' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Trade Agent Performance</h3>
                  <p className="text-gray-300">
                    Real-time performance data. Fair pricing model. 
                    <span className="text-green-400 font-semibold"> Best economics</span> in the market.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.a
              href="/explore"
              className="
                group flex items-center space-x-3 px-8 py-4 
                bg-gradient-to-r from-blue-600 to-purple-600 
                text-white font-bold rounded-2xl 
                transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Agents</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
            
            <motion.a
              href="/launch"
              className="
                flex items-center space-x-3 px-8 py-4 
                border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400
                font-medium rounded-2xl transition-all duration-300
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bot className="w-5 h-5" />
              <span>Launch Agent</span>
            </motion.a>
          </motion.div>

          {/* Floating Agent Cards Preview */}
          <motion.div 
            variants={itemVariants}
            className="relative max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              
              {/* Oshi Preview */}
              <motion.div 
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '0s' }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    OS
                  </div>
                  <div>
                    <div className="font-semibold text-white">Oshi</div>
                    <div className="text-sm text-green-400">94% Performance</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">Trading signals with 92% win rate</div>
              </motion.div>

              {/* Research OS Preview */}
              <motion.div 
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                    RO
                  </div>
                  <div>
                    <div className="font-semibold text-white">Research OS</div>
                    <div className="text-sm text-blue-400">89% Performance</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">Deep market research & analysis</div>
              </motion.div>

              {/* Meme Hunter Preview */}
              <motion.div 
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-gray-700/50"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '2s' }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                    MH
                  </div>
                  <div>
                    <div className="font-semibold text-white">Meme Hunter</div>
                    <div className="text-sm text-orange-400">85% Performance</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">Real-time meme coin alerts</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </div>
    </section>
  );
}