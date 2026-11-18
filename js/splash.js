/* =========================================================================
   SI 2026 — splash.js
   Welcome screen sekali per sesi. Dirender dengan React + Framer Motion
   (AnimatePresence + motion layoutId="logo") supaya logo benar-benar
   berpindah sebagai shared element dari tengah ke navbar, bukan dua elemen
   yang di-fade.

   Timeline:
     0–200ms    layar kosong #0A0E14
     200–900ms  logo scale .8→1 + fade, spring 120/14, glow cyan menyusul
     900–1700   logo layoutId ke navbar + tagline spring 140/16 (delay 100ms)
     1700–1900  tagline fade out 200ms ease
     1900–2300  background splash crossfade 400ms, hero mulai entrance
     2500       overlay dibersihkan
   ========================================================================= */
(function () {
  "use strict";

  var SI = window.SI || {};
  var d = document;
  var root = d.documentElement;
  var host = d.getElementById("splash-root");
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }
  if (!host) return;

  /* Sudah tampil sesi ini, atau reduced motion: head script sudah menandai. */
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (root.classList.contains("splash-off") || reduce) {
    if (host.parentNode) host.remove();
    return;
  }

  /* Sekali per sesi; disimpan di awal supaya reload di tengah intro tidak mengulang. */
  try { sessionStorage.setItem("si:splash-seen", "1"); } catch (e) {}

  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var Motion = window.Motion;

  function fallback() {
    root.classList.remove("splash-pending");
    root.classList.add("splash-off");
    if (host.parentNode) host.remove();
    try { d.dispatchEvent(new Event("si:splash-done")); } catch (e) {}
  }

  if (!React || !ReactDOM || !Motion || !Motion.motion) {
    fallback();
    return;
  }

  var h = React.createElement;
  var motion = Motion.motion;
  var AnimatePresence = Motion.AnimatePresence;
  var useMotionValue = Motion.useMotionValue;
  var useSpring = Motion.useSpring;
  var useTransform = Motion.useTransform;

  var T = {
    logo: 200,
    dock: 900,
    taglineOut: 1700,
    crossfade: 1900,
    end: 2500,
    skip: 500,
  };
  var SPRING_IN = { type: "spring", stiffness: 120, damping: 14 };
  var SPRING_LAYOUT = { type: "spring", stiffness: 140, damping: 16 };

  var revealed = false;
  var destroyed = false;
  var reactRoot = null;

  function revealHome() {
    if (revealed) return;
    revealed = true;
    root.classList.remove("splash-pending");
    root.classList.add("splash-logo-hidden");
    root.classList.add("splash-off");
    /* Mark navbar baru muncul setelah overlay benar-benar transparan. */
    window.setTimeout(function () { root.classList.remove("splash-logo-hidden"); }, 400);
    try { d.dispatchEvent(new Event("si:splash-done")); } catch (e) {}
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    revealHome();
    root.classList.remove("splash-logo-hidden");
    try { if (reactRoot) reactRoot.unmount(); } catch (e) {}
    reactRoot = null;
    if (host.parentNode) host.remove();
  }

  function skipNow() {
    revealHome();
    host.style.display = "none";
    window.setTimeout(destroy, 0);
  }

  function measure(el) {
    var r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function Splash(props) {
    var phaseState = React.useState(0);
    var phase = phaseState[0];
    var setPhase = phaseState[1];

    var boxState = React.useState({ left: 0, top: 0, width: 168, height: 168 });
    var box = boxState[0];
    var setBox = boxState[1];

    var readyState = React.useState(false);
    var boxReady = readyState[0];
    var setBoxReady = readyState[1];

    var centerState = React.useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    var center = centerState[0];
    var setCenter = centerState[1];

    var skipState = React.useState(false);
    var skipReady = skipState[0];
    var setSkipReady = skipState[1];

    var slotRef = React.useRef(null);
    var onEndRef = React.useRef(props.onEnd);
    var onRevealRef = React.useRef(props.onReveal);
    onEndRef.current = props.onEnd;
    onRevealRef.current = props.onReveal;

    /* ---------------------------------------------------------- timeline */
    React.useEffect(function () {
      var timers = [];
      function at(ms, fn) { timers.push(window.setTimeout(fn, ms)); }

      at(T.logo, function () { setPhase(1); });
      at(T.dock, function () { setPhase(2); });
      at(T.taglineOut, function () { setPhase(3); });
      at(T.crossfade, function () { setPhase(4); });
      at(T.end, function () {
        setPhase(5);
        onEndRef.current();
      });
      at(T.skip, function () { setSkipReady(true); });

      return function () {
        timers.forEach(function (id) { window.clearTimeout(id); });
      };
    }, []);

    /* Frame 4: mulai crossfade + lepas kunci Home supaya hero lanjut. */
    React.useEffect(function () {
      if (phase === 4) onRevealRef.current();
    }, [phase]);

    /* Ukur slot tengah lalu posisi logo navbar; perubahan box dianimasikan
       oleh Framer Motion lewat layout + layoutId. */
    React.useLayoutEffect(function () {
      var brand = d.querySelector(".brand__mark");
      if (phase < 1) return;
      if (phase < 2 && slotRef.current) {
        var sr = measure(slotRef.current);
        setBox(sr);
        setCenter({ x: sr.left + sr.width / 2, y: sr.top + sr.height / 2 });
        setBoxReady(true);
      } else if (phase < 4 && brand) {
        setBox(measure(brand));
      }
    }, [phase]);

    React.useEffect(function () {
      function onResize() {
        var brand = d.querySelector(".brand__mark");
        if (phase >= 1 && phase < 2 && slotRef.current) {
          var sr = measure(slotRef.current);
          setBox(sr);
          setCenter({ x: sr.left + sr.width / 2, y: sr.top + sr.height / 2 });
        } else if (phase >= 2 && phase < 4 && brand) {
          setBox(measure(brand));
        }
      }
      window.addEventListener("resize", onResize);
      return function () { window.removeEventListener("resize", onResize); };
    }, [phase]);

    /* ------------------------------------------- parallax background 8px */
    var rawX = useMotionValue(0);
    var rawY = useMotionValue(0);
    var mx = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.6 });
    var my = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.6 });
    var gx = useTransform(mx, function (v) { return -v * 0.6; });
    var gy = useTransform(my, function (v) { return -v * 0.6; });

    React.useEffect(function () {
      function onMove(e) {
        var x = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 16;
        var y = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 16;
        rawX.set(Math.max(-8, Math.min(8, x)));
        rawY.set(Math.max(-8, Math.min(8, y)));
      }
      window.addEventListener("pointermove", onMove, { passive: true });
      return function () { window.removeEventListener("pointermove", onMove); };
    }, []);

    /* ------------------------------------------------------------- logo */
    var logo = boxReady && phase >= 1 && phase < 5
      ? h(motion.div, {
          layoutId: "logo",
          layout: true,
          className: "splash__logo-box",
          style: {
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
          },
          transition: { layout: SPRING_LAYOUT },
        },
          h(motion.img, {
            src: "assets/logo-kelas.png",
            alt: "",
            width: 168,
            height: 168,
            decoding: "async",
            draggable: false,
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: SPRING_IN,
          })
        )
      : null;

    var glow = phase >= 1 && phase < 4
      ? h(motion.span, {
          "aria-hidden": "true",
          className: "splash__glow",
          style: { left: center.x, top: center.y },
          initial: { opacity: 0 },
          animate: { opacity: phase < 2 ? 1 : 0 },
          transition: { duration: phase < 2 ? 0.7 : 0.5, ease: "easeOut" },
        })
      : null;

    var tagline = phase >= 2 && phase < 5
      ? h(motion.p, {
          className: "splash__tagline",
          initial: { opacity: 0, y: 12 },
          animate: { opacity: phase >= 3 ? 0 : 1, y: 0 },
          transition: phase >= 3
            ? { opacity: { duration: 0.2, ease: "easeOut" } }
            : { opacity: { delay: 0.1, type: "spring", stiffness: 140, damping: 16 }, y: { delay: 0.1, type: "spring", stiffness: 140, damping: 16 } },
        }, T("Satu angkatan, satu ruang untuk bertumbuh."))
      : null;

    return h(AnimatePresence, null,
      phase < 5
        ? h(motion.div, {
            key: "splash",
            className: "splash",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": T("Intro SI 2026"),
            initial: { opacity: 1 },
            animate: { opacity: phase >= 4 ? 0 : 1 },
            exit: { opacity: 0, transition: { duration: 0 } },
            transition: phase >= 4 ? { duration: 0.4, ease: "easeOut" } : { duration: 0 },
            style: { pointerEvents: phase >= 4 ? "none" : "auto" },
          },
            h("div", { className: "splash__bg", "aria-hidden": "true" },
              h(motion.span, {
                className: "splash__blob splash__blob--cyan",
                style: { x: mx, y: my },
              }),
              h(motion.span, {
                className: "splash__blob splash__blob--gold",
                style: { x: gx, y: gy },
              }),
              h("span", { className: "splash__dust" })
            ),
            glow,
            h("div", { className: "splash__stage" },
              h("div", { className: "splash__slot", ref: slotRef, "aria-hidden": "true" }),
              tagline
            ),
            logo,
            h(motion.button, {
              className: "splash__skip",
              type: "button",
              onClick: props.onSkip,
              initial: { opacity: 0, y: 8 },
              animate: { opacity: skipReady ? 1 : 0, y: skipReady ? 0 : 8 },
              transition: { duration: 0.3, ease: "easeOut" },
              style: { pointerEvents: skipReady ? "auto" : "none" },
              tabIndex: skipReady ? 0 : -1,
              "aria-hidden": skipReady ? undefined : "true",
            }, T("Lewati intro"))
          )
        : null
    );
  }

  try {
    reactRoot = ReactDOM.createRoot(host);
    reactRoot.render(h(Splash, {
      onReveal: revealHome,
      onSkip: skipNow,
      onEnd: destroy,
    }));
  } catch (err) {
    fallback();
  }
})();
