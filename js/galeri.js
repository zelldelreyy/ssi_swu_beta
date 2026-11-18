/* Galeri — infinite scroll bertahap, skeleton, lightbox */
(function () {
  "use strict";
  var SI = window.SI;
  var esc = SI.escapeHtml;
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }
  var photos = SI.GALLERY || [];

  var gallery = document.getElementById("gallery");
  var loading = document.getElementById("gallery-loading");
  var sentinel = document.getElementById("gallery-sentinel");
  var endNote = document.getElementById("gallery-end");
  var countEl = document.getElementById("gallery-count");
  var statusEl = document.getElementById("gallery-status");
  var dialog = document.getElementById("lightbox");

  var PER_PAGE = 6;
  var loaded = 0;
  var busy = false;
  var done = false;
  var visible = [];

  if (countEl) countEl.textContent = "0/" + photos.length;

  function skShot(i) {
    var h = [220, 300, 180][i % 3];
    return '<div class="sk-shot skeleton" style="height:' + h + "px\"></div>";
  }

  function shotMarkup(p, idx) {
    return (
      '<button class="shot" type="button" data-photo="' + idx + '" data-tilt data-tilt-max="5" ' +
      'aria-label="' + esc(T("Perbesar foto")) + ": " + esc(p.caption) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '" loading="lazy" decoding="async" ' +
        'width="' + (p.w || 1200) + '" height="' + (p.h || 900) + '">' +
        '<span class="shot__cap"><span>' + esc(p.caption) + "</span>" +
        '<span class="shot__date">' + esc(p.date) + "</span></span>" +
      "</button>"
    );
  }

  function updateStatus() {
    if (countEl) countEl.textContent = loaded + "/" + photos.length;
    if (statusEl) statusEl.textContent = done ? T("Semua foto sudah tampil.") : T("Menampilkan {loaded} dari {total} foto.", { loaded: loaded, total: photos.length });
  }

  function loadBatch() {
    if (!gallery || busy || done) return;
    busy = true;

    if (loading) {
      loading.hidden = false;
      loading.innerHTML = [0, 1, 2].map(skShot).join("");
    }

    setTimeout(function () {
      var start = loaded;
      var next = photos.slice(start, start + PER_PAGE);
      gallery.insertAdjacentHTML("beforeend", next.map(function (p, i) { return shotMarkup(p, start + i); }).join(""));
      loaded = start + next.length;
      visible = photos.slice(0, loaded);
      if (SI.initTilt) SI.initTilt(gallery);

      if (loading) { loading.hidden = true; loading.innerHTML = ""; }
      updateStatus();

      if (loaded >= photos.length || !next.length) {
        done = true;
        if (endNote) endNote.hidden = false;
        if (observer && sentinel) observer.unobserve(sentinel);
      }
      busy = false;

      // Kalau sentinel masih dekat viewport (mis. layar tinggi), lanjutkan
      // batch berikutnya. Ini juga menutup celah saat callback IO pertama
      // datang ketika loadBatch masih sibuk.
      if (!done && sentinel) {
        var rect = sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight + 420) setTimeout(loadBatch, 180);
      }
    }, 420);
  }

  var observer = null;
  if ("IntersectionObserver" in window && sentinel) {
    observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) loadBatch();
    }, { rootMargin: "420px 0px" });
    observer.observe(sentinel);
  }
  loadBatch();
  updateStatus();

  /* --------------------------------------------------------- lightbox */
  var current = -1;

  function openPhoto(dataIndex) {
    if (!dialog || !photos[dataIndex]) return;
    current = dataIndex;
    var p = photos[dataIndex];
    document.getElementById("lb-img").src = p.src;
    document.getElementById("lb-img").alt = p.caption;
    document.getElementById("lb-img").width = p.w || 1200;
    document.getElementById("lb-img").height = p.h || 900;
    document.getElementById("lb-cap").textContent = p.caption;
    document.getElementById("lb-date").textContent = p.date;
    SI.openDialog(dialog);
  }

  function step(dir) {
    if (!visible.length) return;
    current = (current + dir + visible.length) % visible.length;
    var p = visible[current];
    document.getElementById("lb-img").src = p.src;
    document.getElementById("lb-img").alt = p.caption;
    document.getElementById("lb-img").width = p.w || 1200;
    document.getElementById("lb-img").height = p.h || 900;
    document.getElementById("lb-cap").textContent = p.caption;
    document.getElementById("lb-date").textContent = p.date;
  }

  gallery.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-photo]");
    if (!btn) return;
    var idx = parseInt(btn.getAttribute("data-photo"), 10);
    /* only photos that are already rendered exist in `visible` */
    openPhoto(idx);
  });

  Array.prototype.forEach.call(dialog.querySelectorAll("[data-close]"), function (btn) {
    btn.addEventListener("click", function () { SI.closeDialog(dialog); });
  });
  document.getElementById("lb-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("lb-next").addEventListener("click", function () { step(1); });
  document.addEventListener("keydown", function (e) {
    if (!dialog || !dialog.open) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
