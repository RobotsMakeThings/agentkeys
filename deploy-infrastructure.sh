#!/bin/bash

# AgentKeys Infrastructure Deployment Script
# This script deploys the complete AgentKeys mainnet infrastructure

set -e

echo "🚀 AgentKeys Mainnet Infrastructure Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "contracts" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the AgentKeys project root directory"
    exit 1
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Rust/Solana
if ! command -v solana &> /dev/null; then
    print_error "Solana CLI not found. Please install Solana CLI first."
    exit 1
fi

# Check Anchor
if ! command -v anchor &> /dev/null; then
    print_error "Anchor CLI not found. Please install Anchor first."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js first."
    exit 1
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL CLI not found. Please ensure PostgreSQL is available."
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    print_warning "Redis CLI not found. Please ensure Redis is available."
fi

print_status "Prerequisites check completed"

# Set network (devnet for testing, mainnet for production)
NETWORK=${1:-devnet}
if [ "$NETWORK" != "devnet" ] && [ "$NETWORK" != "mainnet-beta" ]; then
    print_error "Invalid network. Use 'devnet' or 'mainnet-beta'"
    exit 1
fi

echo "🌐 Deploying to: $NETWORK"

# Configure Solana
print_status "Configuring Solana CLI..."
solana config set --url $([ "$NETWORK" = "mainnet-beta" ] && echo "https://api.mainnet-beta.solana.com" || echo "https://api.devnet.solana.com")

# PHASE 1: Deploy Solana Programs
echo ""
echo "📦 PHASE 1: Deploying Solana Programs"
echo "======================================"

cd contracts

# Build all programs
print_status "Building Solana programs..."
anchor build

# Deploy programs
print_status "Deploying programs to $NETWORK..."

if [ "$NETWORK" = "devnet" ]; then
    # Request airdrop for devnet deployment
    print_status "Requesting SOL airdrop for deployment..."
    solana airdrop 2
fi

# Deploy each program
echo "Deploying AgentKeys program..."
AGENTKEYS_PROGRAM_ID=$(anchor deploy --provider.cluster $NETWORK --program-name agentkeys | grep "Program Id:" | awk '{print $3}')
print_status "AgentKeys Program ID: $AGENTKEYS_PROGRAM_ID"

echo "Deploying Bonding Curve program..."
BONDING_CURVE_PROGRAM_ID=$(anchor deploy --provider.cluster $NETWORK --program-name bonding_curve | grep "Program Id:" | awk '{print $3}')
print_status "Bonding Curve Program ID: $BONDING_CURVE_PROGRAM_ID"

echo "Deploying Treasury program..."
TREASURY_PROGRAM_ID=$(anchor deploy --provider.cluster $NETWORK --program-name treasury | grep "Program Id:" | awk '{print $3}')
print_status "Treasury Program ID: $TREASURY_PROGRAM_ID"

echo "Deploying Access Control program..."
ACCESS_CONTROL_PROGRAM_ID=$(anchor deploy --provider.cluster $NETWORK --program-name access_control | grep "Program Id:" | awk '{print $3}')
print_status "Access Control Program ID: $ACCESS_CONTROL_PROGRAM_ID"

cd ..

# PHASE 2: Database Setup
echo ""
echo "🗄️  PHASE 2: Setting up Database"
echo "================================="

cd backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Database setup
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    
    # Update program IDs in .env
    sed -i "s/AGENTKEYS_PROGRAM_ID=.*/AGENTKEYS_PROGRAM_ID=$AGENTKEYS_PROGRAM_ID/" .env
    sed -i "s/BONDING_CURVE_PROGRAM_ID=.*/BONDING_CURVE_PROGRAM_ID=$BONDING_CURVE_PROGRAM_ID/" .env
    sed -i "s/TREASURY_PROGRAM_ID=.*/TREASURY_PROGRAM_ID=$TREASURY_PROGRAM_ID/" .env
    sed -i "s/ACCESS_CONTROL_PROGRAM_ID=.*/ACCESS_CONTROL_PROGRAM_ID=$ACCESS_CONTROL_PROGRAM_ID/" .env
    
    print_warning "Please update the .env file with your database and Redis URLs"
fi

# Run database migrations
if [ -n "$DATABASE_URL" ]; then
    print_status "Running database migrations..."
    npm run migrate
    
    print_status "Seeding database with initial data..."
    npm run seed
else
    print_warning "DATABASE_URL not set. Skipping database migration."
fi

cd ..

# PHASE 3: Build TypeScript SDK
echo ""
echo "📚 PHASE 3: Building TypeScript SDK"
echo "===================================="

cd sdk

print_status "Installing SDK dependencies..."
npm install

print_status "Building TypeScript SDK..."
npm run build

# Update SDK with deployed program IDs
print_status "Updating SDK with deployed program IDs..."
CONFIG_FILE="src/AgentKeysSDK.ts"

if [ "$NETWORK" = "mainnet-beta" ]; then
    sed -i "s/agentKeys: '.*'/agentKeys: '$AGENTKEYS_PROGRAM_ID'/" $CONFIG_FILE
    sed -i "s/bondingCurve: '.*'/bondingCurve: '$BONDING_CURVE_PROGRAM_ID'/" $CONFIG_FILE
    sed -i "s/treasury: '.*'/treasury: '$TREASURY_PROGRAM_ID'/" $CONFIG_FILE
    sed -i "s/accessControl: '.*'/accessControl: '$ACCESS_CONTROL_PROGRAM_ID'/" $CONFIG_FILE
fi

# Rebuild with updated IDs
npm run build

cd ..

# PHASE 4: Final Setup
echo ""
echo "🔧 PHASE 4: Final Configuration"
echo "==============================="

# Create deployment summary
print_status "Creating deployment summary..."
cat > deployment-summary.json << EOF
{
  "network": "$NETWORK",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "programs": {
    "agentkeys": "$AGENTKEYS_PROGRAM_ID",
    "bonding_curve": "$BONDING_CURVE_PROGRAM_ID",
    "treasury": "$TREASURY_PROGRAM_ID",
    "access_control": "$ACCESS_CONTROL_PROGRAM_ID"
  },
  "cluster_url": "$(solana config get | grep "RPC URL" | awk '{print $3}')",
  "wallet": "$(solana config get | grep "Keypair Path" | awk '{print $3}')"
}
EOF

# Create systemd service files for production
if [ "$NETWORK" = "mainnet-beta" ]; then
    print_status "Creating systemd service files..."
    
    cat > agentkeys-api.service << EOF
[Unit]
Description=AgentKeys API Server
After=network.target
After=postgresql.service
After=redis.service

[Service]
Type=simple
User=agentkeys
WorkingDirectory=/opt/agentkeys/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    print_warning "SystemD service file created. Install with:"
    echo "sudo mv agentkeys-api.service /etc/systemd/system/"
    echo "sudo systemctl enable agentkeys-api"
    echo "sudo systemctl start agentkeys-api"
fi

# Success message
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
print_status "Network: $NETWORK"
print_status "AgentKeys Program: $AGENTKEYS_PROGRAM_ID"
print_status "Bonding Curve Program: $BONDING_CURVE_PROGRAM_ID"
print_status "Treasury Program: $TREASURY_PROGRAM_ID"
print_status "Access Control Program: $ACCESS_CONTROL_PROGRAM_ID"

echo ""
echo "📋 Next Steps:"
echo "1. Update frontend environment variables with the program IDs"
echo "2. Configure your database connection in backend/.env"
echo "3. Set up Redis for caching"
echo "4. Configure your web server (nginx, etc.)"
echo "5. Set up SSL certificates for production"
echo "6. Configure monitoring and logging"

if [ "$NETWORK" = "devnet" ]; then
    echo ""
    print_warning "This is a DEVNET deployment. For mainnet:"
    echo "1. Ensure you have sufficient SOL for deployment"
    echo "2. Run: ./deploy-infrastructure.sh mainnet-beta"
    echo "3. Update all frontend/SDK references to mainnet"
fi

echo ""
print_status "Deployment summary saved to: deployment-summary.json"
print_status "All systems ready! 🚀"