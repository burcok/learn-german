// public/sw.js

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

// Push notification (örnek payload ile)
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Almanca Öğren';
  const options = {
    body: data.body || 'Yeni bir bildirim!',
    icon: '/assets/logo.svg',
    badge: '/assets/logo.svg',
    data: data.url || '/' // Bildirime tıklanınca açılacak url
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Bildirime tıklanınca
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});

// Manuel tetikleme için (örnek):
// self.registration.showNotification('Test', { body: 'Bildirim çalışıyor!' }); 