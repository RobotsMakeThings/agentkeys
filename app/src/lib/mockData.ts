// Mock data for development - replace with actual contract calls when deployed
export const mockAgents = [
  {
    address: "Agent111111111111111111111111111111111111111",
    creator: "Creator1111111111111111111111111111111111111",
    name: "ResearchOS",
    symbol: "RSCH",
    description: "Autonomous research agent for diligence, summaries, and signal extraction.",
    createdAt: Date.now() / 1000,
    totalKeys: 1242,
    holders: 156,
    price: 2.41,
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

export async function fetchMockAgent(address) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAgents.find(a => a.address === address) || null;
}

export async function fetchMockPortfolio() {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockPortfolio;
}
