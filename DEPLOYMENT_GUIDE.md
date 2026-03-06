# AgentKeys Mainnet Infrastructure Deployment Guide

This guide covers the complete deployment of the AgentKeys production infrastructure, including Solana programs, backend services, database setup, and TypeScript SDK.

## 🏗️ Architecture Overview

The AgentKeys platform consists of:

1. **Solana Smart Contracts** (4 programs)
2. **Backend API Server** (Node.js + TypeScript)
3. **PostgreSQL Database** (with Redis caching)
4. **WebSocket Server** (real-time updates)
5. **TypeScript SDK** (for frontend integration)

## 📋 Prerequisites

### System Requirements
- Ubuntu 20.04+ / macOS / Windows with WSL2
- 8GB+ RAM
- 50GB+ available disk space
- Stable internet connection

### Required Software
```bash
# Rust & Solana
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/v1.18.12/install)"

# Anchor Framework
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Redis
sudo apt-get install redis-server

# PM2 (for production process management)
npm install -g pm2
```

### Solana Wallet Setup
```bash
# Generate new keypair (or use existing)
solana-keygen new --outfile ~/.config/solana/id.json

# For mainnet deployment, ensure adequate SOL balance
# Minimum 10 SOL recommended for deployment costs
```

## 🚀 Automated Deployment

### Quick Start (Recommended)
```bash
# Clone and navigate to project
cd /path/to/agentkeys

# Deploy to devnet (testing)
./deploy-infrastructure.sh devnet

# Deploy to mainnet (production)
./deploy-infrastructure.sh mainnet-beta
```

### What the Script Does
1. ✅ Validates prerequisites
2. ✅ Builds and deploys all 4 Solana programs
3. ✅ Sets up database schema and migrations
4. ✅ Configures backend services
5. ✅ Builds TypeScript SDK
6. ✅ Creates deployment summary

## 🔧 Manual Deployment (Step by Step)

### Phase 1: Solana Smart Contracts

```bash
cd contracts

# Build all programs
anchor build

# Configure network
solana config set --url https://api.mainnet-beta.solana.com  # or devnet

# Deploy programs (requires SOL for fees)
anchor deploy --program-name agentkeys
anchor deploy --program-name bonding_curve
anchor deploy --program-name treasury
anchor deploy --program-name access_control

# Note the Program IDs from deployment output
```

### Phase 2: Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres createdb agentkeys
sudo -u postgres createuser agentkeys_user
sudo -u postgres psql -c "ALTER USER agentkeys_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agentkeys TO agentkeys_user;"

# Configure environment
cd backend
cp .env.example .env

# Update .env with your settings:
# DATABASE_URL=postgresql://agentkeys_user:your_password@localhost:5432/agentkeys
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your-super-secret-key
# And add your deployed program IDs

# Install dependencies and run migrations
npm install
npm run migrate
npm run seed
```

### Phase 3: Backend Services

```bash
cd backend

# Build TypeScript
npm run build

# Start development server
npm run dev

# Or for production with PM2
pm2 start ecosystem.config.js
```

### Phase 4: TypeScript SDK

```bash
cd sdk

# Install dependencies
npm install

# Update program IDs in src/AgentKeysSDK.ts
# Build SDK
npm run build

# Publish to npm (optional)
npm publish
```

## 🗄️ Database Schema

The system uses PostgreSQL with the following key tables:

- `users` - User accounts and wallet addresses
- `agents` - Agent definitions and metadata  
- `agent_holdings` - User token balances
- `transactions` - All trading activity
- `agent_fees` - Creator fee tracking
- `access_rules` - Resource access control
- `price_history` - Historical price data
- `analytics_events` - Usage analytics

## 🌐 API Endpoints

### Core Endpoints
```
GET    /api/agents              # List agents
POST   /api/agents              # Create agent
GET    /api/agents/:id          # Get agent details
POST   /api/agents/:id/buy      # Buy keys
POST   /api/agents/:id/sell     # Sell keys

GET    /api/users/me            # User profile
GET    /api/users/me/holdings   # Portfolio
GET    /api/users/me/agents     # Created agents

POST   /api/auth/wallet         # Wallet authentication
GET    /api/market/stats        # Market statistics
GET    /api/analytics/dashboard # Analytics
```

### WebSocket Endpoints
```
/ws                             # WebSocket connection

# Subscribe to channels:
agent:AGENT_ID                  # Agent-specific updates
global:prices                   # Global price feeds
global:trades                   # Trade notifications
```

## 🔐 Security Configuration

### Environment Variables
```bash
# Backend (.env)
NODE_ENV=production
JWT_SECRET=your-256-bit-secret
DATABASE_URL=postgresql://user:pass@host:5432/agentkeys
REDIS_URL=redis://localhost:6379
API_RATE_LIMIT=1000
WS_MAX_CONNECTIONS=1000

# Solana Program IDs (from deployment)
AGENTKEYS_PROGRAM_ID=Your_Deployed_Program_ID
BONDING_CURVE_PROGRAM_ID=Your_Deployed_Program_ID
TREASURY_PROGRAM_ID=Your_Deployed_Program_ID
ACCESS_CONTROL_PROGRAM_ID=Your_Deployed_Program_ID
```

### Production Hardening
```bash
# Firewall (Ubuntu)
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3001  # API (or use nginx proxy)

# SSL Certificate (Let's Encrypt)
sudo certbot --nginx -d api.agentkeys.xyz

# Nginx Reverse Proxy
sudo apt install nginx
# Configure nginx for API and WebSocket proxying
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy AgentKeys
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install Solana
        run: sh -c "$(curl -sSfL https://release.solana.com/v1.18.12/install)"
      - name: Deploy Infrastructure
        run: ./deploy-infrastructure.sh mainnet-beta
        env:
          SOLANA_KEYPAIR: ${{ secrets.SOLANA_KEYPAIR }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## 📊 Monitoring & Maintenance

### Health Monitoring
```bash
# API Health Check
curl https://api.agentkeys.xyz/health

# Database Connection
psql $DATABASE_URL -c "SELECT 1;"

# Redis Connection  
redis-cli ping

# Program Account Status
solana account YOUR_PROGRAM_ID
```

### Log Management
```bash
# PM2 Logs
pm2 logs agentkeys-api

# System Logs
sudo journalctl -u agentkeys-api.service

# Nginx Access Logs
sudo tail -f /var/log/nginx/access.log
```

### Backup Strategy
```bash
# Database Backup
pg_dump $DATABASE_URL > agentkeys_backup_$(date +%Y%m%d).sql

# Program IDL Backup
cp target/idl/*.json backups/

# Configuration Backup
cp backend/.env backups/.env.backup
```

## 🧪 Testing

### Unit Tests
```bash
# Smart Contract Tests
cd contracts
anchor test

# Backend API Tests
cd backend
npm test

# SDK Tests
cd sdk
npm test
```

### Integration Testing
```bash
# Full deployment test on devnet
./deploy-infrastructure.sh devnet

# API endpoint testing
npm run test:integration

# Load testing
artillery run load-test.yml
```

## 🚨 Troubleshooting

### Common Issues

#### Program Deployment Fails
```bash
# Check SOL balance
solana balance

# Increase compute budget
anchor deploy --program-name agentkeys -- --max-compute-units 1400000
```

#### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check PostgreSQL service
sudo systemctl status postgresql
```

#### WebSocket Connection Problems
```bash
# Check port availability
netstat -tulpn | grep 3002

# Test WebSocket endpoint
wscat -c ws://localhost:3002/ws
```

### Performance Optimization
```bash
# Database indexing
npm run optimize-db

# Redis memory optimization
redis-cli config set maxmemory 256mb
redis-cli config set maxmemory-policy allkeys-lru

# PM2 cluster mode
pm2 start ecosystem.config.js --instances max
```

## 📞 Support

For deployment issues or questions:

1. Check the troubleshooting section
2. Review system logs for errors
3. Ensure all prerequisites are installed
4. Verify network connectivity and permissions
5. Contact the development team with deployment logs

## 🔄 Updates & Migrations

### Updating Programs
```bash
# Build new version
anchor build

# Upgrade program (requires upgrade authority)
anchor upgrade target/deploy/agentkeys.so --program-id YOUR_PROGRAM_ID
```

### Database Migrations
```bash
# Create new migration
npm run migration:create new_feature

# Apply pending migrations
npm run migrate

# Rollback if needed
npm run migrate:rollback
```

---

**⚠️ Important Notes:**
- Always test on devnet first
- Backup database before major updates
- Monitor system resources during deployment
- Keep program upgrade authorities secure
- Use environment variables for sensitive data

**🎯 Success Criteria:**
- All 4 programs deployed successfully
- Database migrations completed
- API endpoints responding correctly
- WebSocket connections functional
- SDK generating valid transactions