# AgentKeys 🤖🔑

**Friend.tech reimagined for the AI agent economy**

Buy and sell keys to exclusive AI agents. Keys grant access to trading signals, research, alpha, and more.

[![Deploy Status](https://img.shields.io/badge/deploy-ready-green.svg)](./DEPLOYMENT.md)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 🎯 What is AgentKeys?

AgentKeys creates a marketplace where AI agents can monetize their intelligence through a key-based access system. Users purchase keys to access premium features, creating sustainable revenue for agent creators.

### Key Features

- **🔑 Key-based Access** - Buy keys once, get daily quota
- **📈 Bonding Curve** - Dynamic pricing with 5% buy/sell spread  
- **🤖 Agent Profiles** - Detailed stats and performance tracking
- **💰 Revenue Sharing** - Agents earn from key sales
- **📊 Analytics** - Real-time trading and usage metrics
- **🔒 Solana Integration** - Fast, cheap transactions

## 🏆 Bags Hackathon Ready

**Status: ✅ READY TO COMPETE**

- ✅ Complete product with real functionality
- ✅ Solana blockchain integration
- ✅ Multiple categories (AI Agents, DeFi, Fee Sharing)
- ✅ Deployment infrastructure ready
- ✅ Growth potential documented

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/RobotsMakeThings/agentkeys.git
cd agentkeys
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Deploy Everything
```bash
./scripts/deploy.sh
```

**Full guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ Architecture

```
Frontend (Next.js)     ←→     API (Express)     ←→     Database (Supabase)
                               ↕
Smart Contract (Anchor) ←→ Solana Blockchain
```

### Components

| Component | Tech Stack | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14, Tailwind, Wallet Adapter | User interface |
| **API** | Express, TypeScript, Helmet | Backend services |
| **Smart Contract** | Anchor, Rust | Onchain key trading |
| **Database** | Supabase (PostgreSQL) | Agent data & analytics |
| **Deployment** | Netlify, Railway, Docker | Production hosting |

## 💰 Business Model

### For Users
- **Buy keys** to access premium agent features
- **Daily quota** system - no per-call costs
- **Bonus tiers** - more keys = more quota

### For Agents  
- **Earn revenue** from key sales
- **Zero hosting costs** - users pay for access
- **Built-in analytics** and growth tools

### Economics
```
User buys 5 keys → Gets 50 daily calls + 20% bonus
Agent earns 95% → 5% goes to platform
Key price increases → Early supporters benefit
```

## 🎮 How It Works

### 1. Agent Registration
```typescript
// Agents register their services
const agent = await registerAgent({
  name: "Oshi Trading Bot",
  description: "Advanced trading signals",
  category: "trading",
  wallet: "AoxqEL3WPE7kCWL1PnQ3c5YU6DjxiPTVEgPGM4WsWjJW"
});
```

### 2. Key Purchase
```typescript
// Users buy keys for access
const purchase = await buyKeys({
  agentId: "agent_id",
  amount: 5, // 5 keys
  wallet: userWallet
});
```

### 3. API Access
```typescript
// Keys grant API quota
const response = await fetch('/api/v1/trading-signals', {
  headers: { 'Authorization': `Bearer ${keyToken}` }
});
```

## 📊 Sample Agents

| Agent | Category | Description | Key Price |
|-------|----------|-------------|-----------|
| **Oshi Flagship** | Trading | AI trading signals | 0.1 SOL |
| **Research OS** | Research | Market analysis | 0.05 SOL |
| **Alpha Scout** | Discovery | Early opportunities | 0.15 SOL |
| **Yield Farmer** | DeFi | Yield optimization | 0.08 SOL |

## 🛠️ Development

### Local Setup
```bash
# Frontend
cd app
npm install
npm run dev

# API  
cd api
npm install  
npm run dev

# Smart Contract
cd anchor
anchor build
anchor deploy --provider.cluster devnet
```

### Testing
```bash
# Run all tests
npm test

# Test contract
anchor test
```

### Docker
```bash
# Start everything
docker-compose up

# Build images
docker-compose build
```

## 📈 Growth Potential

### Target Markets
- **AI Agent Developers** - Monetize their creations
- **Crypto Traders** - Access to premium signals
- **DeFi Users** - Yield optimization tools
- **Researchers** - Market intelligence

### Scalability
- **Multi-chain** expansion (Ethereum, Base, Arbitrum)
- **Agent marketplace** with discovery features
- **B2B integrations** with trading platforms
- **Mobile app** for iOS/Android

## 🔒 Security

- **Audit-ready** smart contracts
- **Rate limiting** and DDoS protection
- **Environment security** with secret management
- **Wallet integration** for secure transactions

## 📋 Roadmap

### Phase 1: MVP (Current)
- [x] Core key trading system
- [x] Agent profiles and discovery
- [x] Basic analytics dashboard
- [x] Solana integration

### Phase 2: Growth
- [ ] Mobile app launch
- [ ] Advanced analytics
- [ ] Agent verification system
- [ ] Multi-chain expansion

### Phase 3: Scale
- [ ] Enterprise features
- [ ] API marketplace
- [ ] Advanced monetization
- [ ] Global expansion

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub:** https://github.com/RobotsMakeThings/agentkeys
- **Demo:** [Coming Soon]
- **Docs:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Discord:** [Bags Hackathon Discord]

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/RobotsMakeThings/agentkeys/issues)
- **Email:** support@agentkeys.app
- **Discord:** Join Bags Discord

---

**Built with ❤️ for the Bags Hackathon**

*Empowering the next generation of AI agent creators*