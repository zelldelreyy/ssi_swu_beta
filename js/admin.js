/* =========================================================================
   SI 2026 — admin.js
   Moderasi menfess mode lokal (localStorage). Tanpa login, tanpa backend.
   Untuk mode Supabase, moderasi dilakukan di dashboard Supabase.
   ========================================================================= */
(function () {
  "use strict";
  var SI = window.SI || {};
  var store = SI.MenfessStore;
  if (!store) return;

  var esc = SI.escapeHtml || function (s) { return String(s == null ? "" : s); }
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; };
  var pendingList = document.getElementById("pending-list");
  var approvedList = document.getElementById("approved-list");
  var pendingCount = document.getElementById("pending-count");
  var approvedCount = document.getElementById("approved-count");
  var updated = document.getElementById("admin-updated");
  var modeBadge = document.getElementById("admin-mode-badge");
  var modeNote = document.getElementById("admin-mode-note");
  var remoteChip = document.getElementById("admin-remote-chip");
  var remoteWarning = document.getElementById("admin-remote-warning");
  var clearBtn = document.getElementById("admin-clear");
  var refreshBtn = document.getElementById("admin-refresh");
  var busy = false;

  var LOGO = SI.icon ? SI.icon("check") : "";

  function formatDate(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(SI.i18n && SI.i18n.get() === "en" ? "en-US" : "id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
    }).format(d).replace(/\./g, ":");
  }

  function setUpdated() {
    if (!updated) return;
    var now = new Date();
    updated.textContent = T("Diperbarui ") + new Intl.DateTimeFormat(SI.i18n && SI.i18n.get() === "en" ? "en-US" : "id-ID", {
      hour: "2-digit", minute: "2-digit",
    }).format(now).replace(/\./g, ":");
  }

  function emptyState(title, text) {
    return (
      '<div class="empty-state admin-empty">' +
        '<span class="admin-empty__icon" aria-hidden="true">' + LOGO + "</span>" +
        "<h3>" + esc(title) + "</h3>" +
        "<p>" + esc(text) + "</p>" +
      "</div>"
    );
  }

  function pendingItem(m) {
    return (
      '<article class="admin-item" data-pending-id="' + esc(m.id) + '">' +
        '<p class="admin-item__text">' + esc(m.text) + "</p>" +
        '<div class="admin-item__meta">' +
          '<span class="admin-tag">' + esc(m.sender && m.sender !== "anonim" ? m.sender : T("anonim")) + "</span>" +
          '<span class="admin-item__date">' + esc(formatDate(m.created_at)) + "</span>" +
        "</div>" +
        '<div class="admin-item__actions">' +
          '<button class="btn btn--primary btn--sm" type="button" data-approve="' + esc(m.id) + '">' +
            '<span data-icon="check" aria-hidden="true"></span> ' + esc(T("Setujui")) + '</button>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-reject="' + esc(m.id) + '">' + esc(T("Tolak")) + '</button>' +
        "</div>" +
      "</article>"
    );
  }

  function approvedItem(m) {
    return (
      '<article class="admin-item admin-item--approved">' +
        '<p class="admin-item__text">' + esc(m.text) + "</p>" +
        '<div class="admin-item__meta">' +
          '<span class="admin-tag admin-tag--ok">' + esc(T("Terbit")) + "</span>" +
          (m.seed ? '<span class="admin-tag">' + esc(T("contoh")) + "</span>" : "") +
          '<span class="admin-item__date">' + esc(m.sender && m.sender !== "anonim" ? m.sender : T("anonim")) + " · " + esc(formatDate(m.created_at)) + "</span>" +
        "</div>" +
      "</article>"
    );
  }

  function render(pending, approved) {
    if (pendingList) {
      if (store.remote) {
        pendingList.innerHTML = emptyState(
          T("Moderasi lewat Supabase"),
          T("Halaman statis tidak bisa membaca antrean pending saat mode Supabase aktif. Buka Table Editor di dashboard Supabase.")
        );
      } else if (!pending.length) {
        pendingList.innerHTML = emptyState(
          T("Antrean bersih"),
          T("Belum ada menfess baru di browser ini. Coba kirim satu dari halaman Playlist & Menfess untuk menguji alurnya.")
        );
      } else {
        pendingList.innerHTML = pending.map(pendingItem).join("");
      }
    }

    if (approvedList) {
      var recent = approved.slice(0, 8);
      approvedList.innerHTML = recent.length
        ? recent.map(approvedItem).join("")
        : emptyState(T("Belum ada yang terbit"), T("Menfess yang disetujui akan muncul di sini."));
    }

    if (pendingCount) pendingCount.textContent = store.remote ? "—" : String(pending.length);
    if (approvedCount) approvedCount.textContent = String(approved.length);
    if (SI.hydrateIcons) SI.hydrateIcons(document);
    if (SI.refreshReveal) SI.refreshReveal();
    setUpdated();
  }

  function load() {
    if (busy) return;
    busy = true;
    if (refreshBtn) refreshBtn.disabled = true;

    Promise.allSettled([store.listPending(), store.listApproved()]).then(function (results) {
      var pending = results[0].status === "fulfilled" ? results[0].value : [];
      var approved = results[1].status === "fulfilled" ? results[1].value : [];
      render(pending || [], approved || []);
    }).catch(function () {
      render([], []);
    }).then(function () {
      busy = false;
      if (refreshBtn) refreshBtn.disabled = false;
    });
  }

  /* ------------------------------------------------------------ actions */
  if (pendingList) {
    pendingList.addEventListener("click", function (e) {
      var approveBtn = e.target.closest("[data-approve]");
      var rejectBtn = e.target.closest("[data-reject]");

      if (approveBtn) {
        var approveId = approveBtn.getAttribute("data-approve");
        approveBtn.disabled = true;
        store.approve(approveId).then(function (ok) {
          if (SI.toast) SI.toast(ok ? T("Menfess disetujui dan terbit") : T("Menfess tidak ditemukan"));
          load();
        }).catch(function () {
          approveBtn.disabled = false;
          if (SI.toast) SI.toast(T("Gagal menyetujui — mode Supabase aktif"));
        });
      }

      if (rejectBtn) {
        if (!window.confirm(T("Tolak dan hapus menfess ini? Tindakan tidak bisa dibatalkan."))) return;
        var rejectId = rejectBtn.getAttribute("data-reject");
        rejectBtn.disabled = true;
        store.reject(rejectId).then(function () {
          if (SI.toast) SI.toast(T("Menfess ditolak"));
          load();
        }).catch(function () {
          rejectBtn.disabled = false;
          if (SI.toast) SI.toast(T("Gagal menolak — mode Supabase aktif"));
        });
      }
    });
  }

  if (refreshBtn) refreshBtn.addEventListener("click", load);

  if (clearBtn) {
    if (store.remote) clearBtn.disabled = true;
    clearBtn.addEventListener("click", function () {
      if (store.remote) return;
      if (!window.confirm(T("Hapus SEMUA menfess yang menunggu di browser ini?"))) return;
      try { localStorage.removeItem("si:menfess:pending"); } catch (e) {}
      if (SI.toast) SI.toast(T("Antrean menfess dikosongkan"));
      load();
    });
  }

  window.addEventListener("storage", function (e) {
    if (!e.key || e.key.indexOf("si:menfess:") === 0) load();
  });

  /* --------------------------------------------------------------- mode */
  if (store.remote) {
    if (modeBadge) { modeBadge.textContent = T("Mode Supabase"); modeBadge.className = "badge badge--gold"; }
    if (remoteChip) remoteChip.textContent = "Supabase";
    if (remoteWarning) remoteWarning.hidden = false;
    if (modeNote) {
      modeNote.textContent = T("Antrean dibaca dari tabel menfess di Supabase. Moderasi dilakukan lewat dashboard, bukan dari halaman ini.");
    }
    if (clearBtn) clearBtn.disabled = true;
  } else {
    if (remoteWarning) remoteWarning.hidden = true;
  }

  load();
})();
