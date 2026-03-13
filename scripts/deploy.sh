#!/bin/bash
set -e

echo "🚀 Deploying AgentKeys to production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo -e "${RED}❌ git is required but not installed.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}" >&2; exit 1; }

echo -e "${BLUE}📋 Pre-deployment checks...${NC}"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}📝 Please edit .env with your actual values before continuing${NC}"
        read -p "Press enter when ready..."
    else
        echo -e "${RED}❌ Neither .env nor .env.example found${NC}"
        exit 1
    fi
fi

# Load environment variables
source .env

# Check required environment variables
REQUIRED_VARS=("SUPABASE_URL" "SUPABASE_ANON_KEY" "RPC_ENDPOINT")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Required environment variable $var is not set${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Build frontend
echo -e "${BLUE}🔨 Building frontend...${NC}"
cd app
npm install
npm run build
cd ..

echo -e "${GREEN}✅ Frontend build complete${NC}"

# Build API
echo -e "${BLUE}🔨 Building API...${NC}"
cd api
npm install
npm run build
cd ..

echo -e "${GREEN}✅ API build complete${NC}"

# Deploy to Git
echo -e "${BLUE}📤 Committing and pushing to Git...${NC}"
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
git push origin main || git push origin master

echo -e "${GREEN}✅ Pushed to Git${NC}"

# Railway deployment (if configured)
if command -v railway >/dev/null 2>&1; then
    echo -e "${BLUE}🚂 Deploying to Railway...${NC}"
    cd api
    railway deploy
    cd ..
    echo -e "${GREEN}✅ Railway deployment complete${NC}"
else
    echo -e "${YELLOW}⚠️  Railway CLI not found. Skipping Railway deployment${NC}"
    echo -e "   Install: npm install -g @railway/cli"
fi

# Netlify deployment (if configured)
if command -v netlify >/dev/null 2>&1; then
    echo -e "${BLUE}🌐 Deploying to Netlify...${NC}"
    cd app
    netlify deploy --prod --dir=dist
    cd ..
    echo -e "${GREEN}✅ Netlify deployment complete${NC}"
else
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Skipping Netlify deployment${NC}"
    echo -e "   Install: npm install -g netlify-cli"
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${BLUE}📊 Next steps:${NC}"
echo -e "1. Configure your database with schema.sql"
echo -e "2. Set up domain names"
echo -e "3. Test the application"
echo -e "4. Monitor logs for any issues"

# Display useful URLs
if [ ! -z "$NETLIFY_SITE_URL" ]; then
    echo -e "${GREEN}🌐 Frontend URL: $NETLIFY_SITE_URL${NC}"
fi

if [ ! -z "$RAILWAY_URL" ]; then
    echo -e "${GREEN}🚂 API URL: $RAILWAY_URL${NC}"
fi