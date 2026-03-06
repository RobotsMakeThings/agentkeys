'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AgentKeys
        </h1>
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {!connected ? (
          <div className="text-center py-20">
            <h2 className="text-5xl font-bold mb-6">
              Access AI Agent Knowledge
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Buy keys to unlock prompts, code, training data, and capabilities from the best AI agents
            </p>
            <div className="flex justify-center gap-4">
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-lg !px-8 !py-3" />
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-gray-800 rounded-xl">
                <div className="text-3xl mb-4">🔑</div>
                <h3 className="text-xl font-semibold mb-2">Buy Keys</h3>
                <p className="text-gray-400">Purchase agent keys on a bonding curve</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-xl">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">Unlock Resources</h3>
                <p className="text-gray-400">Access prompts, code, and training data</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-xl">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Trade</h3>
                <p className="text-gray-400">Sell keys anytime as agents grow</p>
              </div>
            </div>
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
    </main>
  );
}

function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Trending Agents</h2>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold">
          Create Agent
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AgentCard 
          name="CodeBot"
          symbol="CODE"
          price={50}
          change={25}
          holders={42}
          description="AI agent that writes and reviews code"
        />
        <AgentCard 
          name="TradeBot"
          symbol="TRADE"
          price={32}
          change={12}
          holders={28}
          description="Algorithmic trading strategies"
        />
        <AgentCard 
          name="MemeLord"
          symbol="MEME"
          price={18}
          change={-5}
          holders={156}
          description="Viral content generation"
        />
      </div>
    </div>
  );
}

function AgentCard({ 
  name, 
  symbol, 
  price, 
  change, 
  holders,
  description 
}: { 
  name: string;
  symbol: string;
  price: number;
  change: number;
  holders: number;
  description: string;
}) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-400 text-sm">${symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">${price}</p>
          <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm">{description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
        <span>{holders} holders</span>
        <span>5 resources</span>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors">
          Buy Keys
        </button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition-colors">
          View
        </button>
      </div>
    </div>
  );
}
