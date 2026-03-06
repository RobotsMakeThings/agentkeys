'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Zap, Users, DollarSign } from 'lucide-react';
import AgentCard from './AgentCard';

interface MarketAgent {
  id: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  change24h: number;
  holders: number;
  revenue: string;
  description: string;
  capabilities: string[];
  isVerified?: boolean;
  tasksExecuted?: number;
  chartData?: number[];
}

interface LiveMarketPreviewProps {
  className?: string;
}

export default function LiveMarketPreview({ className = '' }: LiveMarketPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [agents, setAgents] = useState<MarketAgent[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [marketStats, setMarketStats] = useState({
    totalVolume: '$2.4M',
    activeTraders: '1,247',
    avgReturn: '+34.2%',
    topGainer: 'ResearchOS'
  });

  // Mock data for live agents
  const mockAgents: MarketAgent[] = [
    {
      id: 'research-os',
      name: 'ResearchOS',
      symbol: 'RSCH',
      category: 'Research',
      price: 2.41,
      change24h: 18.4,
      holders: 1242,
      revenue: '$48.2k',
      description: 'Autonomous research agent for diligence and summaries.',
      capabilities: ['Research', 'Analysis', 'Reports'],
      isVerified: true,
      tasksExecuted: 156,
      chartData: Array.from({ length: 24 }, (_, i) => 50 + Math.sin(i * 0.3) * 20 + Math.random() * 10)
    },
    {
      id: 'trade-pilot',
      name: 'TradePilot',
      symbol: 'TRADE',
      category: 'Trading',
      price: 4.83,
      change24h: -2.1,
      holders: 842,
      revenue: '$71.8k',
      description: 'Executes strategy workflows and monitors markets.',
      capabilities: ['Trading', 'Monitoring', 'Alerts'],
      isVerified: true,
      tasksExecuted: 203,
      chartData: Array.from({ length: 24 }, (_, i) => 60 - Math.cos(i * 0.2) * 15 + Math.random() * 8)
    },
    {
      id: 'growth-loop',
      name: 'GrowthLoop',
      symbol: 'GROW',
      category: 'Marketing',
      price: 1.16,
      change24h: 24.7,
      holders: 2310,
      revenue: '$39.5k',
      description: 'Runs outbound content and campaign loops.',
      capabilities: ['Content', 'Campaigns', 'Analytics'],
      isVerified: false,
      tasksExecuted: 89,
      chartData: Array.from({ length: 24 }, (_, i) => 30 + Math.sin(i * 0.4) * 25 + Math.random() * 12)
    },
    {
      id: 'audit-mesh',
      name: 'AuditMesh',
      symbol: 'AUDIT',
      category: 'Security',
      price: 5.21,
      change24h: 6.8,
      holders: 502,
      revenue: '$96.3k',
      description: 'Contract review and threat surfacing.',
      capabilities: ['Security', 'Auditing', 'Analysis'],
      isVerified: true,
      tasksExecuted: 78,
      chartData: Array.from({ length: 24 }, (_, i) => 80 + Math.cos(i * 0.1) * 10 + Math.random() * 5)
    },
    {
      id: 'data-forge',
      name: 'DataForge',
      symbol: 'DATA',
      category: 'Analytics',
      price: 3.27,
      change24h: 12.3,
      holders: 654,
      revenue: '$52.1k',
      description: 'Advanced data processing and insights.',
      capabilities: ['Analytics', 'Processing', 'Insights'],
      isVerified: true,
      tasksExecuted: 134,
      chartData: Array.from({ length: 24 }, (_, i) => 45 + Math.sin(i * 0.5) * 18 + Math.random() * 7)
    },
    {
      id: 'content-ai',
      name: 'ContentAI',
      symbol: 'CONT',
      category: 'Content',
      price: 0.89,
      change24h: -8.4,
      holders: 1876,
      revenue: '$28.7k',
      description: 'Creative content generation and optimization.',
      capabilities: ['Writing', 'Generation', 'SEO'],
      isVerified: false,
      tasksExecuted: 245,
      chartData: Array.from({ length: 24 }, (_, i) => 25 + Math.cos(i * 0.3) * 12 + Math.random() * 6)
    }
  ];

  // Initialize agents
  useEffect(() => {
    setAgents(mockAgents);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !scrollRef.current) return;

    const scroll = scrollRef.current;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollSpeed = 50;

    const autoScroll = () => {
      if (scroll) {
        scrollAmount += scrollStep;
        scroll.scrollLeft = scrollAmount;
        
        // Reset scroll when reaching end
        if (scrollAmount >= scroll.scrollWidth - scroll.clientWidth) {
          scrollAmount = 0;
        }
      }
    };

    const interval = setInterval(autoScroll, scrollSpeed);
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          price: agent.price + (Math.random() - 0.5) * 0.02,
          change24h: agent.change24h + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleScrollStart = () => {
    setIsAutoScrolling(false);
  };

  const handleScrollEnd = () => {
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-medium rounded-full mb-6">
            <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
            <span className="text-small font-medium text-secondary">Live Market</span>
            <Zap className="w-4 h-4 text-blue" />
          </div>
          
          <h2 className="text-section text-primary mb-4">
            Real-time Agent Trading
          </h2>
          <p className="text-body text-secondary max-w-2xl mx-auto">
            Watch live trading activity as intelligence becomes liquid. 
            Prices update in real-time as the market discovers value.
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-small text-muted mb-1">Total Volume</div>
            <div className="text-subheading font-bold text-primary">{marketStats.totalVolume}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-small text-muted mb-1">Active Traders</div>
            <div className="text-subheading font-bold text-primary">{marketStats.activeTraders}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-small text-muted mb-1">Avg Return</div>
            <div className="text-subheading font-bold text-success">{marketStats.avgReturn}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-small text-muted mb-1">Top Gainer</div>
            <div className="text-subheading font-bold text-blue">{marketStats.topGainer}</div>
          </div>
        </div>

        {/* Live Trading Cards */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            onMouseEnter={handleScrollStart}
            onMouseLeave={handleScrollEnd}
            onTouchStart={handleScrollStart}
            onTouchEnd={handleScrollEnd}
          >
            {/* Render agents twice for seamless scrolling */}
            {[...agents, ...agents].map((agent, index) => (
              <div key={`${agent.id}-${index}`} className="flex-shrink-0">
                <AgentCard 
                  agent={agent}
                  showChart={true}
                  priority={index < 2 ? 'high' : 'medium'}
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-canvas to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-canvas to-transparent pointer-events-none" />
        </div>

        {/* Market Ticker */}
        <div className="mt-8 glass p-4 rounded-lg">
          <div className="flex items-center justify-between text-small">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
                <span className="text-muted">Market Open</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-success font-medium">+12.4% today</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-muted">
              <div>Last Update: {new Date().toLocaleTimeString()}</div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2,431 online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hide scrollbar utility
const scrollbarStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}