import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com');

/**
 * Check if a user has access to a resource based on their key holdings
 */
export async function checkResourceAccess(
  userAddress: string,
  agentAddress: string,
  requiredKeys: number
): Promise<boolean> {
  try {
    const userPublicKey = new PublicKey(userAddress);
    const agentPublicKey = new PublicKey(agentAddress);

    // Get all token accounts for user
    const accounts = await connection.getParsedTokenAccountsByOwner(
      userPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    // Find agent's key token (this is simplified - in production you'd track mint addresses)
    // For now, we'll check if user has any tokens from this agent
    const keyBalance = accounts.value
      .filter((acc) => {
        const mint = acc.account.data.parsed.info.mint;
        // In production, you'd check if this mint belongs to the agent
        return true; // Simplified
      })
      .reduce((sum, acc) => {
        return sum + (acc.account.data.parsed.info.tokenAmount.uiAmount || 0);
      }, 0);

    return keyBalance >= requiredKeys;
  } catch (error) {
    console.error('Check access error:', error);
    return false;
  }
}

/**
 * Get user's key balance for a specific agent
 */
export async function getKeyBalance(
  userAddress: string,
  agentMintAddress: string
): Promise<number> {
  try {
    const userPublicKey = new PublicKey(userAddress);
    const mintPublicKey = new PublicKey(agentMintAddress);

    // Find associated token account
    const accounts = await connection.getParsedTokenAccountsByOwner(
      userPublicKey,
      { mint: mintPublicKey }
    );

    if (accounts.value.length === 0) {
      return 0;
    }

    return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
  } catch (error) {
    console.error('Get balance error:', error);
    return 0;
  }
}

/**
 * Calculate bonding curve price
 */
export function calculateBondingCurvePrice(supply: number): number {
  const base = Math.floor(supply / 100);
  const priceInLamports = base * base * 100000;
  return priceInLamports / 1e9; // Convert to SOL
}

/**
 * Format SOL amount for display
 */
export function formatSOL(lamports: number): string {
  const sol = lamports / 1e9;
  return sol.toFixed(4);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Calculate market cap
 */
export function calculateMarketCap(price: number, supply: number): number {
  return price * supply;
}

/**
 * Calculate price change percentage
 */
export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}
