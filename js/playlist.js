/* Playlist — isi track list + sticky Spotify mini player */
(function () {
  "use strict";
  var SI = window.SI;
  var esc = SI.escapeHtml;
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }
  var pl = SI.PLAYLIST || {};

  var title = document.getElementById("playlist-title");
  var sub = document.getElementById("playlist-sub");
  var spotifyLink = document.getElementById("playlist-spotify");
  var trackList = document.getElementById("track-list");
  var dockTitle = document.getElementById("dock-title");

  if (title) title.textContent = pl.title || T("Playlist kelas");
  if (sub) sub.textContent = pl.subtitle ? T(pl.subtitle) : "";
  if (dockTitle) dockTitle.textContent = pl.title || T("Playlist kelas");

  var spotifyUrl = "https://open.spotify.com/playlist/" + (pl.spotifyId || "");
  if (spotifyLink) spotifyLink.href = spotifyUrl;

  if (trackList) {
    trackList.innerHTML = (pl.tracks || []).map(function (t, i) {
      return (
        '<li class="track">' +
          '<span class="track__num">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span><span class="track__title">' + esc(t.title) + "</span>" +
          '<span class="track__artist">' + esc(t.artist) + "</span></span>" +
          '<span class="track__dur">' + esc(t.dur) + "</span>" +
        "</li>"
      );
    }).join("");
  }

  /* ------------------------------------------------------------- dock */
  var dock = document.getElementById("spotify-dock");
  var frame = document.getElementById("dock-frame");
  var playBtn = document.getElementById("playlist-play");
  var expandBtn = document.getElementById("dock-expand");
  var closeBtn = document.getElementById("dock-close");
  var started = false;

  function ensureIframe() {
    if (!frame || frame.getAttribute("data-ready") === "1") return;
    frame.innerHTML = '<div class="skeleton" style="height:352px;border-radius:0"></div>';
    var iframe = document.createElement("iframe");
    iframe.src = "https://open.spotify.com/embed/playlist/" + encodeURIComponent(pl.spotifyId || "") + "?utm_source=generator&theme=0";
    iframe.title = T("Spotify — {title}", { title: pl.title || T("playlist kelas") });
    iframe.loading = "lazy";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.addEventListener("load", function () {
      var sk = frame.querySelector(".skeleton");
      if (sk) sk.remove();
    });
    frame.appendChild(iframe);
    frame.setAttribute("data-ready", "1");
  }

  function setOpen(open) {
    if (!dock) return;
    dock.classList.toggle("is-open", open);
    if (expandBtn) {
      expandBtn.setAttribute("aria-expanded", open ? "true" : "false");
      expandBtn.setAttribute("aria-label", open ? T("Kecilkan player") : T("Perbesar player"));
    }
  }

  function showDock() {
    if (!dock) return;
    var first = !started;
    ensureIframe();
    dock.classList.add("is-visible");
    setOpen(true);
    started = true;
    return first;
  }

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      var first = showDock();
      if (first) SI.toast(T("Player dibuka — tekan tombol play di dalam Spotify."));
    });
  }
  if (expandBtn) {
    expandBtn.addEventListener("click", function () {
      setOpen(!dock.classList.contains("is-open"));
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (dock) dock.classList.remove("is-visible");
      setOpen(false);
      setTimeout(function () {
        if (frame) { frame.innerHTML = ""; frame.removeAttribute("data-ready"); }
        started = false;
      }, 420);
      SI.toast(T("Player ditutup"));
    });
  }
})();
