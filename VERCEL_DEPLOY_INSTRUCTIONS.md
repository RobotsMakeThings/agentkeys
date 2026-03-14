# 🚀 **VERCEL DEPLOYMENT - STEP BY STEP**

## **Your Repository is Ready:**
**GitHub:** https://github.com/RobotsMakeThings/agentkeys

---

## **🎯 DEPLOY TO VERCEL (5 minutes):**

### **Step 1: Import Project**
1. Go to: **https://vercel.com**
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"RobotsMakeThings/agentkeys"** repository

### **Step 2: Configure Build**
```
Project Name: agentkeys-2tier
Framework Preset: Next.js
Root Directory: app
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **Step 3: Environment Variables**
Add these in Vercel dashboard:
```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
NEXT_PUBLIC_PLATFORM_FEE=2.5
NEXT_PUBLIC_DEV_MODE=false
```

### **Step 4: Deploy**
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your live URL: `https://agentkeys-2tier.vercel.app`

### **Step 5: Test Live Site**
- [ ] Visit the live URL
- [ ] Test wallet connection
- [ ] Try key purchasing flow
- [ ] Verify tier access works
- [ ] Check mobile responsiveness

---

## **🎊 YOU'RE 5 MINUTES FROM BEING LIVE!**

Your AgentKeys 2-tier marketplace will be live at:
`https://agentkeys-2tier.vercel.app`

Ready to revolutionize AI agent monetization! 🚀