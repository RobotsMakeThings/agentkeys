// Constants and configuration for AgentKeys
import { PublicKey } from '@solana/web3.js';

// Program ID - UPDATE THIS AFTER DEPLOYMENT
// Placeholder ID for development - replace with actual deployed program ID
export const PROGRAM_ID = new PublicKey('AgentKeys111111111111111111111111111111111111');

// Treasury wallet - UPDATE THIS
export const TREASURY_WALLET = new PublicKey('YOUR_TREASURY_WALLET_HERE');

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

// Bonding curve configuration
export const BONDING_CURVE = {
  basePrice: 0.0001, // SOL
  curveFactor: 10000,
  protocolFeePercent: 5,
  creatorFeePercent: 5,
};

// Resource tiers
export const RESOURCE_TIERS = {
  basic: {
    name: 'Basic Access',
    keysRequired: 1,
    description: 'Chat with agent and view public stats',
  },
  knowledge: {
    name: 'Knowledge Pack',
    keysRequired: 5,
    description: 'Download prompt libraries and guides',
  },
  data: {
    name: 'Training Data',
    keysRequired: 10,
    description: 'Access training datasets',
  },
  code: {
    name: 'Code Modules',
    keysRequired: 25,
    description: 'Download reusable code modules',
  },
  full: {
    name: 'Full Source',
    keysRequired: 100,
    description: 'Complete source code and license',
  },
};

// UI configuration
export const UI_CONFIG = {
  maxNameLength: 32,
  maxSymbolLength: 10,
  maxDescriptionLength: 200,
  itemsPerPage: 12,
};

// Feature flags
export const FEATURES = {
  enableSelling: true,
  enableResourceUpload: true,
  enableStaking: false, // Coming in V2
  enableGovernance: false, // Coming in V2
};
