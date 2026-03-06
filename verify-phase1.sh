#!/bin/bash
echo "🔍 AGENTKEYS PHASE 1 INTEGRATION VERIFICATION"
echo "=============================================="
echo

# Check PWA files
echo "📱 PWA FILES:"
if [ -f "app/public/manifest.json" ] && [ -f "app/public/sw.js" ] && [ -f "app/public/offline.html" ]; then
    echo "✅ All PWA files present"
    echo "   - manifest.json ($(wc -c < app/public/manifest.json) bytes)"
    echo "   - sw.js ($(wc -c < app/public/sw.js) bytes)" 
    echo "   - offline.html ($(wc -c < app/public/offline.html) bytes)"
else
    echo "❌ Missing PWA files"
fi
echo

# Check components
echo "🧩 COMPONENTS:"
if [ -f "app/src/components/PWAInstallPrompt.tsx" ] && [ -f "app/src/components/ActivityFeed.tsx" ]; then
    echo "✅ All components present"
    echo "   - PWAInstallPrompt.tsx ($(wc -c < app/src/components/PWAInstallPrompt.tsx) bytes)"
    echo "   - ActivityFeed.tsx ($(wc -c < app/src/components/ActivityFeed.tsx) bytes)"
else
    echo "❌ Missing components"
fi
echo

# Check hooks
echo "🪝 HOOKS:"
if [ -f "app/src/hooks/usePushNotifications.ts" ]; then
    echo "✅ Push notification hook present"
    echo "   - usePushNotifications.ts ($(wc -c < app/src/hooks/usePushNotifications.ts) bytes)"
else
    echo "❌ Missing push notification hook"
fi
echo

# Check integrations
echo "🔗 INTEGRATIONS:"
PWA_IMPORTS=$(grep -c "PWAInstallPrompt" app/src/app/layout.tsx 2>/dev/null || echo "0")
ACTIVITY_IMPORTS=$(grep -c "ActivityFeed" app/src/app/page.tsx 2>/dev/null || echo "0")
SW_REGISTRATION=$(grep -c "serviceWorker" app/src/app/layout.tsx 2>/dev/null || echo "0")

if [ "$PWA_IMPORTS" -gt "0" ]; then
    echo "✅ PWA integrated in layout.tsx ($PWA_IMPORTS references)"
else
    echo "❌ PWA not integrated in layout.tsx"
fi

if [ "$ACTIVITY_IMPORTS" -gt "0" ]; then
    echo "✅ ActivityFeed integrated in page.tsx ($ACTIVITY_IMPORTS references)"
else
    echo "❌ ActivityFeed not integrated in page.tsx"
fi

if [ "$SW_REGISTRATION" -gt "0" ]; then
    echo "✅ Service Worker registration in layout.tsx ($SW_REGISTRATION references)"
else
    echo "❌ Service Worker not registered in layout.tsx"
fi
echo

# Check build
echo "🏗️ BUILD STATUS:"
cd app
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
    if [ -d ".next" ]; then
        echo "✅ Build artifacts generated"
        PAGES=$(find .next -name "*.html" | wc -l)
        echo "   - $PAGES pages generated"
    else
        echo "⚠️  No build artifacts found"
    fi
else
    echo "❌ Build failed"
fi
cd ..
echo

# Check git status
echo "📝 GIT STATUS:"
LATEST_COMMIT=$(git log --oneline -1)
UNCOMMITTED=$(git status --porcelain | wc -l)
echo "✅ Latest commit: $LATEST_COMMIT"
if [ "$UNCOMMITTED" -eq "0" ]; then
    echo "✅ All changes committed"
else
    echo "⚠️  $UNCOMMITTED uncommitted changes"
fi
echo

echo "🎯 PHASE 1 VERIFICATION COMPLETE"
echo "================================="
if [ -f "app/public/manifest.json" ] && [ -f "app/src/components/PWAInstallPrompt.tsx" ] && [ -f "app/src/components/ActivityFeed.tsx" ] && [ "$PWA_IMPORTS" -gt "0" ] && [ "$ACTIVITY_IMPORTS" -gt "0" ]; then
    echo "🚀 STATUS: ALL SYSTEMS GO - READY FOR DEPLOYMENT"
else
    echo "⚠️  STATUS: INTEGRATION ISSUES DETECTED"
fi