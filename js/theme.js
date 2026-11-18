/* =========================================================================
   SI 2026 — theme.js
   Dark/light benar-benar terpisah dari toggle kontras tinggi. Keduanya
   disimpan sendiri di localStorage dan bisa dikombinasikan. Tema dibaca
   oleh inline script di <head> sebelum render pertama.
   ========================================================================= */
(function () {
  "use strict";

  var SI = (window.SI = window.SI || {});
  var d = document;
  var root = d.documentElement;
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var switchingTimer = null;

  function $$ (sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }

  function syncControls(theme, contrast) {
    $$("[data-theme-toggle]").forEach(function (el) {
      var label = theme === "dark" ? T("Mode terang") : T("Mode gelap");
      el.setAttribute("aria-label", label);
      el.setAttribute("title", label);
      el.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    });
    $$("[data-setting-theme]").forEach(function (el) {
      var active = el.getAttribute("data-setting-theme") === theme;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    $$("[data-setting-contrast]").forEach(function (el) {
      var active = el.getAttribute("data-setting-contrast") === contrast;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    var meta = d.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#F4F6F8" : "#0A0E14");
  }

  function setTheme(next, animate) {
    if (next !== "dark" && next !== "light") return;
    var current = root.getAttribute("data-theme") || "dark";
    var changed = current !== next;

    if (changed && animate !== false && !reduce) root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("si:theme", next); } catch (e) {}
    syncControls(next, root.getAttribute("data-contrast") === "high" ? "high" : "normal");

    if (changed) {
      try {
        d.dispatchEvent(new CustomEvent("si:themechange", { detail: { theme: next } }));
      } catch (e) {}
    }
    if (root.classList.contains("theme-switching")) {
      if (switchingTimer) clearTimeout(switchingTimer);
      switchingTimer = setTimeout(function () {
        root.classList.remove("theme-switching");
        switchingTimer = null;
      }, 320);
    }
  }

  function toggle() {
    setTheme((root.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark", true);
  }

  function setContrast(mode) {
    if (mode === "high") root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    try { localStorage.setItem("si:contrast", mode === "high" ? "high" : "normal"); } catch (e) {}

    var btn = d.querySelector("[data-contrast-toggle]");
    if (btn) {
      btn.setAttribute("aria-pressed", mode === "high" ? "true" : "false");
      var label = mode === "high" ? T("Kontras normal") : T("Kontras tinggi");
      btn.setAttribute("title", label);
      btn.setAttribute("aria-label", label);
    }
    syncControls(root.getAttribute("data-theme") || "dark", mode);
    try {
      d.dispatchEvent(new CustomEvent("si:contrastchange", { detail: { contrast: mode } }));
    } catch (e) {}
  }

  function bind() {
    $$("[data-theme-toggle]").forEach(function (el) {
      if (el.getAttribute("data-theme-bound")) return;
      el.setAttribute("data-theme-bound", "1");
      el.addEventListener("click", toggle);
    });
    $$("[data-setting-theme]").forEach(function (el) {
      if (el.getAttribute("data-theme-bound")) return;
      el.setAttribute("data-theme-bound", "1");
      el.addEventListener("click", function () { setTheme(el.getAttribute("data-setting-theme"), true); });
    });
    $$("[data-contrast-toggle]").forEach(function (el) {
      if (el.getAttribute("data-contrast-bound")) return;
      el.setAttribute("data-contrast-bound", "1");
      el.addEventListener("click", function () {
        setContrast(root.getAttribute("data-contrast") === "high" ? "normal" : "high");
      });
    });
    $$("[data-setting-contrast]").forEach(function (el) {
      if (el.getAttribute("data-contrast-bound")) return;
      el.setAttribute("data-contrast-bound", "1");
      el.addEventListener("click", function () {
        setContrast(el.getAttribute("data-setting-contrast") === "high" ? "high" : "normal");
      });
    });
    /* Elemen baru dari transisi halaman perlu state aktif yang segar. */
    syncControls(root.getAttribute("data-theme") || "dark", root.getAttribute("data-contrast") === "high" ? "high" : "normal");
  }

  SI.theme = { setTheme: setTheme, toggle: toggle, setContrast: setContrast, bind: bind };

  bind();
  syncControls(root.getAttribute("data-theme") || "dark", root.getAttribute("data-contrast") === "high" ? "high" : "normal");
})();
