'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Shield, 
  Bot, 
  CheckCircle, 
  AlertCircle, 
  Wallet,
  Twitter,
  Github,
  Key,
  ArrowRight,
  Info
} from 'lucide-react';

export default function VerifyAgentPage() {
  const params = useParams();
  const { connected, publicKey, signMessage } = useWallet();
  const [verificationStep, setVerificationStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [agentLimits, setAgentLimits] = useState({
    maxSpendPerDay: 10,
    allowTradingWhenAway: true,
    requireApprovalOver: 100
  });

  // Mock agent data - in production, fetch by params.agentId
  const agent = {
    id: params.agentId,
    name: 'ResearchOS-Clone-42',
    description: 'Advanced autonomous research agent specializing in market analysis and competitive intelligence gathering.',
    category: 'Research',
    githubRepo: 'https://github.com/ai-research/research-os',
    twitterHandle: '@ResearchOS42',
    requestedAt: '2026-03-06T19:33:00Z'
  };

  const handleWalletVerification = async () => {
    if (!connected || !publicKey || !signMessage) return;

    setIsVerifying(true);
    
    try {
      // Create verification message
      const message = new TextEncoder().encode(
        `Verify agent ownership for AgentKeys\n` +
        `Agent: ${agent.name}\n` +
        `Agent ID: ${agent.id}\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Wallet: ${publicKey.toString()}`
      );
      
      // Sign the message
      const signature = await signMessage(message);
      
      // TODO: Send verification to backend
      const verificationData = {
        agentId: agent.id,
        walletAddress: publicKey.toString(),
        signature: Array.from(signature),
        message: Array.from(message),
        twitterHandle,
        agentLimits
      };
      
      console.log('Verification data:', verificationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStep(3);
      setVerificationComplete(true);
      
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Agent Verification Request</h2>
        <p className="text-gray-400">
          An AI agent is requesting access to trade on your behalf
        </p>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Agent Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Name</span>
            <span className="text-white font-medium">{agent.name}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <span className="text-gray-400">Description</span>
            <span className="text-white text-right max-w-md">{agent.description}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Category</span>
            <span className="text-cyan-400">{agent.category}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">GitHub</span>
            <a href={agent.githubRepo} className="text-blue-400 hover:text-blue-300 transition-colors">
              View Repository
            </a>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Requested</span>
            <span className="text-gray-300">
              {new Date(agent.requestedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-sm">
            <div className="text-yellow-400 font-semibold mb-1">Important</div>
            <div className="text-yellow-300">
              By verifying this agent, you're allowing it to trade AgentKeys on your behalf using your connected wallet.
              You can set spending limits and controls in the next step.
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setVerificationStep(2)}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold"
      >
        Continue to Wallet Connection
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Connect & Verify Wallet</h2>
        <p className="text-gray-400">
          Connect your wallet and sign a verification message
        </p>
      </div>

      {!connected && (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Step 1: Connect Wallet</h3>
          <WalletMultiButton className="!bg-gradient-to-r !from-cyan-500 !to-blue-500 !hover:from-cyan-600 !hover:to-blue-600" />
        </div>
      )}

      {connected && (
        <>
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Wallet Connected</h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-gray-400 text-sm">
              {publicKey?.toString()}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Agent Trading Limits</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max spend per day (SOL)</label>
                <input 
                  type="number"
                  value={agentLimits.maxSpendPerDay}
                  onChange={(e) => setAgentLimits(prev => ({ ...prev, maxSpendPerDay: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  min="1"
                  max="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Require approval for transactions over (SOL)</label>
                <input 
                  type="number"
                  value={agentLimits.requireApprovalOver}
                  onChange={(e) => setAgentLimits(prev => ({ ...prev, requireApprovalOver: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  min="10"
                  max="1000"
                />
              </div>
              
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={agentLimits.allowTradingWhenAway}
                  onChange={(e) => setAgentLimits(prev => ({ ...prev, allowTradingWhenAway: e.target.checked }))}
                  className="rounded border-gray-700 bg-gray-800 text-blue-400"
                />
                <span className="text-gray-300">Allow trading when I'm offline</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Optional: Social Verification</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Twitter/X Handle (improves agent ranking)</label>
              <input 
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@yourusername"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div className="text-xs text-gray-500 mt-1">
                This helps verify your agent's authenticity and improves its capability ranking
              </div>
            </div>
          </div>

          <button 
            onClick={handleWalletVerification}
            disabled={isVerifying}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'Sign & Verify Agent'}
          </button>
        </>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-400" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Agent Verified Successfully! 🎉</h2>
        <p className="text-gray-400">
          Your agent <strong className="text-white">{agent.name}</strong> is now authorized to trade on AgentKeys
        </p>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
        
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
            <div>
              <div className="text-white font-medium">Agent receives API key</div>
              <div className="text-gray-400 text-sm">Your agent can now authenticate with AgentKeys</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
            <div>
              <div className="text-white font-medium">Trading begins</div>
              <div className="text-gray-400 text-sm">Agent can buy/sell keys within your set limits</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
            <div>
              <div className="text-white font-medium">Monitor activity</div>
              <div className="text-gray-400 text-sm">Check your portfolio dashboard for all transactions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
        <div className="text-green-400 font-semibold mb-2">Agent Limits Active</div>
        <div className="text-sm text-green-300 space-y-1">
          <div>• Max {agentLimits.maxSpendPerDay} SOL per day</div>
          <div>• Approval required over {agentLimits.requireApprovalOver} SOL</div>
          <div>• {agentLimits.allowTradingWhenAway ? 'Can trade offline' : 'Only trades when you\'re online'}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <a 
          href="/dashboard"
          className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold text-center"
        >
          View Dashboard
        </a>
        <a 
          href="/capabilities"
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-semibold text-center"
        >
          Explore Agents
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="container max-w-2xl mx-auto px-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                step < verificationStep 
                  ? 'bg-green-500 text-white'
                  : step === verificationStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-400'
              }`}>
                {step < verificationStep ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-3 ${
                  step < verificationStep ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
          {verificationStep === 1 && renderStep1()}
          {verificationStep === 2 && renderStep2()}
          {verificationStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}