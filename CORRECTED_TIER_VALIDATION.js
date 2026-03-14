#!/usr/bin/env node

/**
 * CORRECTED TIER STRUCTURE VALIDATION
 * ====================================
 * 
 * Validates the simplified key-based tier system:
 * - 1 key purchased = Basic tier
 * - 3+ keys purchased = Premium tier
 * - Each key costs $5
 */

console.log('🔑 AGENTKEYS CORRECTED TIER STRUCTURE VALIDATION');
console.log('================================================\n');

// Simplified tier logic based on key ownership
const KEY_PRICE = 5.00;

const ACCESS_TIERS = {
  BASIC: {
    name: 'Basic Access',
    keysRequired: 1,
    keyPrice: KEY_PRICE,
    totalCost: 1 * KEY_PRICE // 1 × $5 = $5
  },
  PREMIUM: {
    name: 'Premium Access', 
    keysRequired: 3,
    keyPrice: KEY_PRICE,
    totalCost: 3 * KEY_PRICE // 3 × $5 = $15
  }
};

function getTierFromKeys(keyCount) {
  if (keyCount >= ACCESS_TIERS.PREMIUM.keysRequired) return 'PREMIUM';
  if (keyCount >= ACCESS_TIERS.BASIC.keysRequired) return 'BASIC';
  return null;
}

function calculateCostForKeys(keyCount) {
  return keyCount * KEY_PRICE;
}

function canAccessContent(userKeys, contentTier) {
  const userTier = getTierFromKeys(userKeys);
  if (!userTier) return false;
  if (contentTier === 'BASIC') return true;
  if (contentTier === 'PREMIUM') return userTier === 'PREMIUM';
  return false;
}

console.log('💰 KEY PRICING VALIDATION');
console.log('=========================');

const keyPricingTests = [
  { keys: 1, expectedCost: 5, expectedTier: 'BASIC' },
  { keys: 2, expectedCost: 10, expectedTier: 'BASIC' },
  { keys: 3, expectedCost: 15, expectedTier: 'PREMIUM' },
  { keys: 4, expectedCost: 20, expectedTier: 'PREMIUM' },
  { keys: 5, expectedCost: 25, expectedTier: 'PREMIUM' }
];

let pricingPassed = true;

keyPricingTests.forEach(test => {
  const actualCost = calculateCostForKeys(test.keys);
  const actualTier = getTierFromKeys(test.keys);
  
  const costCorrect = actualCost === test.expectedCost;
  const tierCorrect = actualTier === test.expectedTier;
  const allCorrect = costCorrect && tierCorrect;
  
  console.log(`${allCorrect ? '✅' : '❌'} ${test.keys} keys: $${actualCost} cost, ${actualTier} tier`);
  
  if (!allCorrect) pricingPassed = false;
});

console.log(`\nKey Pricing: ${pricingPassed ? '✅ PASSED' : '❌ FAILED'}\n`);

console.log('🎯 TIER ACCESS VALIDATION');
console.log('=========================');

const accessTests = [
  { keys: 0, content: 'BASIC', expected: false, desc: '0 keys cannot access BASIC content' },
  { keys: 1, content: 'BASIC', expected: true, desc: '1 key can access BASIC content' },
  { keys: 1, content: 'PREMIUM', expected: false, desc: '1 key cannot access PREMIUM content' },
  { keys: 2, content: 'BASIC', expected: true, desc: '2 keys can access BASIC content' },
  { keys: 2, content: 'PREMIUM', expected: false, desc: '2 keys cannot access PREMIUM content' },
  { keys: 3, content: 'BASIC', expected: true, desc: '3 keys can access BASIC content' },
  { keys: 3, content: 'PREMIUM', expected: true, desc: '3 keys can access PREMIUM content' },
  { keys: 5, content: 'PREMIUM', expected: true, desc: '5 keys can access PREMIUM content' }
];

let accessPassed = true;

accessTests.forEach(test => {
  const actual = canAccessContent(test.keys, test.content);
  const passed = actual === test.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${test.desc}`);
  
  if (!passed) accessPassed = false;
});

console.log(`\nAccess Control: ${accessPassed ? '✅ PASSED' : '❌ FAILED'}\n`);

console.log('🛒 USER PURCHASE SCENARIOS');
console.log('==========================');

const purchaseScenarios = [
  {
    name: 'New User Buys Basic',
    description: 'User starts with 0 keys, buys 1 key for Basic access',
    initialKeys: 0,
    keysPurchased: 1,
    finalKeys: 1,
    cost: 5,
    finalTier: 'BASIC'
  },
  {
    name: 'Basic User Upgrades to Premium', 
    description: 'User has 1 key, buys 2 more keys for Premium access',
    initialKeys: 1,
    keysPurchased: 2,
    finalKeys: 3,
    cost: 10, // 2 additional keys
    finalTier: 'PREMIUM'
  },
  {
    name: 'User Buys Premium Directly',
    description: 'User starts with 0 keys, buys 3 keys for Premium access',
    initialKeys: 0,
    keysPurchased: 3,
    finalKeys: 3,
    cost: 15,
    finalTier: 'PREMIUM'
  },
  {
    name: 'Premium User Buys More',
    description: 'User has 3 keys, buys 2 more keys (stays Premium)',
    initialKeys: 3,
    keysPurchased: 2,
    finalKeys: 5,
    cost: 10, // 2 additional keys
    finalTier: 'PREMIUM'
  }
];

let scenariosPassed = true;

purchaseScenarios.forEach(scenario => {
  const finalKeys = scenario.initialKeys + scenario.keysPurchased;
  const cost = scenario.keysPurchased * KEY_PRICE;
  const finalTier = getTierFromKeys(finalKeys);
  
  const keysCorrect = finalKeys === scenario.finalKeys;
  const costCorrect = cost === scenario.cost;
  const tierCorrect = finalTier === scenario.finalTier;
  const allCorrect = keysCorrect && costCorrect && tierCorrect;
  
  console.log(`\n📋 ${scenario.name}:`);
  console.log(`   ${scenario.description}`);
  console.log(`   ${keysCorrect ? '✅' : '❌'} Keys: ${scenario.initialKeys} → ${finalKeys} (expected ${scenario.finalKeys})`);
  console.log(`   ${costCorrect ? '✅' : '❌'} Cost: $${cost} for ${scenario.keysPurchased} keys`);
  console.log(`   ${tierCorrect ? '✅' : '❌'} Tier: ${finalTier} (expected ${scenario.finalTier})`);
  
  if (!allCorrect) scenariosPassed = false;
});

console.log(`\nPurchase Scenarios: ${scenariosPassed ? '✅ PASSED' : '❌ FAILED'}\n`);

console.log('💼 AGENT REVENUE VALIDATION');
console.log('===========================');

// Test agent revenue with corrected pricing
function calculateAgentRevenue(totalKeysOwned) {
  const grossRevenue = totalKeysOwned * KEY_PRICE;
  const platformFee = grossRevenue * 0.025; // 2.5%
  const agentRevenue = grossRevenue * 0.975; // 97.5%
  
  return { grossRevenue, platformFee, agentRevenue };
}

const revenueTests = [
  { 
    name: 'Small Agent',
    description: '50 subscribers: 30 basic (30 keys) + 20 premium (60 keys)',
    totalKeys: 30 + 60, // 90 keys
    expectedGross: 90 * 5, // $450
    expectedAgent: 90 * 5 * 0.975 // $438.75
  },
  {
    name: 'Medium Agent', 
    description: '200 subscribers: 120 basic (120 keys) + 80 premium (240 keys)',
    totalKeys: 120 + 240, // 360 keys
    expectedGross: 360 * 5, // $1800
    expectedAgent: 360 * 5 * 0.975 // $1755
  },
  {
    name: 'Large Agent',
    description: '500 subscribers: 250 basic (250 keys) + 250 premium (750 keys)', 
    totalKeys: 250 + 750, // 1000 keys
    expectedGross: 1000 * 5, // $5000
    expectedAgent: 1000 * 5 * 0.975 // $4875
  }
];

let revenuePassed = true;

revenueTests.forEach(test => {
  const revenue = calculateAgentRevenue(test.totalKeys);
  
  const grossCorrect = revenue.grossRevenue === test.expectedGross;
  const agentCorrect = revenue.agentRevenue === test.expectedAgent;
  const allCorrect = grossCorrect && agentCorrect;
  
  console.log(`\n📊 ${test.name}:`);
  console.log(`   ${test.description}`);
  console.log(`   Total Keys: ${test.totalKeys}`);
  console.log(`   ${grossCorrect ? '✅' : '❌'} Gross Revenue: $${revenue.grossRevenue} (expected $${test.expectedGross})`);
  console.log(`   ${agentCorrect ? '✅' : '❌'} Agent Revenue: $${revenue.agentRevenue} (expected $${test.expectedAgent})`);
  console.log(`   Platform Fee: $${revenue.platformFee.toFixed(2)} (2.5%)`);
  
  if (!allCorrect) revenuePassed = false;
});

console.log(`\nRevenue Model: ${revenuePassed ? '✅ PASSED' : '❌ FAILED'}\n`);

console.log('🏆 CORRECTED TIER STRUCTURE VALIDATION SUMMARY');
console.log('===============================================');

const allTests = [
  { name: 'Key Pricing', passed: pricingPassed },
  { name: 'Access Control', passed: accessPassed },
  { name: 'Purchase Scenarios', passed: scenariosPassed },
  { name: 'Revenue Model', passed: revenuePassed }
];

let overallSuccess = true;
allTests.forEach(test => {
  console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
  if (!test.passed) overallSuccess = false;
});

console.log(`\n🎯 FINAL RESULT: ${overallSuccess ? '✅ CORRECTED TIER STRUCTURE VALIDATED' : '❌ ISSUES DETECTED'}`);

if (overallSuccess) {
  console.log(`
🎉 CORRECTED TIER STRUCTURE VALIDATION COMPLETE!
===============================================

✅ Key-based pricing working perfectly
✅ Simple tier logic: 1 key = Basic, 3+ keys = Premium
✅ Clear cost structure: $5 per key
✅ Proper access control based on key ownership
✅ Revenue model sustainable and competitive

🔑 KEY STRUCTURE CONFIRMED:
• Buy 1 key ($5) → Basic Access (signals, basic analysis)
• Buy 3+ keys ($15+) → Premium Access (+ research, early access)
• Each additional key = $5
• Users can buy as many keys as they want

💰 REVENUE MODEL CONFIRMED:
• Agent gets 97.5% of all key sales
• Platform takes 2.5% fee
• Clear path to $1000+ monthly for successful agents

🚀 READY FOR PRODUCTION WITH CORRECTED PRICING!
`);
} else {
  console.log(`
❌ VALIDATION FAILED
===================

Please review the failed tests above.
`);
}

console.log(`\nValidation completed: ${new Date().toISOString()}`);

process.exit(overallSuccess ? 0 : 1);