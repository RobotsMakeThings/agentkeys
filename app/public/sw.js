// AgentKeys Service Worker v1.0.0
// Provides offline functionality, caching, and background sync

const CACHE_NAME = 'agentkeys-v1.0.0';
const OFFLINE_URL = '/offline';

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/terminal',
  '/leaderboard',
  '/dashboard',
  '/offline',
  '/manifest.json',
  // Add critical CSS and JS files
];

// Cache strategies for different types of requests
const CACHE_STRATEGIES = {
  pages: 'network-first',
  api: 'network-first',
  static: 'cache-first',
  images: 'cache-first',
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('AgentKeys SW: Install event');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Cache critical resources
      try {
        await cache.addAll(PRECACHE_URLS);
        console.log('AgentKeys SW: Precache completed');
      } catch (error) {
        console.error('AgentKeys SW: Precache failed', error);
      }
      
      // Skip waiting to activate immediately
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('AgentKeys SW: Activate event');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('AgentKeys SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          })
      );
      
      // Claim all clients
      self.clients.claim();
    })()
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Determine cache strategy based on request type
    const strategy = getCacheStrategy(url);
    
    switch (strategy) {
      case 'network-first':
        return await networkFirst(request, cache);
      case 'cache-first':
        return await cacheFirst(request, cache);
      case 'network-only':
        return await fetch(request);
      default:
        return await networkFirst(request, cache);
    }
  } catch (error) {
    console.error('AgentKeys SW: Fetch error', error);
    return await getOfflineResponse(request, cache);
  }
}

function getCacheStrategy(url) {
  // API requests
  if (url.pathname.startsWith('/api/')) {
    return 'network-first';
  }
  
  // Static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf)$/)) {
    return 'cache-first';
  }
  
  // WebSocket connections
  if (url.protocol === 'ws:' || url.protocol === 'wss:') {
    return 'network-only';
  }
  
  // External resources
  if (url.origin !== location.origin) {
    return 'network-first';
  }
  
  // Default to network-first for pages
  return 'network-first';
}

async function networkFirst(request, cache) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200 && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function cacheFirst(request, cache) {
  // Check cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback to network
  const response = await fetch(request);
  
  // Cache successful responses
  if (response.status === 200 && response.type === 'basic') {
    cache.put(request, response.clone());
  }
  
  return response;
}

async function getOfflineResponse(request, cache) {
  const url = new URL(request.url);
  
  // For HTML pages, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineResponse = await cache.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback offline response
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - AgentKeys</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #040405;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 400px;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .description {
            color: #71717a;
            line-height: 1.5;
            margin-bottom: 24px;
          }
          .button {
            background: linear-gradient(135deg, #0066ff, #7c5cff);
            border: none;
            border-radius: 8px;
            color: white;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          .button:hover {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🤖</div>
          <div class="title">You're Offline</div>
          <div class="description">
            AgentKeys requires an internet connection to access real-time trading data. 
            Some cached content may still be available.
          </div>
          <button class="button" onclick="location.reload()">
            Try Again
          </button>
        </div>
      </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
  
  // For other requests, return a network error
  return Response.error();
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('AgentKeys SW: Background sync', event.tag);
  
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(syncPortfolioData());
  } else if (event.tag === 'trade-queue') {
    event.waitUntil(processPendingTrades());
  }
});

async function syncPortfolioData() {
  try {
    // Sync portfolio data when connection is restored
    const response = await fetch('/api/portfolio/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Portfolio sync failed');
    }
    
    console.log('AgentKeys SW: Portfolio data synced');
  } catch (error) {
    console.error('AgentKeys SW: Portfolio sync failed', error);
  }
}

async function processPendingTrades() {
  try {
    // Process trades queued while offline
    const trades = await getStoredTrades();
    
    for (const trade of trades) {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });
      
      if (response.ok) {
        await removeStoredTrade(trade.id);
        console.log('AgentKeys SW: Trade processed', trade.id);
      }
    }
  } catch (error) {
    console.error('AgentKeys SW: Trade processing failed', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('AgentKeys SW: Push notification received');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const { title, body, icon, badge, tag, data: notificationData } = data;
  
  const options = {
    body,
    icon: icon || '/icons/icon-192x192.png',
    badge: badge || '/icons/badge-72x72.png',
    tag,
    data: notificationData,
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/view-action.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('AgentKeys SW: Notification clicked', event.action);
  
  event.notification.close();
  
  const { action, notification } = event;
  const { data } = notification;
  
  if (action === 'dismiss') {
    return;
  }
  
  let url = '/';
  
  if (data?.url) {
    url = data.url;
  } else if (data?.agentId) {
    url = `/agent/${data.agentId}`;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if AgentKeys is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if not already open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Helper functions for IndexedDB storage
async function getStoredTrades() {
  // Implementation would use IndexedDB to retrieve pending trades
  return [];
}

async function removeStoredTrade(tradeId) {
  // Implementation would use IndexedDB to remove completed trades
  console.log('Trade removed:', tradeId);
}