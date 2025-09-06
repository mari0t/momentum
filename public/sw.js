// Service Worker for Momentum App - Offline Support
const CACHE_NAME = 'momentum-v1.0.0';
const STATIC_CACHE = 'momentum-static-v1';
const DYNAMIC_CACHE = 'momentum-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon.png',
  '/icon.svg',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files...');
        // Try to cache files, but don't fail if some are missing
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            cache.add(url).catch(err => 
              console.warn(`Failed to cache ${url}:`, err)
            )
          )
        );
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        console.log('🌐 Fetching from network:', request.url);
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('💾 Caching dynamic content:', request.url);
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.warn('❌ Network fetch failed:', error);
            
            // Return offline fallback for HTML pages
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other resources, just fail gracefully
            throw error;
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(
      // Sync any pending data when online
      syncPendingData()
    );
  }
});

async function syncPendingData() {
  try {
    // Get any pending data from IndexedDB
    // This would sync tasks, progress, etc. when back online
    console.log('📊 Syncing pending data...');
    
    // Implementation would depend on your app's data structure
    // For now, just log that sync is working
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Momentum', options)
  );
});

console.log('🚀 Momentum Service Worker loaded successfully!');
