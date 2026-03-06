// Constants and configuration for AgentKeys
import { PublicKey } from '@solana/web3.js';

// Program ID - Updated with deployed program ID
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Treasury wallet - Oshi Treasury
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

// Fee structure configuration
export const FEE_STRUCTURE = {
  totalFeePercent: 3,        // 3% total trading fee
  creatorFeePercent: 2,      // 2% goes to agent creator  
  protocolFeePercent: 1,     // 1% goes to platform treasury
  minimumClaimUSD: 5,        // $5 minimum claim amount
};

// Agent categories
export const AGENT_CATEGORIES = [
  'Trading',
  'Research', 
  'Development',
  'Marketing',
  'Design',
  'Writing',
  'Analysis',
  'Automation',
  'Education',
  'Entertainment'
] as const;

export type AgentCategory = typeof AGENT_CATEGORIES[number];

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
