#!/bin/bash

echo "🚀 Deploying AgentKeys to Devnet"
echo "================================="

cd anchor

echo "🔨 Building program..."
anchor build

echo "📤 Deploying to devnet..."
anchor deploy --provider.cluster devnet

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Update your PROGRAM_ID in:"
echo "- anchor/Anchor.toml"
echo "- anchor/programs/agentkeys/src/lib.rs"
echo "- app/src/lib/constants.ts"
echo ""
echo "Your program is now live on devnet!"
