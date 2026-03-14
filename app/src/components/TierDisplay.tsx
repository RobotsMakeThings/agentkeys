'use client';

import React from 'react';
import { Check, Lock, Star, Zap } from 'lucide-react';
import { ACCESS_TIERS, getTierFromKeys } from '@/lib/constants';
import { TierManager } from '@/lib/tierManager';

interface TierDisplayProps {
  userKeys?: number;
  agentId?: string;
  showUpgrade?: boolean;
  onUpgrade?: (tier: keyof typeof ACCESS_TIERS) => void;
}

export default function TierDisplay({ 
  userKeys = 0, 
  agentId, 
  showUpgrade = true, 
  onUpgrade 
}: TierDisplayProps) {
  const currentTier = getTierFromKeys(userKeys);
  const tierInfo = TierManager.getUserTierInfo(userKeys);

  const getTierIcon = (tier: keyof typeof ACCESS_TIERS) => {
    return tier === 'BASIC' ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />;
  };

  const getTierColor = (tier: keyof typeof ACCESS_TIERS, isUser: boolean = false) => {
    if (tier === 'BASIC') {
      return isUser 
        ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
        : 'bg-gray-800 border-gray-600 text-gray-300';
    } else {
      return isUser 
        ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
        : 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Tier Status */}
      {currentTier && (
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTierIcon(currentTier)}
              <div>
                <h3 className="font-semibold text-white">
                  {ACCESS_TIERS[currentTier].name}
                </h3>
                <p className="text-sm text-gray-400">
                  {userKeys} keys owned • ${tierInfo.totalSpent} spent
                </p>
              </div>
            </div>
            
            {tierInfo.canUpgrade && showUpgrade && (
              <button
                onClick={() => onUpgrade && tierInfo.nextTier && onUpgrade(tierInfo.nextTier)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Upgrade to {tierInfo.nextTier}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tier Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(ACCESS_TIERS).map(([tierKey, tier]) => {
          const isCurrentTier = currentTier === tierKey;
          const tierTyped = tierKey as keyof typeof ACCESS_TIERS;
          const hasAccess = userKeys >= tier.keysRequired;

          return (
            <div
              key={tierKey}
              className={`relative border rounded-xl p-6 transition-all duration-300 ${
                isCurrentTier 
                  ? getTierColor(tierTyped, true)
                  : getTierColor(tierTyped, false)
              } ${isCurrentTier ? 'ring-2 ring-blue-500/50' : ''}`}
            >
              {/* Tier Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTierIcon(tierTyped)}
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                </div>
                
                {hasAccess ? (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-medium">Locked</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-white">
                    {tier.keysRequired} {tier.keysRequired === 1 ? 'key' : 'keys'}
                  </span>
                  <span className="text-gray-400">
                    (${tier.totalCost} total)
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {tier.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  $5 per key
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className={`w-4 h-4 ${hasAccess ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${hasAccess ? 'text-white' : 'text-gray-400'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {!hasAccess && showUpgrade && (
                <button
                  onClick={() => onUpgrade && onUpgrade(tierTyped)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  {userKeys === 0 ? (
                    `Get ${tier.name} - $${tier.totalCost}`
                  ) : (
                    `Upgrade - $${tier.totalCost - tierInfo.totalSpent} more`
                  )}
                </button>
              )}

              {isCurrentTier && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Current
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade Information */}
      {tierInfo.canUpgrade && showUpgrade && tierInfo.nextTier && (
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Ready to Upgrade?</h4>
          <p className="text-gray-400 text-sm mb-3">
            Add {tierInfo.keysNeeded} more keys to unlock {ACCESS_TIERS[tierInfo.nextTier].name} features.
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Cost: ${(tierInfo.keysNeeded * 5).toFixed(2)} additional
            </div>
            
            {onUpgrade && (
              <button
                onClick={() => onUpgrade(tierInfo.nextTier!)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Access State */}
      {userKeys === 0 && (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <Lock className="w-8 h-8 text-gray-500" />
            <h3 className="text-lg font-semibold text-white">No Access</h3>
            <p className="text-gray-400 text-sm mb-4">
              Purchase keys to access this agent's content
            </p>
            
            {onUpgrade && (
              <button
                onClick={() => onUpgrade('BASIC')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Get Started - $5
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for showing tier requirements on content
export function ContentTierBadge({ 
  requiredTier, 
  userTier, 
  compact = false 
}: { 
  requiredTier: keyof typeof ACCESS_TIERS;
  userTier?: keyof typeof ACCESS_TIERS | null;
  compact?: boolean;
}) {
  const hasAccess = userTier && 
    (requiredTier === 'BASIC' || 
     (requiredTier === 'PREMIUM' && userTier === 'PREMIUM'));

  if (compact) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
        hasAccess 
          ? 'bg-green-500/20 text-green-400'
          : 'bg-orange-500/20 text-orange-400'
      }`}>
        {hasAccess ? <Check className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
        {ACCESS_TIERS[requiredTier].name}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
      hasAccess 
        ? 'bg-green-500/10 border-green-500/30 text-green-400'
        : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
    }`}>
      {hasAccess ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
      <span className="text-sm font-medium">
        {hasAccess ? 'Unlocked' : 'Requires'} {ACCESS_TIERS[requiredTier].name}
      </span>
    </div>
  );
}