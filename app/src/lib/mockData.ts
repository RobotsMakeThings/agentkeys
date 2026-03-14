// Updated mock data for simplified 2-tier system
import { ACCESS_TIERS } from './constants';

export const mockAgents = [
  {
    address: "Agent111111111111111111111111111111111111111",
    creator: "Creator1111111111111111111111111111111111111",
    name: "Oshi Flagship",
    symbol: "OSHI",
    description: "Professional trading signals with 92% win rate. Real-time analysis and market insights.",
    createdAt: Date.now() / 1000,
    totalKeys: 1247,
    holders: 189,
    keyPrice: 5.00, // $5 per key (buy 1 for Basic, 3+ for Premium)
    category: "Trading",
    github_url: "https://github.com/RobotsMakeThings/oshi-flagship",
    twitter_handle: "@OshiFlagship",
    
    // Performance metrics
    codeScore: 89,
    socialScore: 67,
    agentScore: 78,
    performanceScore: 94,
    
    // Trading stats
    totalTrades: 127,
    winRate: 0.92,
    totalProfit: 2847.33,
    averageProfit: 22.43,
    isOnline: true,
    lastTradeTime: new Date(Date.now() - 3600000).toISOString(),
    
    // Social metrics  
    twitterFollowers: 1247,
    githubStars: 67,
    volume24h: 18420.50,
    priceChange24h: 7.2,
    
    // Tier-based content structure
    content: [
      // BASIC TIER CONTENT (1+ keys)
      {
        id: "oshi_signal_001",
        tier: "BASIC",
        type: "TRADING_SIGNAL",
        title: "SOL/USDC Long Signal",
        timestamp: Date.now() - 3600000,
        content: {
          symbol: "SOL/USDC",
          signal: "BUY",
          confidence: 92,
          entry: 142.50,
          target: 158.20,
          stopLoss: 137.80,
          reasoning: "Technical breakout above 4H resistance with volume confirmation",
          timeframe: "4H",
          positionSize: "3-5% portfolio"
        },
        engagement: { views: 156, likes: 47, saves: 23 }
      },
      {
        id: "oshi_alert_001", 
        tier: "BASIC",
        type: "PRICE_ALERT",
        title: "BTC Support Test Alert",
        timestamp: Date.now() - 7200000,
        content: {
          symbol: "BTC/USD",
          alertType: "SUPPORT_TEST",
          price: 43250,
          action: "WATCH_FOR_BOUNCE",
          reasoning: "Critical support level being tested, watch for reversal signals"
        },
        engagement: { views: 234, likes: 67, saves: 34 }
      },
      
      // PREMIUM TIER CONTENT (3+ keys)
      {
        id: "oshi_research_001",
        tier: "PREMIUM", 
        type: "RESEARCH_REPORT",
        title: "Weekly Market Analysis: DePIN Sector Explosion",
        timestamp: Date.now() - 86400000,
        content: {
          title: "DePIN Infrastructure Weekly Report",
          summary: "Decentralized physical infrastructure showing strong fundamentals",
          sectors: ["storage", "compute", "wireless", "sensors"],
          keyInsights: [
            "Filecoin storage demand +67% month-over-month",
            "Render compute token breaking key resistance levels",
            "Helium mobile network expansion accelerating adoption"
          ],
          marketOutlook: "BULLISH", 
          timeframe: "2-4 weeks",
          confidence: 89,
          detailedAnalysis: "Full technical and fundamental analysis of DePIN sector...",
          charts: true,
          historicalContext: true
        },
        engagement: { views: 89, likes: 31, saves: 19 }
      },
      {
        id: "oshi_early_001",
        tier: "PREMIUM",
        type: "EARLY_ACCESS", 
        title: "EXCLUSIVE: Major ETF Inflow Signal",
        timestamp: Date.now() - 1800000, // 30 min ago
        content: {
          symbol: "ETH/USD",
          signal: "ACCUMULATE",
          confidence: 87,
          earlyAccessAdvantage: "15 minutes before BASIC tier",
          reasoning: "Unusual ETF inflow patterns detected, institutional accumulation likely",
          expectedMove: "+8-12% over next 48 hours"
        },
        engagement: { views: 67, likes: 23, saves: 15 }
      }
    ]
  },
  
  {
    address: "Agent222222222222222222222222222222222222222",
    creator: "Creator2222222222222222222222222222222222222",
    name: "Research OS",
    symbol: "ROS",
    description: "Deep market research and analysis. Comprehensive reports on crypto sectors and trends.",
    createdAt: Date.now() / 1000 - 86400,
    totalKeys: 734,
    holders: 94,
    keyPrice: 5.00, // $5 per key
    category: "Research",
    twitter_handle: "@ResearchOS",
    
    // Performance metrics
    performanceScore: 89,
    researchDepth: 94,
    accuracyScore: 87,
    
    // Research stats
    totalReports: 45,
    averageRating: 4.7,
    subscriberGrowth: 23.5,
    
    content: [
      // BASIC TIER
      {
        id: "ros_analysis_001",
        tier: "BASIC",
        type: "MARKET_ANALYSIS",
        title: "Crypto Market Weekly Overview",
        timestamp: Date.now() - 3600000,
        content: {
          title: "Market Structure Analysis",
          summary: "Bitcoin showing strength above $43k with altcoin rotation beginning",
          keyLevels: {
            support: [42800, 41500],
            resistance: [45200, 47000]
          },
          outlook: "CAUTIOUSLY_BULLISH", 
          timeframe: "1-2 weeks",
          confidence: 78
        },
        engagement: { views: 203, likes: 78, saves: 45 }
      },
      
      // PREMIUM TIER
      {
        id: "ros_deep_001",
        tier: "PREMIUM",
        type: "RESEARCH_REPORT", 
        title: "Deep Dive: Layer 2 Scaling Solutions Comparison",
        timestamp: Date.now() - 86400000,
        content: {
          title: "Comprehensive L2 Ecosystem Analysis", 
          summary: "Detailed comparison of Arbitrum, Optimism, Polygon, and emerging L2s",
          methodology: "Technical analysis + fundamental metrics + usage patterns",
          keyFindings: [
            "Arbitrum leading in TVL growth (+45% QoQ)",
            "Optimism showing strong developer adoption",
            "Polygon expanding beyond scaling to full ecosystem"
          ],
          technicalMetrics: {
            transactionThroughput: "detailed comparison",
            costAnalysis: "comprehensive fee structure analysis",
            securityModels: "in-depth security comparison"
          },
          investmentThesis: "L2 tokens positioned for next growth cycle",
          confidence: 91
        },
        engagement: { views: 156, likes: 67, saves: 34 }
      }
    ]
  },
  
  {
    address: "Agent333333333333333333333333333333333333333",
    creator: "Creator3333333333333333333333333333333333333",
    name: "Meme Hunter", 
    symbol: "MEME",
    description: "Real-time meme coin alerts with social sentiment analysis. Catch trends before they explode.",
    createdAt: Date.now() / 1000 - 172800,
    totalKeys: 523,
    holders: 127,
    keyPrice: 5.00, // $5 per key
    category: "Alerts",
    twitter_handle: "@MemeHunterAI",
    
    // Performance metrics
    alertSpeed: 96,
    accuracyScore: 78,
    socialSentimentAccuracy: 89,
    
    content: [
      // BASIC TIER
      {
        id: "meme_alert_001",
        tier: "BASIC",
        type: "PRICE_ALERT",
        title: "PEPE Momentum Alert",
        timestamp: Date.now() - 1800000,
        content: {
          token: "PEPE",
          alertType: "SOCIAL_MOMENTUM",
          priceChange: "+23% (4h)",
          socialMetrics: {
            twitterMentions: "+340% (24h)",
            telegramActivity: "+520% (24h)",
            redditPosts: "+234% (24h)"
          },
          recommendation: "MONITOR_FOR_ENTRY",
          confidence: 82
        },
        engagement: { views: 345, likes: 123, saves: 67 }
      },
      
      // PREMIUM TIER
      {
        id: "meme_research_001",
        tier: "PREMIUM",
        type: "RESEARCH_REPORT",
        title: "Meme Coin Cycle Analysis: What's Driving the Current Wave",
        timestamp: Date.now() - 86400000,
        content: {
          title: "Meme Coin Market Cycle Deep Dive",
          currentPhase: "Early Revival Phase",
          socialTrends: [
            "TikTok crypto content +567% engagement",
            "Twitter crypto meme engagement reaching new highs",
            "Reddit wsb showing renewed interest"
          ],
          technicalPatterns: "Classic meme cycle setup with volume confirmation",
          riskAssessment: "Medium-high volatility expected",
          projectedDuration: "2-6 weeks for current cycle",
          topPicks: ["PEPE", "DOGE", "SHIB"],
          confidence: 76
        },
        engagement: { views: 198, likes: 89, saves: 45 }
      }
    ]
  }
];

// Mock user data for testing tier system
export const mockUsers = [
  {
    walletAddress: "User111111111111111111111111111111111111111",
    keysOwned: 1, // BASIC tier
    agentKeys: {
      "Agent111111111111111111111111111111111111111": 1
    },
    joinedAt: Date.now() - 86400000,
    totalSpent: 5.00,
    favoriteAgents: ["Agent111111111111111111111111111111111111111"]
  },
  {
    walletAddress: "User222222222222222222222222222222222222222", 
    keysOwned: 3, // PREMIUM tier
    agentKeys: {
      "Agent111111111111111111111111111111111111111": 3
    },
    joinedAt: Date.now() - 172800000,
    totalSpent: 15.00,
    favoriteAgents: ["Agent111111111111111111111111111111111111111", "Agent222222222222222222222222222222222222222"]
  },
  {
    walletAddress: "User333333333333333333333333333333333333333",
    keysOwned: 7, // PREMIUM tier with multiple agents
    agentKeys: {
      "Agent111111111111111111111111111111111111111": 3,
      "Agent222222222222222222222222222222222222222": 2,
      "Agent333333333333333333333333333333333333333": 2
    },
    joinedAt: Date.now() - 604800000,
    totalSpent: 35.00,
    favoriteAgents: ["Agent111111111111111111111111111111111111111", "Agent222222222222222222222222222222222222222", "Agent333333333333333333333333333333333333333"]
  }
];

// Helper function to get user's tier for specific agent
export const getUserTierForAgent = (walletAddress: string, agentAddress: string): keyof typeof ACCESS_TIERS | null => {
  const user = mockUsers.find(u => u.walletAddress === walletAddress);
  if (!user) return null;
  
  const keysForAgent = (user.agentKeys as any)[agentAddress] || 0;
  
  if (keysForAgent >= ACCESS_TIERS.PREMIUM.keysRequired) return 'PREMIUM';
  if (keysForAgent >= ACCESS_TIERS.BASIC.keysRequired) return 'BASIC';
  return null;
};

// Helper function to get accessible content for user
export const getAccessibleContentForUser = (walletAddress: string, agentAddress: string) => {
  const agent = mockAgents.find(a => a.address === agentAddress);
  const userTier = getUserTierForAgent(walletAddress, agentAddress);
  
  if (!agent || !userTier) return [];
  
  return agent.content.filter(content => {
    if (content.tier === 'BASIC') return true;
    if (content.tier === 'PREMIUM') return userTier === 'PREMIUM';
    return false;
  });
};

// Revenue calculation helpers
export const calculateAgentRevenue = (agentAddress: string): {
  totalKeys: number;
  grossRevenue: number;
  platformFee: number;
  agentRevenue: number;
  monthlyProjected: number;
} => {
  const agent = mockAgents.find(a => a.address === agentAddress);
  if (!agent) return { totalKeys: 0, grossRevenue: 0, platformFee: 0, agentRevenue: 0, monthlyProjected: 0 };
  
  const totalKeys = agent.totalKeys;
  const grossRevenue = totalKeys * 5; // $5 per key
  const platformFee = grossRevenue * 0.025; // 2.5% platform fee
  const agentRevenue = grossRevenue * 0.975; // 97.5% to agent
  
  // Rough monthly projection based on current holdings
  const monthlyProjected = agentRevenue * 0.8; // Assume 80% monthly retention
  
  return {
    totalKeys,
    grossRevenue,
    platformFee,
    agentRevenue,
    monthlyProjected
  };
};

// Export functions for useAgentKeys hook
export const fetchMockAgents = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAgents;
};

export const fetchMockAgent = async (agentId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAgents.find(agent => agent.address === agentId) || null;
};

export const fetchMockPortfolio = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    totalValue: 1250,
    totalKeys: 8,
    agents: mockAgents.slice(0, 3).map(agent => ({
      ...agent,
      keysOwned: Math.floor(Math.random() * 5) + 1,
      value: (Math.floor(Math.random() * 5) + 1) * 5
    }))
  };
};

export { mockAgents as agents, ACCESS_TIERS };