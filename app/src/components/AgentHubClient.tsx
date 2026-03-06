'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Bot, 
  Users, 
  Lock, 
  MessageSquare, 
  FileText, 
  Key, 
  Shield,
  Upload,
  Download,
  Send,
  Paperclip
} from 'lucide-react';
import { useAgentKeys } from '@/hooks/useAgentKeys';

interface AgentHubClientProps {
  agentId: string;
}

export default function AgentHubClient({ agentId }: AgentHubClientProps) {
  const { connected } = useWallet();
  const { fetchAgent, fetchAgentFees, getBuyPrice } = useAgentKeys();
  
  const [agent, setAgent] = useState<any>(null);
  const [userKeyBalance, setUserKeyBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Access tiers
  const hasBasicAccess = userKeyBalance >= 1;
  const hasPremiumAccess = userKeyBalance >= 10;

  useEffect(() => {
    loadAgentData();
  }, [agentId]);

  const loadAgentData = async () => {
    setIsLoading(true);
    try {
      // For demo, use mock data based on agentId
      const mockAgent = {
        'research-os': { id: 'research-os', name: 'ResearchOS', symbol: 'RSCH', price: 2.41, holders: 1242, description: 'Autonomous research agent for diligence and summaries.' },
        'trade-pilot': { id: 'trade-pilot', name: 'TradePilot', symbol: 'TRADE', price: 4.83, holders: 842, description: 'Executes strategy workflows and monitors markets.' },
        'growth-loop': { id: 'growth-loop', name: 'GrowthLoop', symbol: 'GROW', price: 1.16, holders: 2310, description: 'Runs outbound content and campaign loops.' },
        'audit-mesh': { id: 'audit-mesh', name: 'AuditMesh', symbol: 'AUDIT', price: 5.21, holders: 502, description: 'Contract review and threat surfacing.' },
      }[agentId];
      
      setAgent(mockAgent);
      
      // TODO: Load user's key balance from smart contract
      // For demo, using mock data
      setUserKeyBalance(5); // Example: user owns 5 keys
      
      // TODO: Load encrypted messages for this agent's hub
      setMessages([
        {
          id: 1,
          user: '0x1234...5678',
          message: `Welcome to ${mockAgent?.name} private hub!`,
          timestamp: Date.now() - 3600000,
          encrypted: true
        },
        {
          id: 2,
          user: '0x8765...4321',
          message: 'Just shared the latest findings in premium section',
          timestamp: Date.now() - 1800000,
          encrypted: true
        }
      ]);
    } catch (error) {
      console.error('Failed to load agent data:', error);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !hasBasicAccess) return;
    
    const messageData = {
      id: Date.now(),
      user: 'You',
      message: newMessage,
      timestamp: Date.now(),
      encrypted: true
    };
    
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading agent hub...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Agent not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/agentkeys-logo.png" 
                alt="AgentKeys" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-lg gradient-agentkeys-text">AgentKeys</h1>
                <p className="text-xs text-gray-400">Agent Hub Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-400 hover:text-white">← Back to Home</a>
              <WalletMultiButton className="gradient-agentkeys hover:!opacity-90 !rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Header */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-400/30 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                <Bot className="h-10 w-10 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-agentkeys-text mb-2">{agent.name}</h1>
                <p className="text-gray-400 text-lg mb-4">{agent.description}</p>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userKeyBalance}</div>
                    <div className="text-sm text-gray-400">Your Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{agent.holders}</div>
                    <div className="text-sm text-gray-400">Total Holders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{agent.price} SOL</div>
                    <div className="text-sm text-gray-400">Key Price</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-2xl border ${hasBasicAccess ? 'bg-green-500/10 border-green-400/30' : 'bg-gray-800/30 border-gray-700'}`}>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className={`h-8 w-8 ${hasBasicAccess ? 'text-green-400' : 'text-gray-500'}`} />
              <div>
                <h3 className="text-lg font-semibold">Basic Access</h3>
                <p className="text-sm text-gray-400">1-9 keys required</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 ${hasBasicAccess ? 'text-green-400' : 'text-gray-500'}`}>
                {hasBasicAccess ? '✅' : '🔒'} Group chat access
              </div>
              <div className={`flex items-center gap-2 ${hasBasicAccess ? 'text-green-400' : 'text-gray-500'}`}>
                {hasBasicAccess ? '✅' : '🔒'} File sharing
              </div>
              <div className={`flex items-center gap-2 ${hasBasicAccess ? 'text-green-400' : 'text-gray-500'}`}>
                {hasBasicAccess ? '✅' : '🔒'} Basic updates from agent
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${hasPremiumAccess ? 'bg-purple-500/10 border-purple-400/30' : 'bg-gray-800/30 border-gray-700'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Lock className={`h-8 w-8 ${hasPremiumAccess ? 'text-purple-400' : 'text-gray-500'}`} />
              <div>
                <h3 className="text-lg font-semibold">Premium Access</h3>
                <p className="text-sm text-gray-400">10+ keys required</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 ${hasPremiumAccess ? 'text-purple-400' : 'text-gray-500'}`}>
                {hasPremiumAccess ? '✅' : '🔒'} Private agent knowledge
              </div>
              <div className={`flex items-center gap-2 ${hasPremiumAccess ? 'text-purple-400' : 'text-gray-500'}`}>
                {hasPremiumAccess ? '✅' : '🔒'} Direct agent consultations
              </div>
              <div className={`flex items-center gap-2 ${hasPremiumAccess ? 'text-purple-400' : 'text-gray-500'}`}>
                {hasPremiumAccess ? '✅' : '🔒'} Exclusive resources & tools
              </div>
            </div>
          </div>
        </div>

        {/* Need Keys Warning */}
        {!connected && (
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6 mb-8 text-center">
            <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Wallet to Access Hub</h3>
            <p className="text-gray-400 mb-4">Connect your Solana wallet to verify key ownership</p>
            <WalletMultiButton className="gradient-agentkeys hover:!opacity-90 !px-8 !py-3" />
          </div>
        )}

        {connected && !hasBasicAccess && (
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-2xl p-6 mb-8 text-center">
            <Key className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Purchase Keys to Join</h3>
            <p className="text-gray-400 mb-4">You need at least 1 key to access the group chat</p>
            <button className="gradient-agentkeys hover:opacity-90 px-8 py-3 rounded-xl font-semibold">
              Buy Keys
            </button>
          </div>
        )}

        {/* Hub Content */}
        {connected && hasBasicAccess && (
          <>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-800/30 rounded-xl p-1">
              {[
                { id: 'chat', label: 'Group Chat', icon: MessageSquare, access: hasBasicAccess },
                { id: 'premium', label: 'Premium Content', icon: Lock, access: hasPremiumAccess },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={!tab.access}
                  className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'gradient-agentkeys text-white'
                      : tab.access
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                  {!tab.access && <Lock className="h-4 w-4" />}
                </button>
              ))}
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Group Chat</h3>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{msg.user}</span>
                          <span className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</span>
                        </div>
                        <p className="text-gray-300">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-700 p-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 pr-12"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-cyan-400">
                        <Paperclip className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={sendMessage}
                      className="gradient-agentkeys hover:opacity-90 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Messages are end-to-end encrypted and only visible to key holders
                  </p>
                </div>
              </div>
            )}

            {/* Premium Content Tab */}
            {activeTab === 'premium' && (
              <div className="space-y-6">
                {hasPremiumAccess ? (
                  <>
                    <div className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-6">
                      <h3 className="text-xl font-semibold mb-4 gradient-agentkeys-text">Premium Content Library</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { name: 'Trading Strategy Guide', type: 'PDF', size: '2.4 MB', updated: '2 hours ago' },
                          { name: 'Market Analysis Scripts', type: 'ZIP', size: '1.2 MB', updated: '1 day ago' },
                          { name: 'Private Research Notes', type: 'MD', size: '890 KB', updated: '3 days ago' },
                          { name: 'Exclusive Data Sets', type: 'CSV', size: '5.6 MB', updated: '1 week ago' },
                        ].map((file, i) => (
                          <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-purple-400" />
                                <div>
                                  <h4 className="font-medium">{file.name}</h4>
                                  <p className="text-sm text-gray-400">{file.type} • {file.size}</p>
                                </div>
                              </div>
                              <button className="text-purple-400 hover:text-purple-300">
                                <Download className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">Updated {file.updated}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Direct Agent Access</h3>
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <Bot className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <h4 className="font-semibold mb-2">Schedule 1-on-1 Session</h4>
                        <p className="text-gray-400 text-sm mb-4">
                          Premium key holders can book private consultation sessions
                        </p>
                        <button className="gradient-agentkeys hover:opacity-90 px-6 py-3 rounded-xl font-semibold">
                          Book Session
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 text-center">
                    <Lock className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Premium Access Required</h3>
                    <p className="text-gray-400 mb-6">
                      You need 10+ keys to access premium content and direct agent consultations
                    </p>
                    <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-400 mb-2">Your progress:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="gradient-agentkeys h-2 rounded-full" 
                            style={{ width: `${Math.min(userKeyBalance / 10 * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{userKeyBalance}/10 keys</span>
                      </div>
                    </div>
                    <button className="gradient-agentkeys hover:opacity-90 px-8 py-3 rounded-xl font-semibold">
                      Buy More Keys
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}