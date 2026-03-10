// API Key management hooks for AgentKeys (Key-Based Access)
import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

export interface ApiKeyData {
  apiKey: string;
  agentId: string;
  agentName: string;
  capabilities: string[];
  keysHeld: number;
  dailyQuota: number;
  usedToday: number;
  remainingToday: number;
  isActive: boolean;
}

export interface QuotaInfo {
  daily: number;
  used: number;
  remaining: number;
}

export function useApiKeys() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's API keys
  const fetchApiKeys = useCallback(async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/my-keys`, {
        headers: {
          'X-Wallet-Address': publicKey.toString()
        }
      });

      if (!response.ok) throw new Error('Failed to fetch keys');
      
      const data = await response.json();
      setApiKeys(data.keys);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  // Generate API key after buying keys
  const generateApiKey = useCallback(async (
    agentId: string,
    txSignature: string,
    amount: number
  ): Promise<ApiKeyData | null> => {
    if (!publicKey) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/generate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          buyerWallet: publicKey.toString(),
          txSignature,
          amount
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate key');
      }

      const data = await response.json();
      
      const newKey: ApiKeyData = {
        apiKey: data.apiKey,
        agentId,
        agentName: data.agent.name,
        capabilities: data.agent.capabilities,
        keysHeld: amount,
        dailyQuota: data.dailyQuota,
        usedToday: 0,
        remainingToday: data.dailyQuota,
        isActive: true
      };

      setApiKeys(prev => [...prev, newKey]);
      return newKey;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  // Query agent using API key
  const queryAgent = useCallback(async (
    apiKey: string,
    query: string,
    context?: any
  ): Promise<{ data: any; quota: QuotaInfo } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ query, context })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Query failed');
      }

      const data = await response.json();
      
      // Update local quota
      setApiKeys(prev => prev.map(k => 
        k.apiKey === apiKey 
          ? { ...k, usedToday: data.quota.used, remainingToday: data.quota.remaining }
          : k
      ));

      return { data: data.data, quota: data.quota };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get API key status
  const getKeyStatus = useCallback(async (apiKey: string): Promise<Partial<ApiKeyData> | null> => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/key-status`, {
        headers: { 'X-API-Key': apiKey }
      });

      if (!response.ok) throw new Error('Failed to get status');
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  // Update keys held (after buying/selling)
  const updateKeysHeld = useCallback(async (
    agentId: string,
    newAmount: number
  ): Promise<boolean> => {
    if (!publicKey) return false;

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/update-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerWallet: publicKey.toString(),
          agentId,
          newAmount
        })
      });

      if (!response.ok) return false;

      const data = await response.json();
      
      setApiKeys(prev => prev.map(k => 
        k.agentId === agentId 
          ? { ...k, keysHeld: newAmount, dailyQuota: data.newQuota }
          : k
      ));

      return true;
    } catch {
      return false;
    }
  }, [publicKey]);

  // Copy API key to clipboard
  const copyApiKey = useCallback(async (apiKey: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(apiKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    generateApiKey,
    queryAgent,
    getKeyStatus,
    updateKeysHeld,
    copyApiKey
  };
}

// Hook for agent creators
export function useAgentRegistration() {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerAgent = useCallback(async (agentData: {
    agentId: string;
    name: string;
    symbol: string;
    apiEndpoint: string;
    capabilities: string[];
    queriesPerKey?: number;
    bonusTiers?: { minKeys: number; bonusPercent: number }[];
    webhookUrl?: string;
  }): Promise<boolean> => {
    if (!publicKey) {
      setError('Wallet not connected');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/register-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agentData,
          creatorWallet: publicKey.toString(),
          bonusTiers: agentData.bonusTiers?.map(t => ({
            min_keys: t.minKeys,
            bonus_percent: t.bonusPercent
          }))
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Registration failed');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  return { registerAgent, isLoading, error };
}

// Hook for agent stats
export function useAgentStats() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = useCallback(async (agentId: string) => {
    if (!publicKey) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/agent-stats/${agentId}`, {
        headers: { 'X-Creator-Wallet': publicKey.toString() }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  return { stats, isLoading, fetchStats };
}
