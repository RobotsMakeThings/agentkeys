'use client';

import React from 'react';
import { 
  Zap, 
  Clock, 
  Shield, 
  Star, 
  ArrowRight,
  CheckCircle,
  Activity,
  Users
} from 'lucide-react';

interface RoutingTier {
  id: string;
  name: string;
  keysRequired: number;
  priority: number;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  responseTime: string;
  availability: string;
  queuePosition: string;
  icon: React.ElementType;
}

interface RoutingPriorityProps {
  userKeys?: number;
  agentId: string;
  currentTier?: string;
}

export default function RoutingPriority({ userKeys = 0, agentId, currentTier }: RoutingPriorityProps) {
  const routingTiers: RoutingTier[] = [
    {
      id: 'standard',
      name: 'Standard Queue',
      keysRequired: 0,
      priority: 1,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/20',
      features: [
        'Best-effort routing',
        'Standard rate limits',
        'Community support',
        'Basic error handling'
      ],
      responseTime: '2-5 minutes',
      availability: '95%',
      queuePosition: 'Back of queue',
      icon: Clock
    },
    {
      id: 'priority',
      name: 'Priority Access',
      keysRequired: 1,
      priority: 2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      features: [
        'Priority routing',
        'Higher rate limits',
        'Email support',
        'Enhanced error handling',
        'Usage analytics'
      ],
      responseTime: '30-120 seconds',
      availability: '98%',
      queuePosition: 'Front 50%',
      icon: Zap
    },
    {
      id: 'premium',
      name: 'Premium Fast Lane',
      keysRequired: 5,
      priority: 3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
      features: [
        'Dedicated routing',
        'Premium rate limits',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'SLA guarantees'
      ],
      responseTime: '10-30 seconds',
      availability: '99.5%',
      queuePosition: 'Front 20%',
      icon: Star
    },
    {
      id: 'enterprise',
      name: 'Enterprise Reserved',
      keysRequired: 20,
      priority: 4,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      features: [
        'Reserved capacity',
        'Unlimited requests',
        'Dedicated support',
        'Custom SLAs',
        'White-glove setup',
        'Priority development'
      ],
      responseTime: '< 10 seconds',
      availability: '99.9%',
      queuePosition: 'Skip queue',
      icon: Shield
    }
  ];

  const getCurrentTier = () => {
    return routingTiers
      .filter(tier => userKeys >= tier.keysRequired)
      .sort((a, b) => b.priority - a.priority)[0] || routingTiers[0];
  };

  const currentUserTier = getCurrentTier();

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Access Level</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${currentUserTier.bgColor} ${currentUserTier.borderColor}`}>
            <currentUserTier.icon className={`w-4 h-4 ${currentUserTier.color}`} />
            <span className={`font-medium ${currentUserTier.color}`}>
              {currentUserTier.name}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-xl">
            <Activity className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{currentUserTier.responseTime}</div>
            <div className="text-sm text-gray-400">Response Time</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{currentUserTier.availability}</div>
            <div className="text-sm text-gray-400">Availability</div>
          </div>
          
          <div className="text-center p-4 bg-gray-800/50 rounded-xl">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{currentUserTier.queuePosition}</div>
            <div className="text-sm text-gray-400">Queue Position</div>
          </div>
        </div>

        <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4">
          <h4 className="font-semibold text-cyan-400 mb-2">What you get:</h4>
          <div className="grid md:grid-cols-2 gap-2">
            {currentUserTier.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-cyan-400" />
                <span className="text-sm text-cyan-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Tiers Overview */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Routing Priority Tiers</h3>
        
        <div className="space-y-4">
          {routingTiers.map((tier, index) => {
            const Icon = tier.icon;
            const isCurrentTier = tier.id === currentUserTier.id;
            const canUpgrade = userKeys < tier.keysRequired && tier.keysRequired > currentUserTier.keysRequired;
            const hasAccess = userKeys >= tier.keysRequired;
            
            return (
              <div 
                key={tier.id}
                className={`relative p-6 rounded-xl border transition-all ${
                  isCurrentTier 
                    ? `${tier.bgColor} ${tier.borderColor} ring-2 ring-opacity-50`
                    : hasAccess
                      ? 'bg-gray-800/30 border-gray-700'
                      : 'bg-gray-800/20 border-gray-800'
                }`}
              >
                {isCurrentTier && (
                  <div className="absolute -top-2 -right-2 bg-cyan-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    CURRENT
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.bgColor} ${tier.borderColor} border`}>
                      <Icon className={`w-6 h-6 ${tier.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`text-lg font-semibold ${hasAccess ? 'text-white' : 'text-gray-500'}`}>
                          {tier.name}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${tier.bgColor} ${tier.color}`}>
                          {tier.keysRequired === 0 ? 'Free' : `${tier.keysRequired} keys`}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-gray-500">Response Time</span>
                          <div className={`font-medium ${hasAccess ? 'text-white' : 'text-gray-500'}`}>
                            {tier.responseTime}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Availability</span>
                          <div className={`font-medium ${hasAccess ? 'text-white' : 'text-gray-500'}`}>
                            {tier.availability}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Queue Position</span>
                          <div className={`font-medium ${hasAccess ? 'text-white' : 'text-gray-500'}`}>
                            {tier.queuePosition}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {tier.features.slice(0, 3).map((feature, fIndex) => (
                          <span 
                            key={fIndex} 
                            className={`px-2 py-1 rounded-full text-xs ${
                              hasAccess 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-800 text-gray-500'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                        {tier.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-500 rounded-full text-xs">
                            +{tier.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {canUpgrade && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all text-sm font-medium">
                      Upgrade
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Recommendation */}
      {userKeys < routingTiers[routingTiers.length - 1].keysRequired && (
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-400/20">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-purple-400" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-2">
                Unlock Faster Access
              </h4>
              <p className="text-gray-300">
                Get priority routing and faster response times by holding more keys. 
                Enterprise tier gets you dedicated capacity and sub-10-second responses.
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold">
              Buy More Keys
            </button>
          </div>
        </div>
      )}
    </div>
  );
}