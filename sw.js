self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

var timers = [];

function scheduleOne(ts, title, body, tag) {
  var delay = ts - Date.now();
  if (delay <= 0 || delay > 86400000) return;
  timers.push(setTimeout(function() {
    self.registration.showNotification(title, {
      body: body, tag: tag, renotify: true,
      vibrate: [200, 100, 200], requireInteraction: false
    });
  }, delay));
}

self.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'SCHEDULE') return;
  timers.forEach(function(t) { clearTimeout(t); });
  timers = [];

  // Pasti
  e.data.meals.forEach(function(meal) {
    scheduleOne(meal.ts, meal.title, meal.body, meal.tag);
  });

  // Integratori fissi ogni giorno
  var d = new Date();
  function ts(h, m) {
    var t = new Date(d); t.setHours(h, m, 0, 0); return t.getTime();
  }
  scheduleOne(ts(5, 55),  '💊 Creatina',  '3-5g con la colazione — buona giornata!', 'suppl-creatina');
  scheduleOne(ts(13, 20), '🐟 Omega-3',   '2g EPA+DHA con il pranzo', 'suppl-omega3');
  scheduleOne(ts(21, 15), '🌙 Magnesio',  '300mg prima di dormire — buonanotte!', 'suppl-magnesio');
});
