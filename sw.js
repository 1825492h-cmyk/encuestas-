// Guarda la app en la tablet para que funcione sin internet.
// Cuando publiques una versión nueva, cambia el número de CACHE.
const CACHE = "encuestas-v7";
const ARCHIVOS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "qrcode.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
