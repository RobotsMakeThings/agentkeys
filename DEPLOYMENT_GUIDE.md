# AgentKeys - Production Deployment Guide

## Overview
This guide walks through deploying the complete AgentKeys platform to production.

## Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API Gateway    │────▶│   Smart Contract│
│   (Netlify)     │     │   (Railway)      │     │   (Solana)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   Database       │
                        │   (Supabase)     │
                        └──────────────────┘
```

---

## Step 1: Smart Contract Deployment

### Prerequisites
- Solana CLI installed
- 2.5+ SOL on devnet (or mainnet for production)
- Anchor CLI installed

### Deploy to Devnet
```bash
cd anchor

# Build the contract
anchor build

# Deploy
anchor deploy --provider.cluster devnet

# Save the Program ID output
# Example: Program Id: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### Update Constants
1. Copy the deployed Program ID
2. Update `app/src/lib/constants.ts`:
```typescript
export const PROGRAM_ID = new PublicKey('YOUR_DEPLOYED_PROGRAM_ID');
```

3. Update `anchor/Anchor.toml`:
```toml
[programs.devnet]
agentkeys = "YOUR_DEPLOYED_PROGRAM_ID"
```

---

## Step 2: Database Setup (Supabase)

### Create Project
1. Go to https://supabase.com
2. Create new project
3. Save the URL and anon key

### Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or run SQL directly in Supabase dashboard
cat api-gateway/supabase/schema.sql
```

### Environment Variables
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

---

## Step 3: API Gateway Deployment

### Option A: Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app
   - Connect GitHub repo

2. **Create New Project**
   - Select "Deploy from GitHub repo"
   - Choose `RobotsMakeThings/agentkeys`
   - Set root directory: `api-gateway`

3. **Environment Variables**
   Add these in Railway dashboard:
   ```env
   NODE_ENV=production
   PORT=3001
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-service-key
   API_SECRET=random-32-char-secret
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```

4. **Deploy**
   - Railway auto-deploys on push
   - Get the deployed URL: `https://agentkeys-api.up.railway.app`

### Option B: Render

1. **Create Web Service**
   - Connect GitHub repo
   - Root directory: `api-gateway`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

2. **Add Environment Variables** (same as above)

---

## Step 4: Frontend Deployment

### Netlify Setup

1. **Connect Repository**
   - Go to https://app.netlify.com
   - "Add new site" → "Import from GitHub"
   - Select `RobotsMakeThings/agentkeys`

2. **Build Settings**
   ```
   Base directory: app
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   Add in Netlify dashboard:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
   NEXT_PUBLIC_PROGRAM_ID=your-deployed-program-id
   NEXT_PUBLIC_API_GATEWAY_URL=https://your-api-gateway-url
   ```

4. **Deploy**
   - Trigger deploy
   - Check build logs
   - Verify at `https://your-site.netlify.app`

### Force Clear Cache (If needed)
```bash
# In Netlify dashboard:
# Site settings → Build & deploy → Clear cache and deploy
```

---

## Step 5: Verification

### Checklist
- [ ] Contract deployed and ID saved
- [ ] Supabase tables created
- [ ] API Gateway responding at `/health`
- [ ] Frontend loads without errors
- [ ] Wallet connection works
- [ ] Can create agent (test on devnet)
- [ ] Can buy keys
- [ ] API key generates
- [ ] Can query agent

### Test Commands
```bash
# Test API Gateway
curl https://your-api-gateway.com/health

# Test contract (using Solana CLI)
solana account YOUR_PROGRAM_ID --url devnet
```

---

## Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Contract Deployment Fails
- Check SOL balance: `solana balance --url devnet`
- Request airdrop: `solana airdrop 2 --url devnet`

### API Gateway 500 Errors
- Check Supabase connection
- Verify environment variables
- Check Railway logs

### Frontend Not Updating
- Clear Netlify cache
- Check build logs for errors
- Verify `dist` folder is created

---

## Production Checklist

Before going live:
- [ ] Deploy contract to mainnet
- [ ] Use mainnet RPC endpoints
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Test all flows end-to-end
- [ ] Set up alerts for API Gateway
- [ ] Document API for agent creators

---

## Costs Estimate

| Service | Monthly Cost |
|---------|-------------|
| Netlify (Pro) | $19 |
| Railway (Starter) | $5 |
| Supabase (Pro) | $25 |
| Solana transactions | ~$10-50 |
| **Total** | **~$60-100/month** |

---

## Support

For issues:
1. Check logs in respective dashboards
2. Verify environment variables
3. Test locally first
4. Check GitHub Issues
