'use client';

import { notFound } from 'next/navigation';
import SimplifiedAgentCard from '@/components/SimplifiedAgentCard';
import TierDisplay from '@/components/TierDisplay';
import { mockAgents } from '@/lib/mockData';

// Dynamic route - no static generation needed for client component

interface AgentDetailPageProps {
  params: {
    id: string;
  };
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  // Find the agent in our mock data
  const agent = mockAgents.find(a => a.address === params.id || a.name.toLowerCase().replace(/\s+/g, '-') === params.id);
  
  if (!agent) {
    notFound();
  }

  // Mock user key ownership for demo (in real app, this would come from wallet/blockchain)
  const userKeys = 0; // Default to no keys owned

  const handleKeyPurchase = (agentId: string, tier: 'BASIC' | 'PREMIUM') => {
    console.log(`Purchasing ${tier} tier for agent ${agentId}`);
    alert(`Would purchase ${tier} tier for agent ${agentId} - $${tier === 'BASIC' ? '5' : '15'}`);
    // In real app, this would trigger wallet transaction
  };

  const handleTierUpgrade = (tier: 'BASIC' | 'PREMIUM') => {
    handleKeyPurchase(agent.address, tier);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <a 
            href="/explore" 
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
          >
            ← Back to Explore
          </a>
        </div>

        {/* Agent Detail */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Agent Card */}
          <SimplifiedAgentCard
            agent={agent}
            userKeys={userKeys}
            onKeyPurchase={handleKeyPurchase}
            className="h-fit"
          />
          
          {/* Tier Information */}
          <TierDisplay
            agentId={agent.address}
            userKeys={userKeys}
            onUpgrade={handleTierUpgrade}
          />
        </div>

        {/* Agent Content Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Recent Content */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Content</h3>
            <div className="space-y-4">
              {agent.content?.slice(0, 3).map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400 capitalize">{item.type} • {item.tier} Tier</p>
                </div>
              )) || (
                <p className="text-gray-400">No content available. Check back soon!</p>
              )}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-400">{agent.totalKeys}</div>
                <div className="text-sm text-gray-400">Total Keys</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{agent.holders}</div>
                <div className="text-sm text-gray-400">Holders</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{agent.category}</div>
                <div className="text-sm text-gray-400">Category</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">$5</div>
                <div className="text-sm text-gray-400">Per Key</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}