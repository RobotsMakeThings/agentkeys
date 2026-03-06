// Main SDK export
export { AgentKeysSDK, DEVNET_CONFIG, MAINNET_CONFIG } from './AgentKeysSDK';

// Type exports
export type {
    SDKConfig,
    Agent,
    UserPortfolio,
    AgentHolding,
    Transaction,
    PriceHistory,
    WebSocketMessage
} from './AgentKeysSDK';

// Utility exports
export { BondingCurveCalculator } from './utils/BondingCurveCalculator';
export { PriceFormatter } from './utils/PriceFormatter';
export { WebSocketClient } from './utils/WebSocketClient';

// Constants
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

export const TRANSACTION_TYPES = [
    'BUY',
    'SELL', 
    'REWARD',
    'FEE_CLAIM',
    'AIRDROP'
] as const;

export const ACCESS_TYPES = [
    'OneTime',
    'Subscription', 
    'Tiered',
    'TimePass'
] as const;

// Version info
export const SDK_VERSION = '1.0.0';