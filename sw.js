self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

var timers = [];

self.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'SCHEDULE') return;
  timers.forEach(function(t) { clearTimeout(t); });
  timers = [];
  e.data.items.forEach(function(item) {
    var delay = item.ts - Date.now();
    if (delay <= 0 || delay > 86400000) return;
    timers.push(setTimeout(function() {
      self.registration.showNotification(item.title, {
        body: item.body,
        tag: item.tag,
        renotify: true,
        vibrate: [200, 100, 200],
        requireInteraction: false
      });
    }, delay));
  });
});
