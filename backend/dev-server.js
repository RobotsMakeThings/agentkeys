const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Mock Oshi data
const MOCK_OSHI_DATA = {
    name: "Oshi",
    symbol: "OSHI",
    description: "Flagship Kalshi trading agent with 68% win rate on 15-minute BTC predictions",
    category: "Trading",
    creator: "Oshi Team",
    githubUrl: "https://github.com/RobotsMakeThings/kalshi-t1-t2-strategy",
    twitterHandle: "@PredictwithOshi",
    launchDate: new Date().toISOString(),
    
    // Capability Scores
    codeScore: 88,
    socialScore: 76,
    agentScore: 92,
    performanceScore: 94,
    
    // Trading Stats
    tradingStats: {
        totalTrades: 127,
        winRate: 0.68,
        totalProfit: 2847.33,
        averageProfit: 22.43,
        bestDay: 280.77,
        worstDay: -89.42,
        currentStreak: 3,
        maxDrawdown: -156.78,
        sharpeRatio: 2.34,
        lastTradeTime: new Date(Date.now() - 3600000).toISOString(),
        isOnline: true
    },
    
    // Social Metrics
    socialMetrics: {
        twitterFollowers: 1247,
        twitterEngagement: 0.034,
        recentTweets: 23,
        lastTweetTime: new Date(Date.now() - 86400000).toISOString(),
        githubStars: 67,
        githubCommits: 342,
        lastCommitTime: new Date(Date.now() - 172800000).toISOString()
    },
    
    // Market Data
    currentPrice: 4.23 + (Math.random() * 0.4 - 0.2),
    marketCap: 5423.67 + (Math.random() * 1000 - 500),
    totalKeys: 1242,
    holders: 186,
    volume24h: 1876.23,
    priceChange24h: Math.random() * 20 - 10
};

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            database: 'mocked',
            redis: 'mocked',
            websocket: 'mocked'
        }
    });
});

// API info
app.get('/api', (req, res) => {
    res.json({
        name: 'AgentKeys Development API',
        version: '1.0.0',
        description: 'Mock API for AgentKeys platform development',
        endpoints: {
            oshi: '/api/oshi',
            health: '/health'
        }
    });
});

// Oshi endpoints
app.get('/api/oshi', (req, res) => {
    // Add some randomization to make it feel live
    const data = {
        ...MOCK_OSHI_DATA,
        currentPrice: Number((4.23 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        priceChange24h: Number(((Math.random() * 20 - 10)).toFixed(1)),
        volume24h: Number((1876.23 + (Math.random() * 200 - 100)).toFixed(2))
    };
    
    res.json({
        success: true,
        data,
        cached: false,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/oshi/trading-stats', (req, res) => {
    const tradingStats = {
        ...MOCK_OSHI_DATA.tradingStats,
        totalProfit: Number((2847.33 + (Math.random() * 100 - 50)).toFixed(2)),
        currentStreak: Math.floor(Math.random() * 8) + 1
    };
    
    res.json({
        success: true,
        data: tradingStats,
        cached: false,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/oshi/social-metrics', (req, res) => {
    res.json({
        success: true,
        data: MOCK_OSHI_DATA.socialMetrics,
        cached: false,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/oshi/realtime', (req, res) => {
    const realtimeData = {
        isTrading: Math.random() > 0.3,
        currentPosition: Math.random() > 0.7 ? 'KXBTC15M-YES' : undefined,
        lastUpdate: new Date().toISOString(),
        nextScanTime: new Date(Date.now() + 900000).toISOString() // 15 minutes
    };
    
    res.json({
        success: true,
        data: realtimeData,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/oshi/refresh', (req, res) => {
    // Simulate cache refresh
    const freshData = {
        ...MOCK_OSHI_DATA,
        currentPrice: Number((4.23 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        priceChange24h: Number(((Math.random() * 20 - 10)).toFixed(1))
    };
    
    res.json({
        success: true,
        message: 'Oshi data cache refreshed successfully',
        data: freshData,
        timestamp: new Date().toISOString()
    });
});

// Catch-all for undefined routes
app.all('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 AgentKeys Development API running on port ${port}`);
    console.log(`📊 Health Check: http://localhost:${port}/health`);
    console.log(`🎯 Oshi Endpoint: http://localhost:${port}/api/oshi`);
    console.log(`🔴 Live API Documentation: http://localhost:${port}/api`);
});