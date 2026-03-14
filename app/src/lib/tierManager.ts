// Simplified tier management system for 2-tier launch
import { ACCESS_TIERS, CONTENT_TYPES, getTierFromKeys, canAccessContent } from './constants';

export interface UserTierInfo {
  currentTier: keyof typeof ACCESS_TIERS | null;
  keysOwned: number;
  nextTier: keyof typeof ACCESS_TIERS | null;
  keysNeeded: number;
  canUpgrade: boolean;
  totalSpent: number;
}

export interface ContentAccess {
  hasAccess: boolean;
  tier: keyof typeof ACCESS_TIERS;
  message: string;
  upgradeRequired?: {
    fromTier: keyof typeof ACCESS_TIERS | null;
    toTier: keyof typeof ACCESS_TIERS;
    additionalKeys: number;
    cost: number;
  };
}

export class TierManager {
  
  /**
   * Get comprehensive tier information for a user
   */
  static getUserTierInfo(keysOwned: number): UserTierInfo {
    const currentTier = getTierFromKeys(keysOwned);
    
    // Calculate next tier and keys needed
    let nextTier: keyof typeof ACCESS_TIERS | null = null;
    let keysNeeded = 0;
    
    if (keysOwned < ACCESS_TIERS.BASIC.keysRequired) {
      nextTier = 'BASIC';
      keysNeeded = ACCESS_TIERS.BASIC.keysRequired - keysOwned;
    } else if (keysOwned < ACCESS_TIERS.PREMIUM.keysRequired && currentTier === 'BASIC') {
      nextTier = 'PREMIUM';
      keysNeeded = ACCESS_TIERS.PREMIUM.keysRequired - keysOwned;
    }
    
    // Calculate total spent
    const totalSpent = keysOwned * 5; // $5 per key
    
    return {
      currentTier,
      keysOwned,
      nextTier,
      keysNeeded,
      canUpgrade: nextTier !== null,
      totalSpent
    };
  }
  
  /**
   * Check if user can access specific content
   */
  static checkContentAccess(userKeys: number, contentTier: keyof typeof ACCESS_TIERS): ContentAccess {
    const userTier = getTierFromKeys(userKeys);
    const hasAccess = canAccessContent(userKeys, contentTier);
    
    if (hasAccess) {
      return {
        hasAccess: true,
        tier: contentTier,
        message: `Access granted with ${userTier} tier`
      };
    }
    
    // Calculate upgrade requirements
    const requiredKeys = ACCESS_TIERS[contentTier].keysRequired;
    const additionalKeys = Math.max(0, requiredKeys - userKeys);
    const cost = additionalKeys * 5; // $5 per key
    
    return {
      hasAccess: false,
      tier: contentTier,
      message: `${contentTier} access required. You need ${additionalKeys} more keys.`,
      upgradeRequired: {
        fromTier: userTier,
        toTier: contentTier,
        additionalKeys,
        cost
      }
    };
  }
  
  /**
   * Get all content accessible to user
   */
  static getAccessibleContent(userKeys: number): {
    tier: keyof typeof ACCESS_TIERS | null;
    accessibleContentTypes: string[];
    restrictedContentTypes: string[];
  } {
    const userTier = getTierFromKeys(userKeys);
    
    if (!userTier) {
      return {
        tier: null,
        accessibleContentTypes: [],
        restrictedContentTypes: Object.keys(CONTENT_TYPES)
      };
    }
    
    const accessibleContentTypes: string[] = [];
    const restrictedContentTypes: string[] = [];
    
    Object.entries(CONTENT_TYPES).forEach(([contentType, config]) => {
      if (canAccessContent(userKeys, config.defaultTier)) {
        accessibleContentTypes.push(contentType);
      } else {
        restrictedContentTypes.push(contentType);
      }
    });
    
    return {
      tier: userTier,
      accessibleContentTypes,
      restrictedContentTypes
    };
  }
  
  /**
   * Calculate upgrade value proposition
   */
  static getUpgradeValue(fromKeys: number, toTier: keyof typeof ACCESS_TIERS): {
    additionalKeys: number;
    cost: number;
    newFeatures: string[];
    valueProposition: string;
  } {
    const requiredKeys = ACCESS_TIERS[toTier].keysRequired;
    const additionalKeys = Math.max(0, requiredKeys - fromKeys);
    const cost = additionalKeys * 5;
    
    const currentAccess = this.getAccessibleContent(fromKeys);
    const newAccess = this.getAccessibleContent(requiredKeys);
    
    const newFeatures = newAccess.accessibleContentTypes.filter(
      contentType => !currentAccess.accessibleContentTypes.includes(contentType)
    );
    
    const tierInfo = ACCESS_TIERS[toTier];
    const valueProposition = `Upgrade to ${tierInfo.name} for ${newFeatures.length} new content types`;
    
    return {
      additionalKeys,
      cost,
      newFeatures,
      valueProposition
    };
  }
  
  /**
   * Simulate tier upgrade process
   */
  static simulateUpgrade(currentKeys: number, targetTier: keyof typeof ACCESS_TIERS): {
    success: boolean;
    beforeState: UserTierInfo;
    afterState: UserTierInfo;
    upgradeCost: number;
    newFeatures: string[];
  } {
    const beforeState = this.getUserTierInfo(currentKeys);
    const upgradeInfo = this.getUpgradeValue(currentKeys, targetTier);
    
    if (upgradeInfo.additionalKeys <= 0) {
      return {
        success: false,
        beforeState,
        afterState: beforeState,
        upgradeCost: 0,
        newFeatures: []
      };
    }
    
    const newKeyCount = currentKeys + upgradeInfo.additionalKeys;
    const afterState = this.getUserTierInfo(newKeyCount);
    
    return {
      success: true,
      beforeState,
      afterState,
      upgradeCost: upgradeInfo.cost,
      newFeatures: upgradeInfo.newFeatures
    };
  }
}

/**
 * Content filter based on user tier
 */
export class ContentFilter {
  
  /**
   * Filter content array based on user access
   */
  static filterContentByAccess(
    content: Array<{id: string, tier: keyof typeof ACCESS_TIERS, [key: string]: any}>,
    userKeys: number
  ): Array<{id: string, hasAccess: boolean, [key: string]: any}> {
    
    return content.map(item => {
      const access = TierManager.checkContentAccess(userKeys, item.tier);
      
      return {
        ...item,
        hasAccess: access.hasAccess,
        accessMessage: access.message,
        upgradeRequired: access.upgradeRequired
      };
    });
  }
  
  /**
   * Get preview version of restricted content
   */
  static getContentPreview(content: any, userHasAccess: boolean): any {
    if (userHasAccess) {
      return content;
    }
    
    // Return preview version
    return {
      ...content,
      title: content.title,
      summary: content.summary || content.title,
      preview: content.content ? content.content.substring(0, 100) + "..." : "Premium content preview",
      isPreview: true,
      fullContentAvailable: false
    };
  }
}

/**
 * Tier upgrade analytics
 */
export class TierAnalytics {
  
  /**
   * Calculate tier distribution metrics
   */
  static calculateTierDistribution(users: Array<{keysOwned: number}>): {
    noAccess: number;
    basic: number;
    premium: number;
    totalUsers: number;
    averageKeysPerUser: number;
    totalRevenue: number;
  } {
    const totalUsers = users.length;
    let noAccess = 0;
    let basic = 0;
    let premium = 0;
    let totalKeys = 0;
    
    users.forEach(user => {
      totalKeys += user.keysOwned;
      const tier = getTierFromKeys(user.keysOwned);
      
      if (!tier) noAccess++;
      else if (tier === 'BASIC') basic++;
      else if (tier === 'PREMIUM') premium++;
    });
    
    return {
      noAccess,
      basic,
      premium,
      totalUsers,
      averageKeysPerUser: totalKeys / totalUsers,
      totalRevenue: totalKeys * 5 // $5 per key
    };
  }
  
  /**
   * Calculate upgrade conversion potential
   */
  static calculateUpgradeOpportunity(users: Array<{keysOwned: number}>): {
    basicToPremiumEligible: number;
    potentialRevenue: number;
    conversionRate: number;
  } {
    const basicUsers = users.filter(user => {
      const tier = getTierFromKeys(user.keysOwned);
      return tier === 'BASIC';
    });
    
    const basicToPremiumEligible = basicUsers.length;
    const keysNeededPerUser = ACCESS_TIERS.PREMIUM.keysRequired - ACCESS_TIERS.BASIC.keysRequired;
    const potentialRevenue = basicToPremiumEligible * keysNeededPerUser * 5; // $5 per key
    
    // Assume 25% conversion rate for projections
    const conversionRate = 0.25;
    
    return {
      basicToPremiumEligible,
      potentialRevenue: potentialRevenue * conversionRate,
      conversionRate
    };
  }
}

export { ACCESS_TIERS, CONTENT_TYPES };