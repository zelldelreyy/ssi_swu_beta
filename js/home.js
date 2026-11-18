/* Beranda — render statistik, wajah kelas, dan cuplikan timeline dari data.js */
(function () {
  "use strict";
  var SI = window.SI;
  var esc = SI.escapeHtml;
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }

  /* Stats */
  var statRow = document.getElementById("stat-row");
  if (statRow && SI.CLASS) {
    statRow.innerHTML = SI.CLASS.stats.map(function (s) {
      return (
        '<div class="stat" data-reveal>' +
          '<span class="stat__num" data-count="' + Number(s.value) + '" data-suffix="' + esc(s.suffix || "") + '">0</span>' +
          '<span class="stat__label">' + esc(T(s.label)) + "</span>" +
        "</div>"
      );
    }).join("");
    SI.initCounts();
  }

  /* Empat wajah pertama */
  var strip = document.getElementById("home-members");
  if (strip) {
    strip.innerHTML = (SI.MEMBERS || []).slice(0, 4).map(function (m, i) {
      return (
        '<a class="member-mini" href="anggota.html#m-' + (i + 1) + '" data-reveal>' +
          '<img src="' + esc(m.photo) + '" alt="' + esc(T("Foto ") + m.name) + '" loading="lazy" decoding="async" width="900" height="600">' +
          '<span class="member-mini__body">' +
            '<span class="member-mini__name">' + esc(m.name) + "</span>" +
          "</span>" +
        "</a>"
      );
    }).join("");
  }

  /* Cuplikan timeline */
  var rail = document.getElementById("home-timeline");
  if (rail) {
    rail.innerHTML = (SI.MILESTONES || []).slice(0, 4).map(SI.timelineItem).join("");
  }

  SI.refreshReveal();
})();
