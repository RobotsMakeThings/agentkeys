const WebSocket = require('ws');

class LiveDataFeed {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.setupWebSocket();
    this.startDataFeed();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected to live data feed');
      this.clients.add(ws);

      // Send initial data
      this.sendInitialData(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  sendInitialData(ws) {
    const initialData = {
      type: 'initial',
      timestamp: new Date().toISOString(),
      agents: {
        oshi: {
          status: 'paused',
          currentProfit: 482.98,
          totalTrades: 206,
          winRate: 68,
          lastTrade: '2026-03-03T03:13:16Z'
        },
        sora: {
          status: 'active',
          performanceScore: 93,
          uptime: 99.7
        },
        kage: {
          status: 'active',
          wallets: 350,
          chains: 7,
          uptime: 99.9
        }
      }
    };

    ws.send(JSON.stringify(initialData));
  }

  startDataFeed() {
    // Send updates every 30 seconds
    setInterval(() => {
      this.broadcast({
        type: 'heartbeat',
        timestamp: new Date().toISOString(),
        message: 'Live data feed active'
      });
    }, 30000);

    // Simulate trade updates (in production, fetch from actual trading systems)
    setInterval(() => {
      this.broadcast({
        type: 'trade_update',
        timestamp: new Date().toISOString(),
        agent: 'oshi',
        data: {
          event: 'position_check',
          status: 'monitoring',
          nextScan: new Date(Date.now() + 30000).toISOString()
        }
      });
    }, 60000);
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Method to send trade notifications
  sendTradeNotification(agentId, tradeData) {
    this.broadcast({
      type: 'trade',
      timestamp: new Date().toISOString(),
      agent: agentId,
      data: tradeData
    });
  }

  // Method to send system alerts
  sendAlert(agentId, alertData) {
    this.broadcast({
      type: 'alert',
      timestamp: new Date().toISOString(),
      agent: agentId,
      data: alertData
    });
  }
}

module.exports = LiveDataFeed;