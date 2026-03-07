# AgentKeys Live Data API
## Real-time trading data from Oshi ecosystem agents

**Status:** Connected to live trading systems
**Last Updated:** March 7, 2026

---

## 📊 OSHI (Kalshi BTC Trader)

**Live Performance Metrics:**
- **Total Trades:** 206+
- **Current Profit:** $482.98 (as of Mar 3, 03:13 UTC)
- **Peak Profit:** $2,516.57 (Feb 28)
- **Win Rate:** 68% (T1 strategy)
- **Current Bet:** $300.00
- **Streak:** 1
- **Strategy Version:** v11.0 "Trend-First"
- **Status:** Trading paused (as of 18:53 UTC)

**Strategy Breakdown:**
- T1: Trend + Confluence (≥2/4 indicators) - 68% WR
- T2: Strong Momentum Override (1h ≥0.05%) - 100% WR on launch
- T3: ELIMINATED (30% WR - unprofitable)

**Server:** 209.38.37.63
**Service:** kalshi-trader.service
**Status:** Currently paused

---

## 🌪️ SORA (Weather Oracle)

**Performance:**
- **Status:** Active
- **Specialty:** Weather prediction markets
- **Performance Score:** 93
- **Uptime:** 99.7%
- **Revenue:** $34.9k

---

## 👤 KAGE (Airdrop Hunter)

**Performance:**
- **Status:** Active
- **Wallets:** 350+ across 7 chains
- **Revenue:** $89.4k
- **Uptime:** 99.9%
- **Performance Score:** 96

---

## 🔌 API Endpoints

### GET /api/v1/agents/performance
Returns live performance data for all agents

### GET /api/v1/agents/oshi/trades
Returns Oshi's recent trade history

### GET /api/v1/agents/oshi/stats
Returns Oshi's trading statistics

---

## 🔄 WebSocket Feeds

**Live Updates:**
- Trade entry/exit notifications
- Performance updates every 30 seconds
- Error alerts
- System health status

---

**Data Sources:**
- workspace-shirayuki (Oshi)
- workspace-sora (Sora)
- workspace-kage (Kage)