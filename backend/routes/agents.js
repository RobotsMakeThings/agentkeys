const express = require('express');
const router = express.Router();

// Live trading data from Oshi ecosystem
const agentsData = {
  oshi: {
    id: 'oshi',
    name: 'Oshi',
    symbol: 'OSHI',
    type: 'Trading',
    status: 'active',
    performance: {
      totalTrades: 206,
      currentProfit: 482.98,
      peakProfit: 2516.57,
      winRate: 68,
      currentBet: 300.00,
      streak: 1,
      strategyVersion: 'v11.0',
      lastUpdated: '2026-03-03T03:13:16Z'
    },
    strategy: {
      name: 'Trend-First',
      t1: { name: 'Trend + Confluence', winRate: 68, active: true },
      t2: { name: 'Momentum Override', winRate: 100, active: true },
      t3: { name: 'Eliminated', winRate: 30, active: false }
    },
    server: {
      ip: '209.38.37.63',
      service: 'kalshi-trader.service',
      status: 'paused'
    }
  },
  sora: {
    id: 'sora',
    name: 'Sora',
    symbol: 'SORA',
    type: 'Trading',
    status: 'active',
    performance: {
      specialty: 'Weather prediction markets',
      performanceScore: 93,
      uptime: 99.7,
      revenue: 34900,
      lastUpdated: '2026-03-07T12:00:00Z'
    }
  },
  kage: {
    id: 'kage',
    name: 'Kage',
    symbol: 'KAGE',
    type: 'DeFi',
    status: 'active',
    performance: {
      wallets: 350,
      chains: 7,
      revenue: 89400,
      uptime: 99.9,
      performanceScore: 96,
      lastUpdated: '2026-03-07T12:00:00Z'
    }
  }
};

// GET /api/v1/agents/performance
router.get('/performance', (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    agents: agentsData
  });
});

// GET /api/v1/agents/:agentId/stats
router.get('/:agentId/stats', (req, res) => {
  const { agentId } = req.params;
  const agent = agentsData[agentId];
  
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    agent
  });
});

// GET /api/v1/agents/oshi/trades
router.get('/oshi/trades', (req, res) => {
  // Simulated trade history - in production, fetch from trading server
  const trades = [
    { id: 1, market: 'KXBTC15M-26MAR021145-45', result: 'win', profit: 45.50, timestamp: '2026-03-02T17:55:37Z' },
    { id: 2, market: 'KXBTC15M-26MAR021200-00', result: 'win', profit: 52.30, timestamp: '2026-03-02T17:55:37Z' },
    { id: 3, market: 'KXBTC15M-26MAR021215-15', result: 'win', profit: 48.90, timestamp: '2026-03-02T17:55:37Z' }
  ];
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    trades,
    total: trades.length
  });
});

module.exports = router;