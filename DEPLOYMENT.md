# AgentKeys Deployment Guide

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Git configured
- Supabase account
- Railway/Netlify accounts (optional)

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

### 2. Required Services

#### Supabase (Database)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to `.env`
4. Run database schema:
   ```sql
   -- Copy contents of database/schema.sql into SQL editor
   ```

#### Solana Devnet (Optional - for testing)
```bash
# Get devnet SOL for deployment
solana airdrop 2 AoxqEL3WPE7kCWL1PnQ3c5YU6DjxiPTVEgPGM4WsWjJW
```

### 3. Deploy Everything
```bash
# Run the deploy script
./scripts/deploy.sh
```

## 🏗️ Manual Deployment

### Frontend (Netlify)

1. **Build locally:**
   ```bash
   cd app
   npm install
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Or connect GitHub:**
   - Connect repo to Netlify
   - Build settings: `cd app && npm run build`
   - Publish directory: `app/dist`

### API Backend (Railway)

1. **Build locally:**
   ```bash
   cd api
   npm install
   npm run build
   ```

2. **Deploy to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Deploy
   cd api
   railway deploy
   ```

3. **Set environment variables in Railway dashboard**

### Smart Contract (Anchor)

1. **Build and deploy:**
   ```bash
   cd anchor
   anchor build
   anchor deploy --provider.cluster devnet
   ```

2. **Update program ID in:**
   - `app/src/lib/constants.ts`
   - `.env` files

## 🔧 Configuration

### Frontend Configuration
Edit `app/src/lib/constants.ts`:
```typescript
export const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID');
export const API_BASE_URL = 'https://your-api.railway.app';
```

### API Configuration
Environment variables in `.env`:
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_key
RPC_ENDPOINT=https://api.devnet.solana.com
```

## 🌐 Custom Domains

### Frontend Domain
1. In Netlify dashboard:
   - Site settings → Domain management
   - Add custom domain
   - Configure DNS

### API Domain
1. In Railway dashboard:
   - Settings → Domains
   - Add custom domain
   - Update CORS_ORIGIN in environment

## 📊 Monitoring

### Health Checks
- Frontend: Check site loads
- API: `GET https://your-api.com/health`
- Database: Check Supabase dashboard

### Logs
```bash
# Railway logs
railway logs

# Netlify functions logs in dashboard
```

## 🔍 Troubleshooting

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
```bash
# Update CORS_ORIGIN in API environment
CORS_ORIGIN=https://your-frontend-domain.com
```

### RPC Connection Issues
```bash
# Try different RPC endpoint
RPC_ENDPOINT=https://api.mainnet-beta.solana.com  # mainnet
RPC_ENDPOINT=https://api.devnet.solana.com        # devnet
```

### Database Connection
1. Check Supabase URL and keys
2. Verify RLS policies are set correctly
3. Check if schema was applied

## 🎯 Post-Deployment

### 1. Test Core Functions
- [ ] Load homepage
- [ ] Connect wallet
- [ ] View agent profiles
- [ ] API endpoints respond

### 2. Add Sample Data
```sql
-- Add test agents in Supabase SQL editor
INSERT INTO agents (name, description, wallet, category) VALUES
('Test Agent', 'Sample agent for testing', 'WALLET_ADDRESS', 'trading');
```

### 3. Monitor Performance
- Check response times
- Monitor error rates
- Watch database usage

### 4. Submit to Bags Hackathon
- Verify onchain integration
- Document traction metrics
- Submit application

## 📱 URLs After Deployment

- **Frontend:** `https://your-site.netlify.app`
- **API:** `https://your-project.railway.app`
- **Database:** Supabase dashboard
- **GitHub:** `https://github.com/yourusername/agentkeys`

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database RLS enabled
- [ ] API authentication implemented

## 💰 Costs

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| Netlify | 100GB bandwidth | $19/month |
| Railway | $5/month usage | Pay per use |
| Supabase | 500MB DB | $25/month |
| **Total** | **~$5/month** | **~$50/month** |

## 🆘 Support

- **Issues:** Create GitHub issue
- **Discord:** Join Bags Discord
- **Docs:** Check official documentation

---

**Ready to compete in Bags Hackathon! 🏆**