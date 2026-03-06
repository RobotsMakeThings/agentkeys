'use client';

import React, { useState } from 'react';
import Navigation from '@/components/v2/Navigation';
import HeroSection from '@/components/v2/HeroSection';
import LiveMarketPreview from '@/components/v2/LiveMarketPreview';
import ActivityFeed from '@/components/ActivityFeed';
import { 
  Shield, 
  Zap, 
  Users, 
  TrendingUp,
  Brain,
  Bot,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';

export default function V2HomePage() {
  const [currentView, setCurrentView] = useState('landing');

  // Agent categories data
  const categories = [
    {
      name: 'Research & Analysis',
      icon: Brain,
      count: 47,
      description: 'Deep market research and data analysis agents',
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Trading & DeFi',
      icon: TrendingUp,
      count: 23,
      description: 'Automated trading strategies and DeFi optimization',
      color: 'from-green-500 to-blue-500'
    },
    {
      name: 'Security & Auditing',
      icon: Shield,
      count: 18,
      description: 'Smart contract audits and security analysis',
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Automation',
      icon: Zap,
      count: 34,
      description: 'Workflow automation and productivity tools',
      color: 'from-yellow-500 to-green-500'
    }
  ];

  // Why AgentKeys features
  const features = [
    {
      icon: Bot,
      title: 'Premium AI Access',
      description: 'Get exclusive access to the most advanced AI agents and their unique capabilities.'
    },
    {
      icon: TrendingUp,
      title: 'Trade Intelligence',
      description: 'Buy and sell access rights to AI agents as liquid assets on the blockchain.'
    },
    {
      icon: Users,
      title: 'Creator Economy',
      description: 'Creators earn fees from their AI agents while providing value to key holders.'
    },
    {
      icon: Shield,
      title: 'Secure & Verified',
      description: 'All agents are verified and run in secure, isolated environments.'
    }
  ];

  // Security & Trust features
  const trustFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All communications with agents are encrypted and private.'
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'Built on Solana for fast, secure, and transparent transactions.'
    },
    {
      icon: Star,
      title: 'Verified Agents',
      description: 'All agents undergo rigorous testing and verification processes.'
    }
  ];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navigation */}
      <Navigation currentPage="explore" />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Live Market Preview */}
      <LiveMarketPreview />
      
      {/* Why AgentKeys */}
      <section className="py-20 bg-panel">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-medium rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue" />
              <span className="text-small font-medium text-secondary">Why Choose AgentKeys</span>
            </div>
            
            <h2 className="text-section text-primary mb-6">
              The Future of AI Access
            </h2>
            <p className="text-body text-secondary max-w-3xl mx-auto">
              AgentKeys transforms how we interact with AI by making intelligence tradeable, 
              accessible, and valuable. Join the next evolution of the AI economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="card p-8 text-center group hover:border-blue transition-all animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-subheading font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body text-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agent Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-section text-primary mb-6">
              Explore Agent Categories
            </h2>
            <p className="text-body text-secondary max-w-2xl mx-auto">
              Discover specialized AI agents across different domains, 
              each offering unique capabilities and insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.name}
                  className="card p-6 cursor-pointer group hover:border-blue transition-all animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-body font-semibold text-primary mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-small text-secondary mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-small text-muted">
                      {category.count} agents
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activity Feed Section */}
      <section className="py-20 bg-panel">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-section text-primary mb-6">
              Live Market Activity
            </h2>
            <p className="text-body text-secondary max-w-2xl mx-auto">
              See real-time trading activity and community engagement across all agents.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ActivityFeed maxItems={8} showFilterControls={true} />
          </div>
        </div>
      </section>

      {/* Creator Economy */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-medium rounded-full mb-6">
                <Users className="w-4 h-4 text-blue" />
                <span className="text-small font-medium text-secondary">Creator Economy</span>
              </div>
              
              <h2 className="text-section text-primary mb-6">
                Monetize Your AI Agents
              </h2>
              
              <p className="text-body text-secondary mb-8">
                Create and deploy AI agents that generate revenue. Key holders pay for access 
                to your agent's capabilities while you earn fees from every transaction.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                  <span className="text-body text-secondary">Earn 2% on every key transaction</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                  <span className="text-body text-secondary">Keep 100% of premium content revenue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                  <span className="text-body text-secondary">Build a community around your AI</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="btn btn-primary">
                  Launch Your Agent
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="btn btn-secondary">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="card-elevated p-8">
                <div className="text-center mb-6">
                  <div className="text-small text-muted mb-2">Monthly Revenue</div>
                  <div className="text-section font-bold text-gradient">$12,847</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-small text-secondary">Key Sales</span>
                    <span className="text-small font-medium text-primary">$8,420</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-small text-secondary">Premium Access</span>
                    <span className="text-small font-medium text-primary">$3,127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-small text-secondary">Consultations</span>
                    <span className="text-small font-medium text-primary">$1,300</span>
                  </div>
                </div>
              </div>
              
              {/* Floating metrics */}
              <div className="absolute -top-4 -right-4 card p-4 animate-fadeIn">
                <div className="text-xs text-muted">Key Holders</div>
                <div className="text-body font-bold text-primary">1,847</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 card p-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="text-xs text-muted">Growth</div>
                <div className="text-body font-bold text-success">+34%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-20 bg-panel">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-section text-primary mb-6">
              Built for Security & Trust
            </h2>
            <p className="text-body text-secondary max-w-2xl mx-auto">
              Enterprise-grade security meets decentralized transparency. 
              Your data and transactions are always protected.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="text-center animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-subheading font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body text-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-section text-primary mb-6">
              Ready to Trade Intelligence?
            </h2>
            <p className="text-body text-secondary mb-12">
              Join thousands of users already accessing premium AI agents and 
              building the future of the intelligent economy.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <button className="btn btn-primary btn-lg">
                Explore Agents
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn btn-secondary btn-lg">
                Create Agent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle py-12 bg-panel">
        <div className="container">
          <div className="text-center text-small text-muted">
            <p>© 2024 AgentKeys. Building the AI agent economy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}