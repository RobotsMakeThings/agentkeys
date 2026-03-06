#!/usr/bin/env node

/**
 * Test script for Oshi integration
 * Tests all Oshi API endpoints to verify integration works
 */

const API_BASE = 'http://localhost:3001';

async function testEndpoint(endpoint, description) {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📡 Endpoint: ${endpoint}`);
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        const data = await response.json();
        
        if (!response.ok) {
            console.log(`❌ Failed: HTTP ${response.status}`);
            console.log(`   Error: ${data.error || 'Unknown error'}`);
            return false;
        }
        
        console.log(`✅ Success: HTTP ${response.status}`);
        console.log(`📊 Data keys: ${Object.keys(data).join(', ')}`);
        
        // Show sample data
        if (data.success && data.data) {
            if (data.data.name) console.log(`   Name: ${data.data.name}`);
            if (data.data.symbol) console.log(`   Symbol: ${data.data.symbol}`);
            if (data.data.currentPrice) console.log(`   Price: $${data.data.currentPrice}`);
            if (data.data.tradingStats?.winRate) console.log(`   Win Rate: ${(data.data.tradingStats.winRate * 100).toFixed(1)}%`);
            if (data.data.performanceScore) console.log(`   Performance Score: ${data.data.performanceScore}/100`);
        }
        
        return true;
    } catch (error) {
        console.log(`❌ Network Error: ${error.message}`);
        return false;
    }
}

async function testOshiIntegration() {
    console.log('🚀 Starting Oshi Integration Test');
    console.log('=====================================');
    
    const tests = [
        ['/api/oshi', 'Complete Oshi agent data'],
        ['/api/oshi/trading-stats', 'Trading statistics'],
        ['/api/oshi/social-metrics', 'Social media metrics'],
        ['/api/oshi/realtime', 'Real-time updates'],
        ['/api/oshi/performance-history?timeframe=24h', 'Performance history'],
        ['/api/agents/oshi-flagship', 'Oshi via agents API'],
        ['/api/agents', 'All agents (should include Oshi)'],
        ['/health', 'Server health check']
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const [endpoint, description] of tests) {
        if (await testEndpoint(endpoint, description)) {
            passed++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${passed}/${total} passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Oshi integration is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Check backend server and OshiService.');
    }
    
    console.log('\n💡 Next steps:');
    console.log('   1. Start the backend server: cd backend && npm run dev');
    console.log('   2. Start the frontend: cd app && npm run dev');
    console.log('   3. Visit: http://localhost:3000/agent/oshi-flagship');
    console.log('   4. Check real-time updates in the dashboard');
}

// Test WebSocket connection
async function testWebSocket() {
    console.log('\n🔌 Testing WebSocket connection...');
    
    try {
        const WebSocket = require('ws');
        const ws = new WebSocket('ws://localhost:3001/ws');
        
        ws.on('open', () => {
            console.log('✅ WebSocket connected');
            
            // Subscribe to Oshi updates
            ws.send(JSON.stringify({
                type: 'subscribe',
                data: { channel: 'oshi:realtime' }
            }));
            
            // Test real-time data request
            ws.send(JSON.stringify({
                type: 'get_oshi_realtime',
                requestId: 'test-1'
            }));
            
            setTimeout(() => {
                ws.close();
            }, 3000);
        });
        
        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log(`📨 Received: ${message.type}`);
            
            if (message.type === 'oshi_realtime') {
                console.log(`   Trading: ${message.data.isTrading ? 'Active' : 'Inactive'}`);
            }
        });
        
        ws.on('close', () => {
            console.log('🔌 WebSocket closed');
        });
        
        ws.on('error', (error) => {
            console.log(`❌ WebSocket error: ${error.message}`);
        });
        
    } catch (error) {
        console.log(`❌ WebSocket test failed: ${error.message}`);
        console.log('   Install ws: npm install ws');
    }
}

// Run tests
if (require.main === module) {
    testOshiIntegration()
        .then(() => testWebSocket())
        .catch(console.error);
}

module.exports = { testOshiIntegration, testEndpoint };