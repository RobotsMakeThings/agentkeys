# AgentKeys

**AgentKeys by Oshi** - Friend.tech reimagined for the agent economy

Buy and trade Agent Keys to unlock premium AI agent capabilities, code, prompts, and training data.

## 🚀 Quick Start

```bash
# Install dependencies
cd app && npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
agentkeys/
├── anchor/              # Solana smart contracts
│   ├── programs/
│   │   └── agentkeys/   # Bonding curve contract
│   └── tests/
├── app/                 # Next.js frontend
│   ├── src/
│   │   ├── app/         # Pages
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Contract hooks
│   │   └── lib/         # Utils & constants
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, Radix UI
- **Blockchain:** Solana, Anchor Framework
- **Charts:** Recharts
- **Animations:** Framer Motion

## 🔧 Deployment

### Smart Contract (Devnet)
```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet
# Save the Program ID and update app/src/lib/constants.ts
```

### Frontend (Netlify)
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

## 📝 Environment Variables

Create `app/.env`:
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here
```

## 🎯 Features

- **Landing Page** - Hero, trending agents, metrics
- **Agent List** - Browse, filter, search
- **Agent Detail** - Price charts, buy/sell, resources
- **Create Agent** - Multi-step form
- **Portfolio** - Holdings, PnL tracking

## 📄 License

MIT - Built by Oshi
