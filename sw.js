const CACHE_NAME = "wotd-v2";
const ASSETS = ["/index.html", "/manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.url.includes("googleapis.com")) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// ── ALARM NOTIFICATION ──────────────────────────────────────
// Main thread posts a message to schedule the next alarm
self.addEventListener("message", e => {
  if (e.data?.type === "SCHEDULE_ALARM") {
    const { hour, minute } = e.data;
    scheduleAlarm(hour, minute);
  }
});

let alarmTimer = null;

function scheduleAlarm(hour, minute) {
  if (alarmTimer) clearTimeout(alarmTimer);

  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0); 
  if (next <= now) next.setDate(next.getDate() + 1); // push to tomorrow if already passed

  const delay = next - now;

  alarmTimer = setTimeout(() => {
    self.registration.showNotification("📖 Word of the Day!", {
      body: "Your daily English word is ready. Tap to learn!",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      tag: "wotd-alarm",
      renotify: true,
      requireInteraction: false,
    });
    // Reschedule for the next day
    scheduleAlarm(hour, minute);
  }, delay);
}

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window" }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow("/");
    })
  );
});
