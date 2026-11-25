// Guarda la app en el aparato para que funcione sin internet.
// Con internet, busca primero la versión más reciente en GitHub;
// sin internet, usa la copia guardada.
const CACHE = "encuestas-v9";
const ARCHIVOS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "qrcode.js"];

self.addEventListener("install", e => {
  // Si algún archivo falta, igual se instala con los que sí estén.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARCHIVOS.map(a => c.add(a).catch(() => null)))));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const red = req.mode === "navigate" ? fetch(req) : fetch(req.url, {cache: "no-store"});
  e.respondWith(
    red.then(res => {
        if (res.ok && !res.redirected) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === "navigate" ? "index.html" : req, copia)); }
        return res;
      })
      .catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match("index.html")))
  );
});
