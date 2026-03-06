# Netlify Deployment Debug

## Issue: UI not showing up on deployed site

## Current Status:
- ✅ Local build works perfectly
- ✅ Static files generated correctly
- ❌ Netlify deployment shows 404

## Diagnostic Steps:

### 1. Check Site Settings in Netlify Dashboard:
- Build command: `cd app && npm ci --prefer-offline --no-audit && npm run build`
- Publish directory: `app/dist`
- Base directory: (leave empty)

### 2. Environment Variables to Add:
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
NEXT_PUBLIC_TREASURY_WALLET=YOUR_TREASURY_WALLET_HERE
```

### 3. Possible Issues:
1. **Build directory mismatch** - Netlify might not be finding app/dist
2. **Missing environment variables** - App might be failing to render
3. **Asset path issues** - Static assets not loading correctly
4. **Netlify function/plugin conflicts**

### 4. Quick Fix - Alternative Deployment:
If Netlify dashboard deployment fails, try:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy manually
cd /home/fxnction/.openclaw/workspace-forge/agentkeys/app
netlify login
netlify deploy --dir=dist --prod
```

### 5. Fallback - Alternative Deploy Config:

Create this simpler netlify.toml:
```toml
[build]
  publish = "app/dist"

# No build command - build locally first
```

Then build locally and push to git.