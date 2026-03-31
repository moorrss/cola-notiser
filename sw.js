const CACHE = 'cola-notiser-v1';
const OFFERS_URL = './offers.json';
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 timme

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// Lyssna på meddelanden från sidan
self.addEventListener('message', e => {
  if (e.data === 'CHECK_NOW') checkForNewOffers();
});

// Periodisk kontroll via setInterval simulerat med alarm-liknande logik
self.addEventListener('fetch', () => {});

async function checkForNewOffers() {
  try {
    const r = await fetch(OFFERS_URL + '?t=' + Date.now());
    if (!r.ok) return;
    const data = await r.json();
    const offers = data.offers || [];

    if (offers.length === 0) return;

    // Hämta tidigare sedda nycklar
    const cache = await caches.open(CACHE);
    const stored = await cache.match('seen-keys');
    const seen = stored ? await stored.json() : [];

    const newOffers = offers.filter(o => !seen.includes(o.key));
    if (newOffers.length === 0) return;

    // Spara nya nycklar som sedda
    const allSeen = [...new Set([...seen, ...newOffers.map(o => o.key)])];
    await cache.put('seen-keys', new Response(JSON.stringify(allSeen)));

    // Skicka notis
    const title = newOffers.length === 1
      ? `🥤 ${newOffers[0].product} på ${newOffers[0].store}!`
      : `🥤 ${newOffers.length} nya dryckserbjudanden!`;

    const body = newOffers.length === 1
      ? newOffers[0].price ? `${newOffers[0].price} — ${newOffers[0].description}` : newOffers[0].description
      : newOffers.map(o => `${o.store}: ${o.product}`).join('\n');

    await self.registration.showNotification(title, {
      body,
      icon: './icon.png',
      badge: './icon.png',
      tag: 'cola-notiser',
      renotify: true,
      data: { url: self.registration.scope }
    });
  } catch (e) {
    console.error('[SW] checkForNewOffers:', e);
  }
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
