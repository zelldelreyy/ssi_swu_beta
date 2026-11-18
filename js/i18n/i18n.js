/* =========================================================================
   SI 2026 — i18n.js
   i18n ringan tanpa reload: kamus ID/EN, deteksi browser, localStorage,
   transisi teks 150ms, dan dukungan data-i18n / data-i18n-html.
   ========================================================================= */
(function () {
  "use strict";

  var SI = (window.SI = window.SI || {});
  var d = document;
  var root = d.documentElement;
  var ID = window.SI_I18N_ID || {};
  var EN = window.SI_I18N_EN || {};
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var ATTRS = ["aria-label", "title", "placeholder", "alt"];
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  var current = "id";
  var fadeTimer = null;

  function norm(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }

  function detect() {
    try {
      var saved = localStorage.getItem("si:lang");
      if (saved === "id" || saved === "en") return saved;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "id").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "id";
  }
  current = detect();

  function dict() { return current === "en" ? EN : ID; }

  function t(key, vars) {
    var value;
    if (current === "en") {
      value = EN[key];
      if (value == null) value = key;
    } else {
      value = ID[key];
      if (value == null) value = key;
    }
    if (vars) {
      value = String(value).replace(/\{(\w+)\}/g, function (_, name) {
        return vars[name] != null ? vars[name] : "{" + name + "}";
      });
    }
    return value;
  }
  SI.t = t;

  function fileOf(pathOrHref) {
    var value = String(pathOrHref || location.pathname).split(/[?#]/)[0];
    var file = value.split("/").pop() || "index.html";
    try { file = decodeURIComponent(file); } catch (e) {}
    return file.toLowerCase() || "index.html";
  }

  function pageKey(file) {
    var base = file.replace(/\.html$/i, "");
    if (base === "index") base = "index";
    return "page." + base;
  }

  function applyDocumentMeta() {
    var key = pageKey(fileOf());
    var title = t(key + ".title");
    var desc = t(key + ".desc");
    if (title && title !== key + ".title") d.title = title;
    var metaDesc = d.querySelector('meta[name="description"]');
    if (metaDesc && desc && desc !== key + ".desc") metaDesc.setAttribute("content", desc);
    var ogLocale = d.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", current === "en" ? "en_US" : "id_ID");
  }

  function preserveWS(raw, next) {
    var lead = raw.match(/^\s*/)[0];
    var tail = raw.match(/\s*$/)[0];
    return lead + next + tail;
  }

  function translateTextNode(node) {
    var raw = node.nodeValue;
    var key = norm(raw);
    if (!key) return;
    if (current === "en") {
      var en = EN[key];
      if (en != null) {
        if (node.__siI18nOrig === undefined) node.__siI18nOrig = raw;
        node.nodeValue = preserveWS(raw, en);
      } else if (node.__siI18nOrig !== undefined) {
        node.nodeValue = node.__siI18nOrig;
        delete node.__siI18nOrig;
      }
    } else if (node.__siI18nOrig !== undefined) {
      node.nodeValue = node.__siI18nOrig;
      delete node.__siI18nOrig;
    }
  }

  function translateAttrs(el) {
    if (!el || !el.getAttribute) return;
    ATTRS.forEach(function (name) {
      var value = el.getAttribute(name);
      if (!value) return;
      var key = norm(value);
      if (current === "en") {
        var en = EN[key];
        if (en != null) {
          if (!el.__siI18nAttrs) el.__siI18nAttrs = {};
          if (el.__siI18nAttrs[name] === undefined) el.__siI18nAttrs[name] = value;
          el.setAttribute(name, en);
        } else if (el.__siI18nAttrs && el.__siI18nAttrs[name] !== undefined) {
          el.setAttribute(name, el.__siI18nAttrs[name]);
          delete el.__siI18nAttrs[name];
        }
      } else if (el.__siI18nAttrs && el.__siI18nAttrs[name] !== undefined) {
        el.setAttribute(name, el.__siI18nAttrs[name]);
        delete el.__siI18nAttrs[name];
      }
    });
  }

  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.hasAttribute && el.hasAttribute("data-no-i18n")) return true;
    if (el.closest && el.closest("[data-no-i18n]")) return true;
    return !!SKIP_TAGS[el.tagName];
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      var parent = node.parentNode;
      if (parent && parent.nodeType === 1 && !shouldSkip(parent)) translateTextNode(node);
      return;
    }
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) return;
    if (node.nodeType === 1) {
      if (node.hasAttribute("data-i18n")) {
        node.textContent = t(node.getAttribute("data-i18n"));
      }
      if (node.hasAttribute("data-i18n-html")) {
        node.innerHTML = t(node.getAttribute("data-i18n-html"));
      }
      if (node.hasAttribute("data-i18n-attr")) {
        var spec = node.getAttribute("data-i18n-attr");
        spec.split(",").forEach(function (part) {
          var bits = part.split(":");
          if (bits.length === 2) node.setAttribute(bits[0].trim(), t(bits[1].trim()));
        });
      }
      if (!shouldSkip(node)) translateAttrs(node);
    }
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) walk(children[i]);
  }

  function syncLangControls() {
    var buttons = d.querySelectorAll("[data-lang-option]");
    Array.prototype.forEach.call(buttons, function (btn) {
      var active = btn.getAttribute("data-lang-option") === current;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-active", active);
    });
    var group = d.querySelector("[data-lang-switch]");
    if (group) group.setAttribute("aria-label", t("Bahasa"));
  }

  function bindLangControls(scope) {
    var base = scope || d;
    var buttons = base.querySelectorAll ? base.querySelectorAll("[data-lang-option]") : [];
    Array.prototype.forEach.call(buttons, function (btn) {
      if (btn.getAttribute("data-lang-bound")) return;
      btn.setAttribute("data-lang-bound", "1");
      btn.addEventListener("click", function () {
        set(btn.getAttribute("data-lang-option"), true);
      });
    });
  }

  function set(lang, animate) {
    if (lang !== "id" && lang !== "en") return;
    var changed = lang !== current;
    current = lang;
    root.setAttribute("lang", lang === "en" ? "en" : "id");
    root.setAttribute("data-lang", lang);
    try { localStorage.setItem("si:lang", lang); } catch (e) {}

    if (changed && animate !== false && !reduce) {
      root.classList.add("i18n-fade");
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () { root.classList.remove("i18n-fade"); fadeTimer = null; }, 170);
    }
    applyDocumentMeta();
    walk(d.body || d.documentElement);
    syncLangControls();
    try {
      d.dispatchEvent(new CustomEvent("si:langchange", { detail: { lang: lang } }));
    } catch (e) {}
  }

  function apply(scope) {
    applyDocumentMeta();
    walk(scope || d.body || d.documentElement);
    syncLangControls();
    bindLangControls(scope);
  }

  function init() {
    current = detect();
    root.setAttribute("lang", current === "en" ? "en" : "id");
    root.setAttribute("data-lang", current);
    root.classList.remove("i18n-pending");
    applyDocumentMeta();
    walk(d.body || d.documentElement);
    syncLangControls();
    bindLangControls(d);
  }

  SI.i18n = { get: function () { return current; }, set: set, apply: apply, t: t };

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
