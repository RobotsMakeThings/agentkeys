// Contract interaction hooks for AgentKeys
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useEffect, useState, useCallback } from 'react';
import { PROGRAM_ID } from '@/lib/constants';
import { fetchMockAgents, fetchMockAgent, fetchMockPortfolio } from '@/lib/mockData';

// Check if using placeholder (development mode)
const isDevelopment = PROGRAM_ID.toString() === 'AgentKeys111111111111111111111111111111111111';

const TREASURY = new web3.PublicKey('4tYYdhWSGMdAs9rcB35MwL2AFVJX6WY2kjATrJP97GEA');

// Load IDL
const IDL = require('../idl/agentkeys.json');

export function useAgentKeys() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [program, setProgram] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!anchorWallet) {
      setProgram(null);
      return;
    }

    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      AnchorProvider.defaultOptions()
    );

    const program = new Program(IDL, PROGRAM_ID, provider);
    setProgram(program);
  }, [anchorWallet, connection]);

  // Friend.tech style bonding curve pricing
  const calculatePrice = useCallback((supply: number, amount: number) => {
    const sum1 = supply === 0 ? 0 : (supply - 1) * supply * (2 * supply - 1) / 6;
    const sum2 = supply + amount === 0 ? 0 : (supply + amount - 1) * (supply + amount) * (2 * (supply + amount) - 1) / 6;
    const summation = sum2 - sum1;
    // Price in lamports (scaled for SOL)
    return Math.floor(summation * 1000000 / 16000);
  }, []);

  const getBuyPrice = useCallback((supply: number, amount: number) => {
    return calculatePrice(supply, amount);
  }, [calculatePrice]);

  const getSellPrice = useCallback((supply: number, amount: number) => {
    return calculatePrice(Math.max(0, supply - amount), amount);
  }, [calculatePrice]);

  // Create new agent
  const createAgent = useCallback(async (name: string, symbol: string, description: string) => {
    if (!program || !anchorWallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const [agentPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), anchorWallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .createAgent(name, symbol, description)
        .accounts({
          creator: anchorWallet.publicKey,
          agent: agentPDA,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return { success: true, tx, agentPDA: agentPDA.toString() };
    } catch (error: any) {
      console.error('Create agent error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, anchorWallet]);

  // Buy keys for an agent
  const buyKeys = useCallback(async (agentAddress: string, amount: number) => {
    if (!program || !anchorWallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      
      // Get agent data to calculate price
      const agentData = await program.account.agent.fetch(agentPublicKey);
      const totalCost = getBuyPrice(agentData.totalKeys.toNumber(), amount);
      const totalFee = Math.floor(totalCost * 3 / 100); // 3% total fee

      const tx = await program.methods
        .buyKeys(new BN(amount))
        .accounts({
          buyer: anchorWallet.publicKey,
          agent: agentPublicKey,
          creator: agentData.creator,
          treasury: TREASURY,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          associatedTokenProgram: new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        })
        .rpc();

      return { success: true, tx, cost: totalCost + totalFee };
    } catch (error: any) {
      console.error('Buy keys error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, anchorWallet, calculatePrice]);

  // Sell keys
  const sellKeys = useCallback(async (agentAddress: string, amount: number) => {
    if (!program || !anchorWallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      const agentData = await program.account.agent.fetch(agentPublicKey);

      const tx = await program.methods
        .sellKeys(new BN(amount))
        .accounts({
          seller: anchorWallet.publicKey,
          agent: agentPublicKey,
          creator: agentData.creator,
          tokenProgram: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx };
    } catch (error: any) {
      console.error('Sell keys error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, anchorWallet]);

  // Fetch all agents
  const fetchAgents = useCallback(async () => {
    if (isDevelopment) {
      return fetchMockAgents();
    }
    
    if (!program) return [];

    try {
      const agents = await program.account.agent.all();
      return agents.map((agent: any) => ({
        address: agent.publicKey.toString(),
        creator: agent.account.creator.toString(),
        name: agent.account.name,
        symbol: agent.account.symbol,
        description: agent.account.description,
        createdAt: agent.account.createdAt.toNumber() * 1000,
        totalKeys: agent.account.totalKeys.toNumber(),
        holders: agent.account.holders.toNumber(),
        price: getBuyPrice(agent.account.totalKeys.toNumber(), 1) / web3.LAMPORTS_PER_SOL,
      }));
    } catch (error) {
      console.error('Fetch agents error:', error);
      return [];
    }
  }, [program, calculatePrice]);

  // Fetch single agent
  const fetchAgent = useCallback(async (agentAddress: string) => {
    if (isDevelopment) {
      return fetchMockAgent(agentAddress);
    }
    
    if (!program) return null;

    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      const agent = await program.account.agent.fetch(agentPublicKey);

      return {
        address: agentAddress,
        creator: agent.creator.toString(),
        name: agent.name,
        symbol: agent.symbol,
        description: agent.description,
        createdAt: agent.createdAt.toNumber() * 1000,
        totalKeys: agent.totalKeys.toNumber(),
        holders: agent.holders.toNumber(),
        price: getBuyPrice(agent.totalKeys.toNumber(), 1) / web3.LAMPORTS_PER_SOL,
      };
    } catch (error) {
      console.error('Fetch agent error:', error);
      return null;
    }
  }, [program, calculatePrice]);

  // Claim accumulated fees
  const claimFees = useCallback(async (agentAddress: string) => {
    if (!program || !anchorWallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      
      const [agentFeesAddress] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('agent_fees'), agentPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const [feeVaultAddress] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('fee_vault'), agentPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .claimFees()
        .accounts({
          creator: anchorWallet.publicKey,
          agentFees: agentFeesAddress,
          feeVault: feeVaultAddress,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx };
    } catch (error: any) {
      console.error('Claim fees error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, anchorWallet]);

  // Fetch agent fee information
  const fetchAgentFees = useCallback(async (agentAddress: string) => {
    if (isDevelopment) {
      // Return mock data for development
      return {
        totalFees: 127500000, // 0.1275 SOL in lamports
        claimableFees: 12500000, // 0.0125 SOL in lamports  
        totalClaimed: 115000000, // 0.115 SOL in lamports
        lastClaimedAt: Date.now() - 86400000, // 1 day ago
      };
    }
    
    if (!program) return null;

    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      const [agentFeesAddress] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('agent_fees'), agentPublicKey.toBuffer()],
        PROGRAM_ID
      );

      const agentFees = await program.account.agentFees.fetch(agentFeesAddress);
      
      return {
        totalFees: agentFees.totalFees.toNumber(),
        claimableFees: agentFees.claimableFees.toNumber(), 
        totalClaimed: agentFees.totalClaimed.toNumber(),
        lastClaimedAt: agentFees.lastClaimedAt.toNumber() * 1000, // Convert to milliseconds
      };
    } catch (error) {
      console.error('Fetch agent fees error:', error);
      return null;
    }
  }, [program]);

  return {
    program,
    isLoading,
    createAgent,
    buyKeys,
    sellKeys,
    fetchAgents,
    fetchAgent,
    claimFees,
    fetchAgentFees,
    getBuyPrice,
    getSellPrice,
    calculatePrice,
  };
}

// Hook for user portfolio
export function usePortfolio() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [holdings, setHoldings] = useState<any[]>([]);

  useEffect(() => {
    if (!publicKey) {
      setHoldings([]);
      return;
    }

    const fetchHoldings = async () => {
      try {
        // Get all token accounts for user
        const accounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        );

        // Filter for agent key tokens
        const agentHoldings = accounts.value
          .filter((acc: any) => acc.account.data.parsed.info.tokenAmount.uiAmount > 0)
          .map((acc: any) => ({
            mint: acc.account.data.parsed.info.mint,
            balance: acc.account.data.parsed.info.tokenAmount.uiAmount,
          }));

        setHoldings(agentHoldings);
      } catch (error) {
        console.error('Fetch holdings error:', error);
      }
    };

    fetchHoldings();
  }, [publicKey, connection]);

  return { holdings };
}
