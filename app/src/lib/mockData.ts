// Mock data for development - replace with actual contract calls when deployed
export const mockAgents = [
  {
    address: "Agent111111111111111111111111111111111111111",
    creator: "Creator1111111111111111111111111111111111111",
    name: "Oshi",
    symbol: "OSHI",
    description: "Kalshi 15-minute BTC prediction specialist with proven 68% win rate",
    createdAt: Date.now() / 1000,
    totalKeys: 967,
    holders: 142,
    price: 4.23,
    category: "Trading",
    github_url: "https://github.com/RobotsMakeThings/kalshi-t1-t2-strategy",
    twitter_handle: "@PredictwithOshi",
    // Real capability scores
    codeScore: 89,
    socialScore: 67,
    agentScore: 78,
    performanceScore: 94,
    // Trading stats
    totalTrades: 127,
    winRate: 0.68,
    totalProfit: 2847.33,
    averageProfit: 22.43,
    isOnline: true,
    lastTradeTime: new Date(Date.now() - 3600000).toISOString(),
    // Social metrics
    twitterFollowers: 1247,
    githubStars: 67,
    volume24h: 18420.50,
    priceChange24h: 7.2
  },
  {
    address: "Agent222222222222222222222222222222222222222",
    creator: "Creator2222222222222222222222222222222222222",
    name: "TradePilot",
    symbol: "TRADE",
    description: "Executes strategy workflows, monitors markets, and manages risk primitives.",
    createdAt: Date.now() / 1000 - 86400,
    totalKeys: 842,
    holders: 89,
    price: 4.83,
  },
  {
    address: "Agent333333333333333333333333333333333333333",
    creator: "Creator3333333333333333333333333333333333333",
    name: "GrowthLoop",
    symbol: "GROW",
    description: "Runs outbound content, experiments, and conversion-optimized campaign loops.",
    createdAt: Date.now() / 1000 - 172800,
    totalKeys: 2310,
    holders: 234,
    price: 1.16,
  },
  {
    address: "Agent444444444444444444444444444444444444444",
    creator: "Creator4444444444444444444444444444444444444",
    name: "AuditMesh",
    symbol: "AUDIT",
    description: "Contract review, threat surfacing, simulation testing, and policy enforcement.",
    createdAt: Date.now() / 1000 - 259200,
    totalKeys: 502,
    holders: 67,
    price: 5.21,
  },
];

export const mockPortfolio = [
  { agentAddress: "Agent111111111111111111111111111111111111111", keys: 24, value: 57.8 },
  { agentAddress: "Agent222222222222222222222222222222222222222", keys: 9, value: 43.5 },
  { agentAddress: "Agent333333333333333333333333333333333333333", keys: 88, value: 102.1 },
];

// Helper to simulate contract calls
export async function fetchMockAgents() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAgents;
}

export async function fetchMockAgent(address: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAgents.find(a => a.address === address) || null;
}

export async function fetchMockPortfolio() {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockPortfolio;
}
