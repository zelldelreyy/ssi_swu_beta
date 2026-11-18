/* =========================================================================
   SI 2026 — app.js
   Shared behaviour: header, nav, contrast, scroll reveal, countdown,
   member card renderer, QR, toast, vCard, share, PWA install.
   Plain script (no modules) so the site also works from file://.
   ========================================================================= */
(function () {
  "use strict";

  var SI = (window.SI = window.SI || {});
  var d = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }

  /* ---------------------------------------------------------------- icons */
  var ICONS = {
    flag: '<path d="M5 21V4m0 0h9l-1.5 4L20 8l-6 4 1.5 4H5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5Z"/><path d="M4 17h15"/><path d="M9 3v14"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 19h2v2h-2zM21 14v2M14 21v-2"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    arrow: '<path d="M4 12h16m0 0-6-6m6 6-6 6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play: '<path d="M8 5v14l11-7-11-7Z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" stroke="none"/>',
    chevronLeft: '<path d="m14 6-6 6 6 6"/>',
    chevronRight: '<path d="m10 6 6 6-6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
    mute: '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m16 9 5 6M21 9l-5 6"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z"/>',
    handshake: '<path d="M2 12l4-4 3 1 3-3 3 1 3-2 4 4v5l-4 3-3-2"/><path d="m9 9 3 3 3-3"/><path d="m12 12 2.5 2.5a2 2 0 0 0 2.8 0L20 12"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.5-.7L3 21l1.8-4.5A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/><path d="M8.5 11h7M8.5 14h4.5"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 10h18"/>',
  };
  function icon(name, cls) {
    var body = ICONS[name] || ICONS.spark;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }
  SI.icon = icon;

  /* ------------------------------------------------------------- helpers */
  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  SI.$ = $;
  SI.$$ = $$;

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  SI.escapeHtml = escapeHtml;

  function igUrl(member) {
    var handle = member && member.ig ? member.ig : (SI.CLASS ? SI.CLASS.instagram : "");
    var clean = String(handle || "").replace(/^@/, "").replace(/[^A-Za-z0-9._]/g, "");
    return { url: "https://instagram.com/" + clean, handle: "@" + clean, custom: !!(member && member.ig) };
  }
  SI.igUrl = igUrl;

  function memberCard(m, index) {
    return (
      '<button class="member-card" type="button" data-member="' + index + '" data-reveal data-tilt data-tilt-max="6" style="--i:' + (index % 4) + '" ' +
      'aria-label="' + escapeHtml(T("Lihat profil")) + " " + escapeHtml(m.name) + '">' +
        '<span class="member-card__media">' +
          '<img src="' + escapeHtml(m.photo) + '" alt="' + escapeHtml(T("Foto ") + m.name) + '" loading="lazy" decoding="async" width="900" height="600">' +
        "</span>" +
        '<span class="member-card__body">' +
          '<span class="member-card__name">' + escapeHtml(m.name) + "</span>" +
          '<span class="member-card__scan" aria-hidden="true">' + icon("qr") + "</span>" +
        "</span>" +
      "</button>"
    );
  }
  SI.memberCard = memberCard;

  function timelineItem(m, i) {
    return (
      '<li class="tl-item" data-reveal style="--i:' + i + '">' +
        '<span class="tl-item__dot" aria-hidden="true"></span>' +
        '<article class="tl-card' + (m.next ? " tl-card--next" : "") + '" data-tilt data-tilt-max="5">' +
          '<div class="tl-card__top">' +
            '<span class="tl-card__date" data-i18n="milestone.' + (i + 1) + '.label">' + escapeHtml(T("milestone." + (i + 1) + ".label")) + "</span>" +
            '<span class="tl-card__icon" aria-hidden="true">' + icon(m.icon) + "</span>" +
          "</div>" +
          '<h3 class="tl-card__title" data-i18n="milestone.' + (i + 1) + '.title">' + escapeHtml(T("milestone." + (i + 1) + ".title")) + "</h3>" +
          '<p class="tl-card__desc" data-i18n="milestone.' + (i + 1) + '.desc">' + escapeHtml(T("milestone." + (i + 1) + ".desc")) + "</p>" +
        "</article>" +
      "</li>"
    );
  }
  SI.timelineItem = timelineItem;

  /* ------------------------------------------------------------- toast */
  function toast(message) {
    var wrap = $(".toast-wrap");
    if (!wrap) {
      wrap = d.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      d.body.appendChild(wrap);
    }
    var el = d.createElement("div");
    el.className = "toast";
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(function () {
      el.style.transition = "opacity 200ms ease";
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 220);
    }, 2400);
  }
  SI.toast = toast;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = d.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      d.body.appendChild(ta);
      ta.select();
      try { d.execCommand("copy") ? resolve() : reject(new Error("copy failed")); }
      catch (e) { reject(e); }
      finally { ta.remove(); }
    });
  }
  SI.copyText = copyText;

  /* ------------------------------------------------------------- header */
  var header = $(".site-header");
  var nav = $(".nav");
  var navToggle = $(".nav__toggle");
  var sheet = $(".nav__sheet");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (sheet) {
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
  d.addEventListener("click", function (e) {
    if (nav && nav.classList.contains("is-open") && !e.target.closest(".nav") && !e.target.closest(".nav__toggle")) {
      closeNav();
    }
  });
  window.addEventListener("resize", function () { if (window.innerWidth >= 768) closeNav(); });

  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 50); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------- contrast */
  var contrastBtn = $("[data-contrast-toggle]");
  function applyContrast(mode) {
    if (mode === "high") d.documentElement.setAttribute("data-contrast", "high");
    else d.documentElement.removeAttribute("data-contrast");
    try { localStorage.setItem("si:contrast", mode); } catch (e) {}
    if (contrastBtn) {
      contrastBtn.setAttribute("aria-pressed", mode === "high" ? "true" : "false");
      contrastBtn.setAttribute("title", mode === "high" ? "Kontras normal" : "Kontras tinggi");
    }
  }
  if (contrastBtn) {
    var current = d.documentElement.getAttribute("data-contrast") === "high" ? "high" : "normal";
    applyContrast(current);
    /* theme.js adalah pemilik toggle kontras baru. Handler lama dipasang
       hanya sebagai fallback bila modul theme.js tidak tersedia. */
    d.addEventListener("DOMContentLoaded", function () {
      if (!contrastBtn.isConnected || (window.SI && SI.theme)) return;
      contrastBtn.addEventListener("click", function () {
        var next = d.documentElement.getAttribute("data-contrast") === "high" ? "normal" : "high";
        applyContrast(next);
        toast(next === "high" ? T("Mode kontras tinggi aktif") : T("Mode kontras normal"));
      });
    });
  }

  /* --------------------------------------------------- 3D tilt & depth */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function initTilt(root) {
    if (reduceMotion || !finePointer) return;
    $$("[data-tilt]", root || d).forEach(function (el) {
      if (el.getAttribute("data-tilt-bound")) return;
      el.setAttribute("data-tilt-bound", "1");

      var max = parseFloat(el.getAttribute("data-tilt-max")) || 8;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, active = false;

      function frame() {
        raf = null;
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        el.style.transform =
          "perspective(1000px) rotateX(" + cy.toFixed(2) + "deg) rotateY(" + cx.toFixed(2) +
          "deg) translateY(" + (active ? -4 : 0) + "px)";
        if (active || Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
          raf = window.requestAnimationFrame(frame);
        } else {
          el.style.transform = "";
          el.style.transition = "";
          el.style.willChange = "";
        }
      }
      function schedule() {
        if (!raf) raf = window.requestAnimationFrame(frame);
      }

      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        if (el.hasAttribute("data-reveal") && !el.classList.contains("is-in")) return;
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = px * max * 2;
        ty = -py * max * 2;
        active = true;
        el.style.transition = "none";
        el.style.willChange = "transform";
        schedule();
      });
      el.addEventListener("pointerleave", function () {
        if (!active) return;
        active = false;
        tx = 0;
        ty = 0;
        schedule();
      });
      el.addEventListener("blur", function () {
        active = false;
        tx = 0;
        ty = 0;
        schedule();
      });
    });
  }
  SI.initTilt = initTilt;

  function initDepth() {
    if (reduceMotion) return;
    var layers = $$("[data-depth]");
    var aurora = $(".aurora");
    if (!layers.length && !aurora) return;

    var px = 0.5, py = 0.5, raf = null;

    function render() {
      raf = null;
      var sy = window.pageYOffset || d.documentElement.scrollTop || 0;

      layers.forEach(function (el) {
        var depth = parseFloat(el.getAttribute("data-depth")) || 0.2;
        var mx = finePointer ? (0.5 - px) * 24 * depth : 0;
        var my = finePointer ? (0.5 - py) * 12 * depth : 0;
        var ty = Math.max(-72, Math.min(72, sy * depth * 0.22));
        el.style.transform = "translate3d(" + mx.toFixed(2) + "px," + (ty + my).toFixed(2) + "px,0)";
      });

      if (aurora) {
        var ax = finePointer ? (0.5 - px) * -12 : 0;
        var ay = finePointer ? (0.5 - py) * -12 : 0;
        aurora.style.transform = "translate3d(" + ax.toFixed(2) + "px," + ay.toFixed(2) + "px,0)";
      }
    }
    function schedule() { if (!raf) raf = window.requestAnimationFrame(render); }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", function (e) {
      px = e.clientX / Math.max(1, window.innerWidth);
      py = e.clientY / Math.max(1, window.innerHeight);
      schedule();
    }, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
  }
  initDepth();

  /* ------------------------------------------------------ scroll reveal */
  var revealIO = null;
  function primeGroups() {
    $$("[data-reveal-group]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (el, i) {
        if (el.hasAttribute("data-reveal")) el.style.setProperty("--i", i);
      });
    });
  }
  function refreshReveal() {
    primeGroups();
    initTilt();
    if (d.documentElement.classList.contains("splash-pending")) return;
    var els = $$("[data-reveal]:not(.is-in):not([data-reveal-bound])");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }
    els.forEach(function (el) {
      el.setAttribute("data-reveal-bound", "1");
      revealIO.observe(el);
    });
  }
  SI.refreshReveal = refreshReveal;
  refreshReveal();

  /* Entrance hero menunggu welcome screen selesai. */
  if (d.documentElement.classList.contains("splash-pending")) {
    var startReveal = function () { refreshReveal(); };
    d.addEventListener("si:splash-done", startReveal, { once: true });
    window.setTimeout(function () {
      if (!d.documentElement.classList.contains("splash-pending")) refreshReveal();
    }, 3000);
    window.setTimeout(refreshReveal, 6000);
  }

  /* --------------------------------------------------------- countdown */
  function pad(n) { return String(n).padStart(2, "0"); }
  function nextEvent() {
    var now = Date.now();
    var list = (SI.EVENTS || []).slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    for (var i = 0; i < list.length; i++) {
      if (new Date(list[i].date).getTime() > now) return list[i];
    }
    return list[list.length - 1] || null;
  }
  function initCountdown() {
    var root = $("[data-countdown]");
    if (!root) return;
    var ev = nextEvent();
    if (!ev) { root.hidden = true; return; }
    var titleEl = $("[data-countdown-title]", root);
    var dateEl = $("[data-countdown-date]", root);
    var fields = { d: $("[data-cd-d]", root), h: $("[data-cd-h]", root), m: $("[data-cd-m]", root), s: $("[data-cd-s]", root) };
    if (titleEl) titleEl.textContent = T(ev.title);
    var target = new Date(ev.date).getTime();
    var lang = SI.i18n && SI.i18n.get && SI.i18n.get() === "en" ? "en-US" : "id-ID";
    var fmt = new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
    if (dateEl) dateEl.textContent = fmt.format(new Date(ev.date));
    var timer;
    function tick() {
      var diff = Math.max(0, target - Date.now());
      var day = Math.floor(diff / 86400000);
      var hour = Math.floor((diff % 86400000) / 3600000);
      var min = Math.floor((diff % 3600000) / 60000);
      var sec = Math.floor((diff % 60000) / 1000);
      if (fields.d) fields.d.textContent = pad(day);
      if (fields.h) fields.h.textContent = pad(hour);
      if (fields.m) fields.m.textContent = pad(min);
      if (fields.s) fields.s.textContent = pad(sec);
      if (diff <= 0 && timer) clearInterval(timer);
    }
    tick();
    timer = setInterval(tick, 1000);
  }
  initCountdown();

  /* --------------------------------------------------------- stat count */
  function initCounts() {
    var els = $$("[data-count]");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var end = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var start = performance.now();
        function step(t) {
          var p = Math.min(1, (t - start) / 900);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { obs.observe(el); });
  }
  initCounts();
  SI.initCounts = initCounts;

  /* -------------------------------------------------------------- QR */
  function qrSvg(text) {
    if (typeof window.qrcode !== "function") return "";
    try {
      var qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      var count = qr.getModuleCount();
      var pad = 2;
      var size = count + pad * 2;
      var path = "";
      for (var r = 0; r < count; r++) {
        for (var c = 0; c < count; c++) {
          if (qr.isDark(r, c)) path += "M" + (c + pad) + " " + (r + pad) + "h1v1h-1z";
        }
      }
      return '<svg viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges" role="img" aria-label="' + escapeHtml(T("QR code Instagram")) + '" xmlns="http://www.w3.org/2000/svg"><rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + path + '" fill="#0A0E14"/></svg>';
    } catch (e) {
      return "";
    }
  }
  SI.qrSvg = qrSvg;

  /* ------------------------------------------------------- vCard dosen */
  function vcardText() {
    var a = SI.ADVISOR || {};
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:;" + a.name + ";;;",
      "FN:" + a.name,
      "ORG:" + (SI.CLASS ? SI.CLASS.campus : "") + ";Sistem Informasi 2026",
      "TEL;TYPE=CELL:" + (a.phone || ""),
      "EMAIL;TYPE=INTERNET:" + (a.email || ""),
      "ADR;TYPE=WORK:;;" + (a.office || "") + ";;;;",
      "NOTE:" + (a.hours || ""),
      "END:VCARD",
    ].join("\r\n");
  }
  SI.vcardText = vcardText;

  function initVcard() {
    var btn = $("[data-vcard]");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      try {
        var blob = new Blob([vcardText()], { type: "text/vcard;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = d.createElement("a");
        a.href = url;
        a.download = "dosen-wali-si-2026.vcf";
        d.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
        toast(T("Kontak dosen wali diunduh (.vcf)"));
      } catch (err) {
        toast(T("Browser tidak mendukung unduhan kontak"));
      }
    });
  }
  initVcard();

  /* ------------------------------------------------------------- share */
  function initShare() {
    $$("[data-share]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var data = {
          title: (SI.CLASS && SI.CLASS.name) || "SI 2026",
          text: T((SI.CLASS && SI.CLASS.tagline) || ""),
          url: location.href.split("#")[0],
        };
        if (navigator.share) {
          navigator.share(data).catch(function () {});
        } else {
          copyText(data.url).then(function () { toast(T("Link disalin ke clipboard")); })
            .catch(function () { toast(T("Salin link: ") + data.url); });
        }
      });
    });
  }
  initShare();

  /* --------------------------------------------------------------- PWA */
  var installPrompt = null;
  var installBtns = $$("[data-install]");
  function refreshInstall() {
    var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    installBtns.forEach(function (b) {
      b.hidden = standalone;
    });
  }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installPrompt = e;
    refreshInstall();
  });
  window.addEventListener("appinstalled", function () {
    installPrompt = null;
    toast(T("SI 2026 terpasang di perangkat"));
    refreshInstall();
  });
  installBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (installPrompt) {
        installPrompt.prompt();
        installPrompt.userChoice.finally(function () { installPrompt = null; });
      } else {
        toast(T("Di Chrome/Edge: menu ⋮ → Install app. Di iPhone: Share → Add to Home Screen."));
      }
    });
  });
  refreshInstall();

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  /* ------------------------------------------------------------ footer */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* -------------------------------------------------- icon hydration */
  function hydrateIcons(ctx) {
    $$("[data-icon]", ctx || d).forEach(function (el) {
      if (!el.firstElementChild) el.innerHTML = icon(el.getAttribute("data-icon"));
    });
  }
  SI.hydrateIcons = hydrateIcons;
  hydrateIcons();

  /* ------------------------------------------------- dialog helpers */
  SI.openDialog = function (dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    d.documentElement.style.overflow = "hidden";
  };
  SI.closeDialog = function (dialog) {
    if (!dialog) return;
    if (reduceMotion) {
      dialog.close ? dialog.close() : dialog.removeAttribute("open");
      d.documentElement.style.overflow = "";
      return;
    }
    dialog.classList.add("is-closing");
    setTimeout(function () {
      dialog.classList.remove("is-closing");
      if (dialog.close) dialog.close(); else dialog.removeAttribute("open");
      d.documentElement.style.overflow = "";
    }, 170);
  };
  $$("dialog").forEach(function (dialog) {
    dialog.addEventListener("close", function () { d.documentElement.style.overflow = ""; });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) SI.closeDialog(dialog);
    });
  });

  /* -------------------------------------------------- login guard note */
  // Tidak ada sistem login di v1 (out of scope). Panel moderasi admin.html
  // memakai penyimpanan lokal browser; lihat catatan di halaman tersebut.
})();
