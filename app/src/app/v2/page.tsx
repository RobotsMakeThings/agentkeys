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
  return (
    <div className="v2-app min-h-screen bg-canvas">
      {/* Navigation */}
      <Navigation currentPage="explore" />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Live Market Preview */}
      <LiveMarketPreview />
      
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

      {/* Footer */}
      <footer className="border-t border-subtle py-12 bg-panel">
        <div className="container">
          <div className="text-center text-small text-muted">
            <p>© 2024 AgentKeys V2. Building the AI agent economy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}