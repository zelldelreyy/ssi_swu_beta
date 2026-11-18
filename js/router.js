/* =========================================================================
   SI 2026 — router.js
   Transisi antar halaman tanpa reload: fetch HTML, tukar isi #main di dalam
   AnimatePresence (fade + sedikit translateY, total ~240ms), jalankan ulang
   script halaman, perbarui title/nav/active state, lalu pushState.
   Tanpa React/Framer atau saat prefers-reduced-motion: navigasi biasa.
   ========================================================================= */
(function () {
  "use strict";

  var SI = (window.SI = window.SI || {});
  var d = document;
  var root = d.documentElement;
  var React = null;
  var ReactDOM = null;
  var Motion = null;
  var hasReact = false;
  var originalCreateRoot = null;
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var pageRoots = [];
  var addedExtras = [];
  var capturing = false;
  var loaded = {};
  var host = null;
  var routeRoot = null;
  var main = d.getElementById("main");
  var busy = false;
  var page = fileOf(location.pathname);
  var transitionMs = reduce ? 0 : 240;

  /* Pustaka bersama dimuat sekali. Sisanya (script halaman) dijalankan ulang
     setiap kali halaman itu dibuka supaya konten hasil render selalu ada. */
  var SHARED = {
    "js/vendor/react.production.min.js": 1,
    "js/vendor/react-dom.production.min.js": 1,
    "js/vendor/framer-motion.js": 1,
    "js/data.js": 1,
    "js/i18n/id.js": 1,
    "js/i18n/en.js": 1,
    "js/i18n/i18n.js": 1,
    "js/app.js": 1,
    "js/theme.js": 1,
    "js/reveal.js": 1,
    "js/router.js": 1,
    "js/splash.js": 1,
    "js/nav.js": 1,
    "js/config.js": 1,
    "js/menfess-store.js": 1,
    "js/qrcode-generator.js": 1,
  };

  Array.prototype.forEach.call(d.querySelectorAll("script[src]"), function (s) {
    loaded[s.getAttribute("src")] = 1;
  });

  function refreshReact() {
    React = React || window.React;
    ReactDOM = ReactDOM || window.ReactDOM;
    Motion = Motion || window.Motion;
    hasReact = !!(React && ReactDOM && Motion && Motion.motion && Motion.AnimatePresence);
    return hasReact;
  }

  function patchCreateRoot() {
    if (!ReactDOM || !ReactDOM.createRoot || originalCreateRoot) return;
    originalCreateRoot = ReactDOM.createRoot;
    ReactDOM.createRoot = function (container) {
      var r = originalCreateRoot.call(this, container);
      if (capturing) pageRoots.push(r);
      return r;
    };
  }

  function fileOf(pathOrHref) {
    var value = String(pathOrHref || "").split(/[?#]/)[0];
    var file = value.split("/").pop() || "index.html";
    try { file = decodeURIComponent(file); } catch (e) {}
    return file.toLowerCase() || "index.html";
  }

  function unmountPageRoots() {
    pageRoots.forEach(function (r) { try { r.unmount(); } catch (e) {} });
    pageRoots = [];
  }

  function view(node, onEnter) {
    if (!node) return null;
    var key = "page-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    return React.createElement(
      Motion.AnimatePresence,
      { mode: "wait", initial: false },
      React.createElement(Motion.motion.div, {
        key: key,
        ref: function (el) {
          if (el && node && !el.contains(node)) el.appendChild(node);
        },
        initial: reduce ? false : { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: reduce ? { opacity: 1 } : { opacity: 0, y: -8 },
        transition: { duration: reduce ? 0 : 0.12, ease: "easeOut" },
        onAnimationComplete: onEnter,
      })
    );
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (!src || loaded[src]) { resolve(); return; }
      var s = d.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = function () { loaded[src] = 1; resolve(); };
      s.onerror = function () { resolve(); };
      d.head.appendChild(s);
    });
  }

  function loadPageScripts(scripts) {
    var list = [];
    scripts.forEach(function (src) {
      if (!src || /^https?:/.test(src)) return;
      if (SHARED[src]) {
        if (!loaded[src]) list.push(src);
      } else {
        list.push(src); // script spesifik halaman: selalu dijalankan ulang
      }
    });
    var chain = Promise.resolve();
    capturing = true;
    list.forEach(function (src) {
      chain = chain.then(function () { return loadScript(src); });
    });
    return chain.then(function () { capturing = false; }, function () { capturing = false; });
  }

  function parseDocument(text) {
    var doc = new DOMParser().parseFromString(text, "text/html");
    var src = doc.getElementById("main");
    var scripts = Array.prototype.slice.call(doc.querySelectorAll("script[src]")).map(function (s) {
      return s.getAttribute("src");
    });
    /* Dialog, lightbox dan dock sering diletakkan di luar #main. Bawa
       elemen berelement-id yang belum ada di dokumen saat ini supaya script
       halaman tetap menemukannya setelah transisi. */
    var extras = [];
    Array.prototype.forEach.call(doc.body.children, function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag === "header" || tag === "footer" || tag === "main" || tag === "script" || tag === "noscript") return;
      if (!el.id || el.id === "splash-root" || d.getElementById(el.id)) return;
      extras.push(el.outerHTML);
    });
    return {
      html: src ? src.innerHTML : "",
      scripts: scripts,
      extras: extras,
      title: doc.title,
      description: (doc.querySelector('meta[name="description"]') || {}).content || "",
    };
  }

  function removeExtras() {
    addedExtras.forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    addedExtras = [];
  }

  function addExtras(htmlList) {
    (htmlList || []).forEach(function (html) {
      var box = d.createElement("div");
      box.innerHTML = html;
      while (box.firstChild) {
        var node = box.firstChild;
        addedExtras.push(node);
        d.body.appendChild(node);
      }
    });
  }

  function afterSwap(next, data, push, url) {
    main = next;
    main.id = "main";
    main.removeAttribute("data-page-main-pending");

    document.title = data.title;
    var desc = d.querySelector('meta[name="description"]');
    if (desc && data.description) desc.setAttribute("content", data.description);
    d.body.classList.toggle("admin-page", page === "admin.html");
    d.body.classList.toggle("settings-page", page === "pengaturan.html");

    removeExtras();
    addExtras(data.extras);

    if (SI.reveal) SI.reveal.unmount();
    unmountPageRoots();

    if (push) {
      try { history.pushState({ si: 1 }, "", url); } catch (e) {}
    }

    if (SI.theme) SI.theme.bind();

    loadPageScripts(data.scripts).then(function () {
      if (SI.hydrateIcons) SI.hydrateIcons(main);
      if (SI.i18n && SI.i18n.apply) SI.i18n.apply();
      if (SI.refreshReveal) SI.refreshReveal();
      if (SI.initTilt) SI.initTilt(main);
      if (SI.initCounts) SI.initCounts();
      if (SI.reveal) SI.reveal.mount(main);

      if (SI.nav && SI.nav.setPage) SI.nav.setPage(page);
      try {
        window.dispatchEvent(new CustomEvent("si:pagechange", { detail: { page: page } }));
      } catch (e) {}

      var hash = String(url || "").split("#")[1];
      if (hash) {
        var target = d.getElementById(decodeURIComponent(hash));
        if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      busy = false;
      root.classList.remove("is-route-changing");
    });
  }

  function navigate(href, push) {
    var url = new URL(href, location.href);
    var nextPage = fileOf(url.pathname);

    if (nextPage === page) {
      var hash = url.hash.replace(/^#/, "");
      if (hash) {
        var target = d.getElementById(decodeURIComponent(hash));
        if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }
      return Promise.resolve();
    }

    if (busy) return Promise.resolve();
    if (!refreshReact() || reduce || typeof fetch !== "function") {
      location.href = url.href;
      return Promise.resolve();
    }

    busy = true;
    root.classList.add("is-route-changing");

    return fetch(url.pathname + url.search, { headers: { "X-SI-Router": "1" } })
      .then(function (res) {
        if (!res || !res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then(function (text) {
        var data = parseDocument(text);
        var next = d.createElement("main");
        next.id = "page-main-pending";
        if (main) next.className = main.className;
        next.innerHTML = data.html;
        var previous = main;
        if (previous) previous.removeAttribute("id");

        page = nextPage;
        var targetUrl = url.pathname + url.search + url.hash;

        return new Promise(function (resolve) {
          var done = false;
          function finish() {
            if (done) return;
            done = true;
            if (previous && previous.parentNode) previous.parentNode.removeChild(previous);
            afterSwap(next, data, push !== false, targetUrl);
            resolve();
          }
          routeRoot.render(view(next, finish));
          /* Jaring pengaman kalau callback animasi tidak terpicu. */
          window.setTimeout(finish, transitionMs + 400);
        });
      })
      .catch(function () {
        location.href = url.href;
      });
  }

  function bind() {
    d.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target && a.target !== "_self" || a.hasAttribute("download")) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      var url;
      try { url = new URL(href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      var file = fileOf(url.pathname);
      if (file !== "index.html" && !/\.html$/.test(file) && url.pathname !== "/") return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash, true);
    });

    window.addEventListener("popstate", function () {
      navigate(location.pathname + location.search + location.hash, false);
    });
  }

  function init() {
    if (!refreshReact() || !main) return;
    patchCreateRoot();
    host = d.createElement("div");
    host.className = "route-motion";
    main.parentNode.insertBefore(host, main);
    routeRoot = ReactDOM.createRoot(host);
    routeRoot.render(view(main));
    bind();
  }

  SI.router = { navigate: navigate, fileOf: fileOf, hasReact: hasReact };

  if (document.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
