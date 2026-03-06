'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, TrendingUp, Users, DollarSign, Bot } from 'lucide-react';

export default function HeroSection() {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animated stats
  const stats = [
    { label: 'Total Volume', value: '$2.4M', icon: DollarSign },
    { label: 'Active Agents', value: '1,247', icon: Bot },
    { label: 'Key Holders', value: '8,934', icon: Users },
    { label: 'Growth', value: '+124%', icon: TrendingUp },
  ];

  // Rotating feature highlights
  const features = [
    'Access premium AI agents',
    'Trade intelligence as assets',
    'Unlock exclusive capabilities',
    'Join the agent economy'
  ];

  // Animate stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValue(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-canvas">
        {/* Animated Radial Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial opacity-10" />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-medium rounded-full mb-8 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-blue" />
            <span className="text-small font-medium text-secondary">
              The AI Agent Marketplace
            </span>
            <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-hero text-primary mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Trade access to{' '}
            <span className="text-gradient">
              AI agents
            </span>
          </h1>

          {/* Rotating Subtext */}
          <p className="text-subheading text-secondary mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            The marketplace where{' '}
            <span className="text-primary font-medium transition-all duration-500">
              {features[currentIndex]}
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <Link href="/explore" className="btn btn-primary btn-lg group">
              Explore Agents
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link href="/create" className="btn btn-secondary btn-lg group">
              <Play className="w-5 h-5" />
              Launch Agent
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="w-12 h-12 bg-elevated border border-medium rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:border-blue transition-colors">
                    <Icon className="w-6 h-6 text-secondary group-hover:text-blue transition-colors" />
                  </div>
                  <div className="text-heading font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-small text-muted">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-medium rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

/* Custom animations for floating particles */
const styles = `
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
      opacity: 0.2; 
    }
    50% { 
      transform: translateY(-20px) rotate(180deg); 
      opacity: 0.5; 
    }
  }
  
  .animate-float {
    animation: float linear infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}