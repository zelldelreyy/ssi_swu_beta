/* =========================================================================
   SI 2026 — kredit.js
   Merender daftar kontributor dari window.SI.CREDITS.
   ========================================================================= */
(function () {
  "use strict";
  var SI = window.SI || {};
  var grid = document.getElementById("credits-grid");
  if (!grid) return;

  var esc = SI.escapeHtml || function (s) { return String(s == null ? "" : s); };
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }
  var credits = SI.CREDITS || [];

  if (!credits.length) {
    grid.innerHTML = '<div class="empty-state"><p>' + T("Belum ada data kontributor. Isi <code>CREDITS</code> di <code>js/data.js</code>.") + '</p></div>';
    return;
  }

  grid.innerHTML = credits.map(function (c, i) {
    var link = c.link && c.link !== "#"
      ? '<a class="btn btn--ghost btn--sm" href="' + esc(c.link) + '" target="_blank" rel="noopener">' + esc(T("Kenalan")) + ' ' +
        '<span data-icon="external" aria-hidden="true"></span></a>'
      : "";
    return (
      '<article class="credit-card" data-reveal style="--i:' + i + '">' +
        "<h3>" + esc(c.name) + "</h3>" +
        "<p>" + esc(c.desc) + "</p>" +
        (link ? '<div style="margin-top:16px;">' + link + "</div>" : "") +
      "</article>"
    );
  }).join("");

  if (SI.hydrateIcons) SI.hydrateIcons(grid);
  if (SI.refreshReveal) SI.refreshReveal();
})();
