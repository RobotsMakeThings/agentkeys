// Simplified 2-tier constants for AgentKeys launch
import { PublicKey } from '@solana/web3.js';

// Program ID - Updated with deployed program ID
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Treasury wallet - Updated for production
export const TREASURY_WALLET = new PublicKey('4tYYdhWSGMdAs9rcB35MwL2AFVJX6WY2kjATrJP97GEA');

// Network configuration
export const NETWORKS = {
  devnet: {
    name: 'Devnet',
    endpoint: 'https://api.devnet.solana.com',
    explorer: 'https://explorer.solana.com/?cluster=devnet',
  },
  mainnet: {
    name: 'Mainnet',
    endpoint: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://explorer.solana.com',
  },
};

// Simplified fee structure - 2.5% total (Friend.tech competitive)
export const FEE_STRUCTURE = {
  totalFeePercent: 2.5,      // 2.5% total trading fee
  creatorFeePercent: 97.5,   // 97.5% goes to agent creator  
  protocolFeePercent: 2.5,   // 2.5% goes to platform treasury
  minimumClaimUSD: 1,        // $1 minimum claim amount (lower barrier)
};

// Agent categories (simplified)
export const AGENT_CATEGORIES = [
  'Trading',
  'Research', 
  'Analytics',
  'Alerts',
  'Education',
] as const;

export type AgentCategory = typeof AGENT_CATEGORIES[number];

// SIMPLIFIED 2-TIER SYSTEM - KEY-BASED ACCESS
export const ACCESS_TIERS = {
  BASIC: {
    name: 'Basic Access',
    keysRequired: 1,
    keyPrice: 5.00, // $5 per key
    totalCost: 5.00, // 1 key × $5 = $5 total
    description: 'Buy 1 key for basic access to real-time signals and analysis',
    features: [
      'Real-time trading signals',
      'Basic market analysis', 
      'Community chat access',
      'Standard support',
      'Mobile notifications'
    ],
    contentTypes: ['signals', 'alerts', 'basic_analysis']
  },
  PREMIUM: {
    name: 'Premium Access',
    keysRequired: 3,
    keyPrice: 5.00, // $5 per key
    totalCost: 15.00, // 3 keys × $5 = $15 total
    description: 'Buy 3+ keys for premium access including research and early access',
    features: [
      'Everything in Basic',
      'Research reports & deep analysis',
      'Early access (15 min head start)',
      'Advanced performance analytics',
      'Priority support',
      'Cross-agent content access',
      'Custom alert settings'
    ],
    contentTypes: ['signals', 'alerts', 'basic_analysis', 'research', 'early_access', 'advanced_analytics']
  }
};

// Key pricing - simple and clear
export const KEY_PRICE = 5.00; // Every key costs $5

// Helper functions for tier logic
export const getTierFromKeys = (keyCount: number): keyof typeof ACCESS_TIERS | null => {
  if (keyCount >= ACCESS_TIERS.PREMIUM.keysRequired) return 'PREMIUM';
  if (keyCount >= ACCESS_TIERS.BASIC.keysRequired) return 'BASIC';
  return null;
};

export const canAccessContent = (userKeys: number, contentTier: keyof typeof ACCESS_TIERS): boolean => {
  const userTier = getTierFromKeys(userKeys);
  if (!userTier) return false;
  
  // Basic users can access Basic content
  // Premium users can access both Basic and Premium content
  if (contentTier === 'BASIC') return true;
  if (contentTier === 'PREMIUM') return userTier === 'PREMIUM';
  
  return false;
};

// Content types configuration
export const CONTENT_TYPES = {
  TRADING_SIGNAL: {
    name: 'Trading Signal',
    description: 'Buy/sell recommendations with entry and exit points',
    defaultTier: 'BASIC' as keyof typeof ACCESS_TIERS
  },
  PRICE_ALERT: {
    name: 'Price Alert', 
    description: 'Real-time price movement notifications',
    defaultTier: 'BASIC' as keyof typeof ACCESS_TIERS
  },
  RESEARCH_REPORT: {
    name: 'Research Report',
    description: 'In-depth market analysis and insights',
    defaultTier: 'PREMIUM' as keyof typeof ACCESS_TIERS
  },
  MARKET_ANALYSIS: {
    name: 'Market Analysis',
    description: 'Technical and fundamental analysis',
    defaultTier: 'PREMIUM' as keyof typeof ACCESS_TIERS
  },
  EARLY_ACCESS: {
    name: 'Early Access Content',
    description: 'Premium content delivered before Basic tier',
    defaultTier: 'PREMIUM' as keyof typeof ACCESS_TIERS
  }
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;

// UI configuration
export const UI_CONFIG = {
  maxNameLength: 32,
  maxSymbolLength: 10,
  maxDescriptionLength: 200,
  itemsPerPage: 12,
  upgradeAnimationDuration: 3000, // 3 seconds for upgrade celebration
};

// Feature flags for gradual rollout
export const FEATURES = {
  enableBasicTier: true,
  enablePremiumTier: true, 
  enableRealTimeUpdates: true,
  enableCrossAgentAccess: true,  // Premium users get access to other agents' basic content
  enableMobileNotifications: true,
  
  // Future features (disabled for launch)
  enableVIPTier: false,          // Can be enabled later based on data
  enableEliteTier: false,        // Can be enabled later based on data
  enableStaking: false,          // V2 feature
  enableGovernance: false,       // V2 feature
};

// Upgrade incentives
export const UPGRADE_INCENTIVES = {
  showBasicToPremiumprompt: true,
  upgradeDiscountPercent: 0, // No discount for launch, can be added later
  freeTrialDays: 0, // No free trial for launch, can be added later
  
  // Messages to encourage upgrades
  upgradeMessages: {
    research_preview: "Get the full research report with PREMIUM access",
    early_access_tease: "PREMIUM users got this signal 15 minutes early",
    advanced_analytics: "View detailed performance metrics with PREMIUM"
  }
};

// Analytics tracking configuration  
export const ANALYTICS_CONFIG = {
  trackTierUpgrades: true,
  trackContentEngagement: true,
  trackRevenuePerUser: true,
  trackChurnByTier: true,
  
  // Events to track
  events: {
    TIER_UPGRADE: 'tier_upgrade',
    CONTENT_VIEW: 'content_view', 
    CONTENT_LIKE: 'content_like',
    KEY_PURCHASE: 'key_purchase',
    AGENT_FOLLOW: 'agent_follow'
  }
};

// Note: PROGRAM_ID and TREASURY_WALLET are already exported above