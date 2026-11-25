// Guarda la app en el aparato para que funcione sin internet.
// Con internet, siempre busca primero la versión más reciente en GitHub;
// sin internet, usa la copia guardada. Así las actualizaciones llegan solas.
const CACHE = "encuestas-v8";
const ARCHIVOS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "qrcode.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS.map(a => new Request(a, {cache: "reload"})))));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, {cache: "no-store"})
      .then(res => {
        if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
        return res;
      })
      .catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match("index.html")))
  );
});
