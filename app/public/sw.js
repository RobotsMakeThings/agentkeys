// AgentKeys Service Worker - PWA Support & Push Notifications

const CACHE_NAME = 'agentkeys-v1.0.0';
const OFFLINE_URL = '/offline.html';

const CACHE_ASSETS = [
  '/',
  '/about',
  '/agentkeys-logo.png',
  '/offline.html',
  '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // Handle resource requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event.data?.text());
  
  const options = {
    body: event.data?.text() || 'New activity in AgentKeys',
    icon: '/agentkeys-logo.png',
    badge: '/agentkeys-logo.png',
    tag: 'agentkeys-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/agentkeys-logo.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/agentkeys-logo.png'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.data.url = payload.url || options.data.url;
      options.tag = payload.tag || options.tag;
    } catch (e) {
      console.log('[SW] Push data is not JSON');
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('AgentKeys', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'key-purchase') {
    event.waitUntil(syncKeyPurchase());
  } else if (event.tag === 'message-send') {
    event.waitUntil(syncMessages());
  }
});

// Sync key purchases when back online
async function syncKeyPurchase() {
  try {
    const cache = await caches.open('agentkeys-offline-actions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/keys/buy')) {
        try {
          await fetch(request);
          await cache.delete(request);
          console.log('[SW] Synced key purchase');
        } catch (error) {
          console.error('[SW] Failed to sync key purchase:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync messages when back online  
async function syncMessages() {
  try {
    const cache = await caches.open('agentkeys-offline-actions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/messages')) {
        try {
          await fetch(request);
          await cache.delete(request);
          console.log('[SW] Synced message');
        } catch (error) {
          console.error('[SW] Failed to sync message:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Message sync failed:', error);
  }
}

// Handle periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'price-update') {
    event.waitUntil(updatePrices());
  }
});

// Update key prices in background
async function updatePrices() {
  try {
    const response = await fetch('/api/prices/update');
    if (response.ok) {
      console.log('[SW] Prices updated');
      
      // Notify users of significant price changes
      const data = await response.json();
      if (data.significantChanges?.length > 0) {
        for (const change of data.significantChanges) {
          await self.registration.showNotification('Price Alert', {
            body: `${change.agent} ${change.direction === 'up' ? '📈' : '📉'} ${change.percentage}%`,
            icon: '/agentkeys-logo.png',
            tag: `price-${change.agent}`,
            data: { url: `/agent/${change.id}` }
          });
        }
      }
    }
  } catch (error) {
    console.error('[SW] Price update failed:', error);
  }
}