#!/bin/bash

echo "🚀 AgentKeys Setup Script"
echo "=========================="

# Check if running on WSL
if grep -q Microsoft /proc/version; then
    echo "✓ WSL detected"
fi

# Install Rust
echo "📦 Installing Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
else
    echo "✓ Rust already installed"
fi

# Install Solana CLI
echo "📦 Installing Solana CLI..."
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
else
    echo "✓ Solana CLI already installed"
fi

# Install Anchor
echo "📦 Installing Anchor..."
if ! command -v anchor &> /dev/null; then
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
else
    echo "✓ Anchor already installed"
fi

# Setup Solana keypair
echo "🔑 Setting up Solana keypair..."
if [ ! -f ~/.config/solana/id.json ]; then
    mkdir -p ~/.config/solana
    solana-keygen new --outfile ~/.config/solana/id.json --no-passphrase
fi

# Configure Solana for devnet
echo "⚙️ Configuring Solana for devnet..."
solana config set --keypair ~/.config/solana/id.json
solana config set --url devnet

# Request airdrop
echo "💰 Requesting devnet SOL..."
solana airdrop 2

# Install Node.js dependencies
echo "📦 Installing frontend dependencies..."
cd app
npm install

# Build anchor project
echo "🔨 Building Anchor project..."
cd ../anchor
anchor build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd anchor && anchor deploy --provider.cluster devnet"
echo "2. Update PROGRAM_ID in app/src/lib/constants.ts"
echo "3. cd app && npm run dev"
echo ""
echo "Your Solana address: $(solana address)"
echo "Balance: $(solana balance)"
