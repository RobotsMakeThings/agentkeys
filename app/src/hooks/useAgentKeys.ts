// Contract interaction hooks for AgentKeys
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useEffect, useState, useCallback } from 'react';

const PROGRAM_ID = new web3.PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
const TREASURY = new web3.PublicKey('YOUR_TREASURY_WALLET_HERE');

// Load IDL
const IDL = require('../idl/agentkeys.json');

export function useAgentKeys() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!wallet.publicKey) {
      setProgram(null);
      return;
    }

    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );

    const program = new Program(IDL, PROGRAM_ID, provider);
    setProgram(program);
  }, [wallet.publicKey, connection]);

  // Calculate bonding curve price
  const calculatePrice = useCallback((supply) => {
    const base = Math.floor(supply / 100);
    return base * base * 100000; // in lamports
  }, []);

  // Create new agent
  const createAgent = useCallback(async (name, symbol, description) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const [agentPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .createAgent(name, symbol, description)
        .accounts({
          creator: wallet.publicKey,
          agent: agentPDA,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return { success: true, tx, agentPDA: agentPDA.toString() };
    } catch (error) {
      console.error('Create agent error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, wallet.publicKey]);

  // Buy keys for an agent
  const buyKeys = useCallback(async (agentAddress, amount) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      
      // Get agent data to calculate price
      const agentData = await program.account.agent.fetch(agentPublicKey);
      const pricePerKey = calculatePrice(agentData.totalKeys);
      const totalCost = pricePerKey * amount;
      const fee = Math.floor(totalCost / 20); // 5% fee

      const tx = await program.methods
        .buyKeys(new BN(amount))
        .accounts({
          buyer: wallet.publicKey,
          agent: agentPublicKey,
          creator: agentData.creator,
          treasury: TREASURY,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          associatedTokenProgram: new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        })
        .rpc();

      return { success: true, tx, cost: totalCost + fee };
    } catch (error) {
      console.error('Buy keys error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, wallet.publicKey, calculatePrice]);

  // Sell keys
  const sellKeys = useCallback(async (agentAddress, amount) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const agentPublicKey = new web3.PublicKey(agentAddress);
      const agentData = await program.account.agent.fetch(agentPublicKey);

      const tx = await program.methods
        .sellKeys(new BN(amount))
        .accounts({
          seller: wallet.publicKey,
          agent: agentPublicKey,
          creator: agentData.creator,
          tokenProgram: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('Sell keys error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [program, wallet.publicKey]);

  // Fetch all agents
  const fetchAgents = useCallback(async () => {
    if (isDevelopment) {
      return fetchMockAgents();
    }
    
    if (!program) return [];

    try {
      const agents = await program.account.agent.all();
      return agents.map((agent) => ({
        address: agent.publicKey.toString(),
        creator: agent.account.creator.toString(),
        name: agent.account.name,
        symbol: agent.account.symbol,
        description: agent.account.description,
        createdAt: agent.account.createdAt.toNumber() * 1000,
        totalKeys: agent.account.totalKeys.toNumber(),
        holders: agent.account.holders.toNumber(),
        price: calculatePrice(agent.account.totalKeys) / web3.LAMPORTS_PER_SOL,
      }));
    } catch (error) {
      console.error('Fetch agents error:', error);
      return [];
    }
  }, [program, calculatePrice]);

  // Fetch single agent
  const fetchAgent = useCallback(async (agentAddress) => {
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
        price: calculatePrice(agent.totalKeys) / web3.LAMPORTS_PER_SOL,
      };
    } catch (error) {
      console.error('Fetch agent error:', error);
      return null;
    }
  }, [program, calculatePrice]);

  return {
    program,
    isLoading,
    createAgent,
    buyKeys,
    sellKeys,
    fetchAgents,
    fetchAgent,
    calculatePrice,
  };
}

// Hook for user portfolio
export function usePortfolio() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [holdings, setHoldings] = useState([]);

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
          .filter((acc) => acc.account.data.parsed.info.tokenAmount.uiAmount > 0)
          .map((acc) => ({
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
