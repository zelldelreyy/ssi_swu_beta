/* =========================================================================
   SI 2026 — nav.js
   Navigasi responsif dua tampilan:
   - >= 768px : floating pill navbar. Default = pill lebar semi-transparan;
     scroll > 50px = pill ramping & solid (Framer Motion useScroll +
     useTransform + useSpring menulis CSS var --nav-p).
   - <  768px : bottom tab bar native-style (ikon + label, indikator
     shared layout, spring lift, safe-area aware).
   Nav item desktop memakai shared-layout pill (motion layoutId="nav-pill").
   Tanpa React/Framer, CSS + markup statis tetap bekerja.
   ========================================================================= */
(function () {
  "use strict";

  var SI = (window.SI = window.SI || {});
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }
  var d = document;
  var root = d.documentElement;
  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var Motion = window.Motion;
  var header = d.querySelector(".site-header");
  var nav = d.querySelector(".nav");
  var main = d.getElementById("main");
  var isAdmin = d.body.classList.contains("admin-page");

  var reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var hasReact = !!(React && ReactDOM && Motion && Motion.motion && Motion.useScroll);
  var h = hasReact ? React.createElement : null;
  var motion = hasReact ? Motion.motion : null;
  var layoutGroup = hasReact ? Motion.LayoutGroup : null;

  /* ------------------------------------------------------------ desktop */
  if (hasReact && header) {
    var useScroll = Motion.useScroll;
    var useTransform = Motion.useTransform;
    var useSpring = Motion.useSpring;
    var useMotionValueEvent = Motion.useMotionValueEvent;

    var linksHost = d.querySelector(".nav__links");
    var links = [];
    var activeHref = null;

    if (linksHost) {
      var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      Array.prototype.forEach.call(linksHost.querySelectorAll(".nav__link"), function (a) {
        var href = a.getAttribute("href");
        links.push({
          href: href,
          label: a.textContent.replace(/\s+/g, " ").trim(),
        });
        if (a.getAttribute("aria-current") === "page") activeHref = href;
      });
      if (!activeHref) {
        links.forEach(function (l) {
          var file = l.href.split("#")[0].split("/").pop().toLowerCase();
          if (file === page) activeHref = l.href;
        });
      }
    }

    function NavLinks() {
      var hoverState = React.useState(null);
      var hover = hoverState[0];
      var setHover = hoverState[1];
      var activeState = React.useState(activeHref);
      var currentActive = activeState[0];
      var setCurrentActive = activeState[1];
      var current = hover == null ? currentActive : hover;

      React.useEffect(function () {
        function onPage(e) {
          if (e.detail && e.detail.page) setCurrentActive(e.detail.page);
        }
        d.addEventListener("si:pagechange", onPage);
        return function () {
          d.removeEventListener("si:pagechange", onPage);
        };
      }, []);

      return h(
        layoutGroup,
        { id: "desktop-nav" },
        links.map(function (l) {
          var isCurrent = l.href === current;
          var label = l.label;
          return h(
            motion.a,
            {
              key: l.href,
              href: l.href,
              className: "nav__link",
              "aria-current": l.href === currentActive ? "page" : undefined,
              onMouseEnter: function () { setHover(l.href); },
              onMouseLeave: function () { setHover(null); },
              onFocus: function () { setHover(l.href); },
              onBlur: function () { setHover(null); },
            },
            isCurrent
              ? h(motion.span, {
                  layoutId: "nav-pill",
                  className: "nav__pill",
                  "aria-hidden": "true",
                  transition: { type: "spring", stiffness: 480, damping: 40, mass: 0.7 },
                })
              : null,
            h("span", { className: "nav__label" }, label)
          );
        })
      );
    }

    function NavScroll() {
      var scrollY = useScroll().scrollY;
      var progress = useTransform(scrollY, [50, 90], [0, 1], { clamp: true });
      var smooth = useSpring(progress, { stiffness: 190, damping: 28, mass: 0.9 });

      function paint(value) {
        header.style.setProperty("--nav-p", String(Math.round(value * 1000) / 1000));
      }

      useMotionValueEvent(scrollY, "change", function (v) {
        header.classList.toggle("is-pill", v > 50);
      });
      useMotionValueEvent(reduce ? scrollY : smooth, "change", function (v) {
        paint(reduce ? (v > 50 ? 1 : 0) : v);
      });

      React.useEffect(function () {
        var y = window.scrollY || window.pageYOffset || 0;
        header.classList.toggle("is-pill", y > 50);
        paint(reduce ? (y > 50 ? 1 : 0) : Math.min(1, Math.max(0, (y - 50) / 40)));
      }, []);

      return null;
    }

    header.classList.add("nav-enhanced");
    var y0 = window.scrollY || window.pageYOffset || 0;
    header.classList.toggle("is-pill", y0 > 50);
    header.style.setProperty("--nav-p", reduce ? (y0 > 50 ? "1" : "0") : String(Math.min(1, Math.max(0, (y0 - 50) / 40))));

    try {
      if (linksHost && links.length) {
        var fallback = d.createElement("div");
        fallback.className = "nav__fallback";
        fallback.hidden = true;
        while (linksHost.firstChild) fallback.appendChild(linksHost.firstChild);
        linksHost.appendChild(fallback);

        var mount = d.createElement("div");
        mount.className = "nav__react";
        linksHost.appendChild(mount);
        linksHost.classList.add("is-enhanced");

        var linksRoot = ReactDOM.createRoot(mount);
        linksRoot.render(h(NavLinks));
      }

      var scrollHost = d.createElement("div");
      scrollHost.id = "nav-scroll-root";
      scrollHost.hidden = true;
      d.body.appendChild(scrollHost);
      ReactDOM.createRoot(scrollHost).render(h(NavScroll));
    } catch (err) {
      /* Biarkan markup statis bekerja jika React gagal. */
      header.classList.remove("nav-enhanced");
      if (linksHost) {
        linksHost.classList.remove("is-enhanced");
        var fb = linksHost.querySelector(".nav__fallback");
        var mt = linksHost.querySelector(".nav__react");
        if (fb) {
          while (fb.firstChild) linksHost.appendChild(fb.firstChild);
          fb.remove();
        }
        if (mt) mt.remove();
      }
    }
  }

  /* ------------------------------------------------------------- mobile */
  var ICONS = {
    home: {
      outline:
        '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      fill:
        '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10" fill="none"/>',
    },
    users: {
      outline:
        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      fill:
        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2z"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87V21z"/><path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none"/>',
    },
    flag: {
      outline:
        '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
      fill:
        '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    },
    image: {
      outline:
        '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
      fill:
        '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    },
    grid: {
      outline:
        '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
      fill:
        '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    },
  };

  function iconSvg(name) {
    var i = ICONS[name] || ICONS.home;
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" ' +
      'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<g class="tabbar__icon-outline">' + i.outline + "</g>" +
      '<g class="tabbar__icon-fill">' + i.fill + "</g>" +
      "</svg>"
    );
  }

  /* Urutan tab: aksi paling sering dipakai diletakkan di slot tengah
     (Anggota, Galeri, Milestone) supaya mudah dijangkau jempol.
     Beranda tetap di kiri, Menu sekunder di ujung kanan. */
  var TABS = [
    { id: "beranda", label: "Beranda", href: "index.html", icon: "home" },
    { id: "anggota", label: "Anggota", href: "anggota.html", icon: "users" },
    { id: "galeri", label: "Galeri", href: "galeri.html", icon: "image" },
    { id: "milestone", label: "Milestone", href: "milestone.html", icon: "flag" },
    { id: "menu", label: "Menu", icon: "grid" },
  ];

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var menuPages = {
    "tentang.html": 1, "playlist.html": 1, "akademik.html": 1,
    "kredit.html": 1, "pengaturan.html": 1, "admin.html": 1
  };
  var activeTab = "beranda";
  function computeActiveTab(p) {
    var id = "beranda";
    TABS.forEach(function (t) { if (t.href && t.href === p) id = t.id; });
    if (menuPages[p]) id = "menu";
    return id;
  }
  activeTab = computeActiveTab(page);

  function setPage(nextPage) {
    page = (nextPage || "index.html").toLowerCase();
    activeTab = computeActiveTab(page);
    if (linksHost && hasReact) {
      Array.prototype.forEach.call(linksHost.querySelectorAll(".nav__link"), function (a) {
        if (a.getAttribute("href") === page) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    }
  }
  SI.nav = { setPage: setPage, getPage: function () { return page; } };

  function isSamePage(href) {
    var file = href.split("#")[0].split("/").pop().toLowerCase();
    return !file || file === page;
  }

  function go(href) {
    /* Router Framer menangani transisi tanpa reload bila tersedia. */
    if (window.SI && SI.router && SI.router.hasReact) {
      SI.router.navigate(href, true);
      return;
    }
    if (reduce) {
      location.href = href;
      return;
    }
    try {
      sessionStorage.setItem("si:tab-nav", "1");
    } catch (e) {
      location.href = href;
      return;
    }
    if (main) main.classList.add("is-tab-leaving");
    window.setTimeout(function () {
      location.href = href;
    }, 200);
  }

  /* Tab bar React: indikator aktif memakai shared layout `layoutId`, ikon
     naik -2px dengan spring ringan, state aktif pindah sebelum navigasi. */
  function TabBar() {
    var activeState = React.useState(activeTab);
    var current = activeState[0];
    var setCurrent = activeState[1];
    var openState = React.useState(nav ? nav.classList.contains("is-open") : false);
    var open = openState[0];
    var setOpen = openState[1];
    React.useEffect(function () {
      if (!nav) return undefined;
      var sync = function () { setOpen(nav.classList.contains("is-open")); };
      var mo = new MutationObserver(sync);
      mo.observe(nav, { attributes: true, attributeFilter: ["class"] });
      sync();
      return function () { mo.disconnect(); };
    }, []);

    React.useEffect(function () {
      function onPage() { setCurrent(activeTab); }
      d.addEventListener("si:pagechange", onPage);
      return function () {
        d.removeEventListener("si:pagechange", onPage);
      };
    }, []);

    var shown = open ? "menu" : current;
    var slide = reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38, mass: 0.75 };
    var lift = reduce ? { duration: 0 } : { type: "spring", stiffness: 620, damping: 26, mass: 0.6 };

    function activate(t, e) {
      if (t.id === "menu") {
        e.preventDefault();
        e.stopPropagation();
        var toggle = d.querySelector(".nav__toggle");
        if (toggle) toggle.click();
        return;
      }
      e.preventDefault();
      if (isSamePage(t.href)) {
        if (window.scrollY > 2) window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      e.stopPropagation();
      setCurrent(t.id);
      go(t.href);
    }

    var items = TABS.map(function (t) {
      var isActive = t.id === shown;
      var isMenu = t.id === "menu";
      var label = T(t.label);
      var props = {
        key: t.id,
        className:
          "tabbar__item" + (isMenu ? " tabbar__item--menu" : "") + (isActive ? " is-active" : ""),
        "aria-label": isMenu ? T("Buka menu navigasi") : label,
        onClick: function (e) { activate(t, e); },
      };
      if (isMenu) {
        props.type = "button";
        props["data-tabbar-menu"] = "";
        props["aria-expanded"] = open ? "true" : "false";
        props["aria-controls"] = "nav-sheet";
      } else {
        props.href = t.href;
        if (isActive) props["aria-current"] = "page";
      }

      return h(
        isMenu ? "button" : "a",
        props,
        isActive
          ? h(motion.span, {
              layoutId: "tabbar-indicator",
              className: "tabbar__indicator",
              "aria-hidden": "true",
              transition: slide,
            })
          : null,
        h(
          "span",
          { className: "tabbar__content" },
          h(
            motion.span,
            {
              className: "tabbar__icon",
              animate: { y: isActive ? -2 : 0 },
              transition: lift,
            },
            h("span", {
              className: "tabbar__icon-svg",
              dangerouslySetInnerHTML: { __html: iconSvg(t.icon) },
            })
          ),
          h("span", { className: "tabbar__label" }, label)
        )
      );
    });

    return h(layoutGroup, { id: "tabbar-group" }, h("div", { className: "tabbar__inner" }, items));
  }

  /* Fallback tanpa React/Framer: tetap tab bar yang berfungsi. */
  function fillStaticTabBar(bar) {
    var items = TABS.map(function (t) {
      var active = t.id === activeTab;
      var inner =
        '<span class="tabbar__pill" aria-hidden="true"></span>' +
        '<span class="tabbar__content">' +
        '<span class="tabbar__icon">' + iconSvg(t.icon) + "</span>" +
        '<span class="tabbar__label">' + T(t.label) + "</span>" +
        "</span>";

      if (t.id === "menu") {
        return (
          '<button class="tabbar__item tabbar__item--menu' + (active ? " is-active" : "") + '" ' +
          'type="button" data-tabbar-menu aria-expanded="false" aria-controls="nav-sheet" ' +
          'aria-label="' + T("Buka menu navigasi") + '">' + inner + "</button>"
        );
      }
      return (
        '<a class="tabbar__item' + (active ? " is-active" : "") + '" href="' + t.href + '" ' +
        (active ? 'aria-current="page" ' : "") +
        'aria-label="' + T(t.label) + '">' + inner + "</a>"
      );
    }).join("");

    bar.innerHTML = '<div class="tabbar__inner">' + items + "</div>";

    var menuBtn = bar.querySelector("[data-tabbar-menu]");
    var toggle = d.querySelector(".nav__toggle");

    bar.addEventListener("click", function (e) {
      var link = e.target.closest(".tabbar__item");
      if (!link) return;
      if (link.hasAttribute("data-tabbar-menu")) {
        e.preventDefault();
        e.stopPropagation();
        if (toggle) toggle.click();
        return;
      }
      var href = link.getAttribute("href");
      if (!href || isSamePage(href)) {
        if (!href) return;
        e.preventDefault();
        if (href.indexOf("#") > -1) location.hash = href.split("#")[1];
        return;
      }
      e.preventDefault();
      go(href);
    });

    if (nav) {
      var sync = function () {
        var open = nav.classList.contains("is-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (menuBtn) menuBtn.classList.toggle("is-active", open || activeTab === "menu");
      };
      new MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ["class"] });
      sync();
    }
  }

  function buildTabBar() {
    if (isAdmin || d.querySelector(".tabbar")) return;
    var bar = d.createElement("nav");
    bar.className = "tabbar";
    bar.setAttribute("aria-label", "Navigasi tab");
    d.body.appendChild(bar);

    if (hasReact) {
      try {
        ReactDOM.createRoot(bar).render(h(TabBar));
        return;
      } catch (e) {
        /* jatuh ke fallback statis */
      }
    }
    fillStaticTabBar(bar);
  }

  buildTabBar();

  /* Fade in konten setelah pindah tab (hanya sekali). */
  if (main && !reduce && !isAdmin) {
    var cameFromTab = false;
    try {
      cameFromTab = sessionStorage.getItem("si:tab-nav") === "1";
      if (cameFromTab) sessionStorage.removeItem("si:tab-nav");
    } catch (e) {}
    if (cameFromTab) {
      main.classList.add("is-tab-entering");
      window.setTimeout(function () {
        main.classList.remove("is-tab-entering");
      }, 280);
    }
  }
})();
