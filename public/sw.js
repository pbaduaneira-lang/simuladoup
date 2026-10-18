// Only the offline notice is cached. Never cache sessions, API data or study pages.
const OFFLINE_CACHE = "simuladoup-offline-v1";
const OFFLINE_URL = "/offline.html";
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then((cache) => cache.add(OFFLINE_URL)),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("simuladoup-offline-") && key !== OFFLINE_CACHE,
          )
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    }),
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    event.request.mode !== "navigate" ||
    url.origin !== self.location.origin
  )
    return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const notice = await caches.match(OFFLINE_URL, {
        cacheName: OFFLINE_CACHE,
      });
      return (
        notice ||
        new Response("Conecte-se à internet para continuar no SimuladoUp.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      );
    }),
  );
});
