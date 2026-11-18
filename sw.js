/* =========================================================================
   SI 2026 — Service Worker
   Strategi:
   - HTML: network-first (fallback cache, lalu offline.html)
   - Aset statis: stale-while-revalidate
   - admin.html sengaja tidak di-cache.
   Naikkan CACHE_VERSION setiap kali mengubah file inti agar cache lama dibuang.
   ========================================================================= */
const CACHE_VERSION = "si2026-v1.4.2";

const PRECACHE = [
  "./",
  "./index.html",
  "./tentang.html",
  "./anggota.html",
  "./milestone.html",
  "./galeri.html",
  "./playlist.html",
  "./akademik.html",
  "./kredit.html",
  "./pengaturan.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/icons/favicon-64.png",
  "./css/style.css?v=1.4.0",
  "./js/data.js",
  "./js/i18n/id.js",
  "./js/i18n/en.js",
  "./js/i18n/i18n.js",
  "./js/app.js",
  "./js/splash.js",
  "./js/nav.js",
  "./js/theme.js",
  "./js/reveal.js",
  "./js/router.js",
  "./js/vendor/react.production.min.js",
  "./js/vendor/react-dom.production.min.js",
  "./js/vendor/framer-motion.js",
  "./js/home.js",
  "./js/tentang.js",
  "./js/anggota.js",
  "./js/milestone.js",
  "./js/galeri.js",
  "./js/playlist.js",
  "./js/menfess-store.js",
  "./js/menfess.js",
  "./js/config.js",
  "./js/akademik.js",
  "./js/kredit.js",
  "./assets/logo-kelas.png",
  "./assets/logo-kelas-sm.png",
  "./assets/noise.svg",
  "./assets/playlist-cover.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // allSettled: satu file hilang tidak menggagalkan seluruh instalasi.
      return Promise.allSettled(PRECACHE.map(function (url) { return cache.add(url); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) { return key !== CACHE_VERSION; }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  // Halaman moderator: selalu langsung ke jaringan, tidak disimpan.
  if (url.pathname.endsWith("/admin.html")) return;

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }

  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirst(req) {
  var cache = await caches.open(CACHE_VERSION);
  try {
    var fresh = await fetch(req);
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    var cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    var offline = await cache.match("./offline.html");
    if (offline) return offline;
    return new Response("Offline — halaman belum tersedia di cache.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function staleWhileRevalidate(req) {
  var cache = await caches.open(CACHE_VERSION);
  var cached = await cache.match(req, { ignoreSearch: false });

  var network = fetch(req).then(function (res) {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(function () { return null; });

  if (cached) {
    // Perbarui cache di latar belakang tanpa menahan respons.
    return cached;
  }
  var fresh = await network;
  if (fresh) return fresh;
  return new Response("", { status: 504, statusText: "Offline" });
}
