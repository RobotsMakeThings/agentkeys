#!/bin/bash

# AgentKeys Netlify Deployment Script
# Morpheus - Oshi Ecosystem

set -e

echo "🚀 AgentKeys Netlify Deployment"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the app directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build succeeded
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - no dist directory found"
    exit 1
fi

echo "✅ Build successful!"
echo "📂 Files ready in dist/"

# Check if netlify CLI is available
if command -v netlify &> /dev/null; then
    echo "🌐 Netlify CLI found - ready to deploy"
    echo "Run: netlify deploy --prod --dir=dist"
else
    echo "⚠️  Netlify CLI not found"
    echo "Install with: npm install -g netlify-cli"
    echo "Then run: netlify login && netlify deploy --prod --dir=dist"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Connect GitHub repo to Netlify dashboard"
echo "2. Set build command: npm install && npm run build"
echo "3. Set publish directory: dist"
echo "4. Add environment variables from .env file"
echo "5. Deploy!"

echo ""
echo "✅ AgentKeys ready for Netlify deployment!"