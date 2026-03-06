# AgentKeys: Complete Setup Checklist
## From Zero to Live on Netlify

*Every step to get AgentKeys deployed and running*

---

## PHASE 1: ENVIRONMENT SETUP (30 minutes)

### 1.1 Install Prerequisites

```bash
# Run the automated setup script
cd /home/fxnction/.openclaw/workspace-forge/agentkeys
./scripts/setup.sh

# Or manually:

# 1. Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 2. Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 3. Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 4. Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.2 Verify Installation

```bash
# Check versions
rustc --version      # Should show 1.70+
solana --version     # Should show 1.18+
anchor --version     # Should show 0.29+
node --version       # Should show 20+
npm --version        # Should show 10+

# Check Solana config
solana config get
# Should show:
# - Keypair: ~/.config/solana/id.json
# - RPC URL: https://api.devnet.solana.com

# Check balance
solana balance
# Should show: 2 SOL (from airdrop)
```

### 1.3 Project Structure Verification

```bash
# Verify all files exist
ls -la anchor/programs/agentkeys/src/lib.rs
ls -la anchor/Anchor.toml
ls -la app/src/app/page.tsx
ls -la app/src/hooks/useAgentKeys.ts
ls -la scripts/setup.sh
ls -la scripts/deploy.sh
```

---

## PHASE 2: SMART CONTRACT (45 minutes)

### 2.1 Build the Contract

```bash
cd anchor

# Install dependencies
npm install

# Build the program
anchor build

# Verify build succeeded
ls -la target/deploy/agentkeys.so
```

### 2.2 Deploy to Devnet

```bash
# Deploy
anchor deploy --provider.cluster devnet

# Save the output! It will show:
# Program Id: YOUR_PROGRAM_ID_HERE

# Example output:
# Program Id: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 2.3 Update Program ID

```bash
# Copy the Program ID from deployment output
PROGRAM_ID="YOUR_PROGRAM_ID_HERE"

# Update in lib.rs
sed -i "s/declare_id!(.*/declare_id!(\"$PROGRAM_ID\");/" programs/agentkeys/src/lib.rs

# Update in Anchor.toml
sed -i "s/agentkeys = .*/agentkeys = \"$PROGRAM_ID\"/" Anchor.toml

# Rebuild with new ID
anchor build

# Redeploy (optional, for verification)
anchor deploy --provider.cluster devnet
```

### 2.4 Test the Contract

```bash
# Run tests
anchor test

# Or manually test with CLI:
# Create agent
solana program invoke --program-id $PROGRAM_ID \
  --accounts creator=$YOUR_WALLET,agent=$AGENT_PDA \
  --data "create_agent"
```

---

## PHASE 3: FRONTEND SETUP (30 minutes)

### 3.1 Install Dependencies

```bash
cd ../app

# Install all packages
npm install

# Verify installation
ls -la node_modules/@solana/wallet-adapter-react
ls -la node_modules/@coral-xyz/anchor
```

### 3.2 Update Configuration

```bash
# Update PROGRAM_ID in constants.ts
PROGRAM_ID="YOUR_PROGRAM_ID_HERE"
sed -i "s/PROGRAM_ID = new PublicKey.*/PROGRAM_ID = new PublicKey('$PROGRAM_ID');/" src/lib/constants.ts

# Create .env file
cat > .env << EOL
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_TREASURY_WALLET=$YOUR_WALLET_ADDRESS
EOL

# Add .env to .gitignore
echo ".env" >> .gitignore
```

### 3.3 Build Frontend

```bash
# Build the app
npm run build

# Check for errors
# If successful, you'll see .next/ folder
ls -la .next/
```

### 3.4 Test Locally

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:3000
# Test:
# - Wallet connection
# - View agent list
# - Create agent (if you have devnet SOL)
```

---

## PHASE 4: NETLIFY DEPLOYMENT (20 minutes)

### 4.1 Prepare for Netlify

```bash
# Create netlify.toml
cat > netlify.toml << EOL
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

[[plugins]]
  package = "@netlify/plugin-nextjs"
EOL

# Install Netlify adapter
npm install @netlify/plugin-nextjs

# Update next.config.js for static export
cat > next.config.js << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
EOL
```

### 4.2 Build for Production

```bash
# Build static site
npm run build

# Verify dist folder exists
ls -la dist/
```

### 4.3 Deploy to Netlify

**Option A: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod --dir=dist
```

**Option B: Git Push (Recommended)**
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial AgentKeys deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/agentkeys.git
git push -u origin main

# Connect GitHub to Netlify:
# 1. Go to netlify.com
# 2. "Add new site" → "Import from Git"
# 3. Select your GitHub repo
# 4. Build settings:
#    - Build command: npm run build
#    - Publish directory: dist
# 5. Add environment variables from .env
# 6. Deploy!
```

### 4.4 Configure Environment Variables on Netlify

```bash
# In Netlify dashboard → Site settings → Environment variables:

NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID
NEXT_PUBLIC_TREASURY_WALLET=YOUR_WALLET
```

### 4.5 Verify Deployment

```bash
# Check deployed site
# URL will be: https://your-site-name.netlify.app

# Test:
# 1. Site loads
# 2. Wallet connects
# 3. Can view agents
# 4. (Optional) Can create agent with devnet SOL
```

---

## PHASE 5: POST-DEPLOYMENT (30 minutes)

### 5.1 Custom Domain (Optional)

```bash
# In Netlify dashboard:
# Domain settings → Add custom domain
# Enter: agentkeys.oshi.io

# Configure DNS:
# CNAME agentkeys.oshi.io → your-site.netlify.app
```

### 5.2 SSL/HTTPS

```bash
# Netlify provides SSL automatically
# Verify: https://agentkeys.oshi.io shows secure lock
```

### 5.3 Analytics

```bash
# Add to app:
npm install @vercel/analytics

# Import in layout.tsx:
import { Analytics } from '@vercel/analytics/react'

# Add to body:
<Analytics />
```

### 5.4 Monitoring

```bash
# Netlify provides basic analytics
# For advanced monitoring:
# - Sentry for error tracking
# - LogRocket for session replay
```

---

## 📋 COMPLETE CHECKLIST

### Backend (Smart Contract)
- [ ] Rust installed
- [ ] Solana CLI installed
- [ ] Anchor installed
- [ ] Wallet created
- [ ] Devnet configured
- [ ] Contract built
- [ ] Contract deployed to devnet
- [ ] Program ID saved
- [ ] IDL generated

### Frontend
- [ ] Node.js installed
- [ ] Dependencies installed
- [ ] Program ID updated in constants
- [ ] .env file created
- [ ] App builds successfully
- [ ] App runs locally
- [ ] Wallet connects
- [ ] Can view agents

### Deployment
- [ ] Netlify account created
- [ ] Site connected to GitHub
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Site deployed successfully
- [ ] Custom domain configured (optional)
- [ ] SSL working
- [ ] Site loads correctly

### Testing
- [ ] Connect wallet on deployed site
- [ ] View agent list
- [ ] Create test agent (with devnet SOL)
- [ ] Buy keys (if agents exist)
- [ ] All functions work

---

## 🚀 QUICK START COMMANDS

```bash
# Complete setup in one go:

cd /home/fxnction/.openclaw/workspace-forge/agentkeys

# 1. Setup environment
./scripts/setup.sh

# 2. Deploy contract
cd anchor
anchor build
anchor deploy --provider.cluster devnet
# SAVE THE PROGRAM ID!

# 3. Update frontend
cd ../app
# Edit src/lib/constants.ts with new PROGRAM_ID
npm install
npm run build

# 4. Deploy to Netlify
netlify deploy --prod --dir=dist

# Done! 🎉
```

---

## ⏱️ TIME ESTIMATES

| Phase | Time |
|-------|------|
| Environment Setup | 30 min |
| Smart Contract | 45 min |
| Frontend Setup | 30 min |
| Netlify Deploy | 20 min |
| Post-Deployment | 30 min |
| **Total** | **~2.5 hours** |

---

## 🆘 TROUBLESHOOTING

### Build Errors
```bash
# Clear cache
rm -rf node_modules .next
npm install
npm run build
```

### Contract Deploy Fails
```bash
# Check balance
solana balance

# Request more SOL
solana airdrop 2

# Verify network
solana config get
```

### Netlify Build Fails
```bash
# Check build locally first
npm run build

# Verify dist folder exists
ls -la dist/

# Check netlify.toml
```

### Wallet Won't Connect
```bash
# Check Phantom/Solflare installed
# Verify on devnet
# Clear browser cache
```

---

## ✅ SUCCESS CRITERIA

- [ ] Site live on Netlify
- [ ] Custom domain (optional)
- [ ] HTTPS enabled
- [ ] Wallet connects
- [ ] Can view agents
- [ ] Can create agent
- [ ] Ready for users!

---

*Ready to deploy AgentKeys!*
