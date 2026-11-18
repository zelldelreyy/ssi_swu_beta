/* =========================================================================
   SI 2026 — reveal.js
   Animasi masuk per-section memakai Framer Motion whileInView dengan
   viewport { once: true, amount: 0.2 }. Sentinel tak terlihat mengamati
   luas section; elemen asli dianimasikan lewat Motion.animate supaya struktur
   HTML/grid tidak diubah. Hanya opacity + transform yang disentuh.
   3D (z) dipakai hanya pada Hero / Anggota / Galeri.
   ========================================================================= */
(function () {
  "use strict";

  var SI = (window.SI = window.SI || {});
  var d = document;
  var root = d.documentElement;
  var React = null;
  var ReactDOM = null;
  var Motion = null;
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  function hasReact() {
    React = React || window.React;
    ReactDOM = ReactDOM || window.ReactDOM;
    Motion = Motion || window.Motion;
    return !!(React && ReactDOM && Motion && Motion.motion && Motion.animate);
  }
  var records = [];
  var STAGGER = 0.07;   // 70ms
  var MAX_STAGGER = 8;  // item ke-9 dst. langsung muncul

  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  function is3D(section) {
    var cls = " " + (section.className || "") + " ";
    return / hero| page-hero| anggota| member| galeri| gallery /.test(cls);
  }

  function targets(section) {
    var els = $$("[data-reveal]", section);
    if (!els.length) {
      var container = section.querySelector(":scope > .container") || section;
      els = Array.prototype.slice.call(container.children).filter(function (el) {
        return el.tagName !== "SCRIPT" && !el.classList.contains("framer-trigger");
      });
    }
    return els.filter(function (el) { return !el.closest(".framer-trigger"); });
  }

  function resetStyles(els) {
    els.forEach(function (el) {
      el.style.willChange = "";
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  function showImmediately(els) {
    els.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.willChange = "";
    });
  }

  function animateIn(els, three) {
    els.forEach(function (el, i) {
      if (!Motion || !Motion.animate) { showImmediately(els); return; }
      el.style.willChange = "transform, opacity";
      Motion.animate(
        el,
        {
          opacity: [0, 1],
          y: [16, 0],
          z: three ? [-40, 0] : [0, 0],
        },
        {
          duration: 0.46,
          delay: Math.min(i, MAX_STAGGER - 1) * STAGGER,
          ease: [0.16, 1, 0.3, 1],
          onComplete: function () {
            el.style.willChange = "";
            el.style.transform = "";
            el.style.opacity = "";
          },
        }
      );
    });
  }

  function Trigger(props) {
    return React.createElement(Motion.motion.div, {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, amount: 0.2 },
      onViewportEnter: props.onEnter,
      style: { position: "absolute", inset: 0, pointerEvents: "none" },
    });
  }

  function watch(section, rec) {
    var els = targets(section);
    rec.els = els;
    rec.three = is3D(section);

    if (reduce || !hasReact()) {
      showImmediately(els);
      return;
    }

    root.classList.add("has-framer-reveal");
    els.forEach(function (el) {
      el.style.opacity = "0";
      el.style.willChange = "transform, opacity";
    });

    if (window.getComputedStyle(section).position === "static") {
      section.style.position = "relative";
      rec.positioned = true;
    }

    var host = d.createElement("div");
    host.className = "framer-trigger";
    host.setAttribute("aria-hidden", "true");
    section.appendChild(host);
    rec.host = host;

    var reactRoot = ReactDOM.createRoot(host);
    rec.root = reactRoot;
    reactRoot.render(React.createElement(Trigger, {
      onEnter: function () { animateIn(els, rec.three); },
    }));
  }

  function mount(scope) {
    var base = scope || d.getElementById("main");
    if (!base) return;
    var sections = Array.prototype.slice.call(base.children).filter(function (el) {
      return el.tagName === "SECTION" || el.classList.contains("section");
    });
    sections.forEach(function (section) {
      if (section.getAttribute("data-framer-section")) return;
      section.setAttribute("data-framer-section", "1");
      var rec = { section: section };
      records.push(rec);
      rec.start = function () {
        /* splash-done dan timeout 3s bisa sama-sama terpicu. */
        if (rec.started) return;
        rec.started = true;
        watch(section, rec);
      };
      if (root.classList.contains("splash-pending")) {
        d.addEventListener("si:splash-done", rec.start, { once: true });
        window.setTimeout(function () {
          if (!root.classList.contains("splash-pending")) rec.start();
        }, 3000);
      } else {
        rec.start();
      }
    });
  }

  function unmount() {
    records.forEach(function (rec) {
      if (rec.start) d.removeEventListener("si:splash-done", rec.start);
      if (rec.root) {
        try { rec.root.unmount(); } catch (e) {}
      }
      if (rec.host && rec.host.parentNode) rec.host.parentNode.removeChild(rec.host);
      if (rec.els) resetStyles(rec.els);
      if (rec.positioned) rec.section.style.position = "";
      rec.section.removeAttribute("data-framer-section");
    });
    records = [];
  }

  SI.reveal = { mount: mount, unmount: unmount, hasReact: hasReact };

  if (document.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", function () { mount(); }, { once: true });
  } else {
    mount();
  }
})();
