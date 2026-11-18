/* Academic Hub — Fisher-Yates group generator + polling cepat */
(function () {
  "use strict";
  var SI = window.SI;
  var esc = SI.escapeHtml;
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }

  var LS_NAMES = "si:groups:names";
  var LS_COUNT = "si:groups:count";

  var namesInput = document.getElementById("names-input");
  var namesMeta = document.getElementById("names-meta");
  var namesChips = document.getElementById("names-chips");
  var namesReset = document.getElementById("names-reset");
  var countEl = document.getElementById("group-count");
  var minusBtn = document.getElementById("count-minus");
  var plusBtn = document.getElementById("count-plus");
  var groupHint = document.getElementById("group-hint");
  var shuffleBtn = document.getElementById("shuffle-btn");
  var copyBtn = document.getElementById("copy-btn");
  var stage = document.getElementById("shuffle-stage");
  var groupsEl = document.getElementById("groups");

  var defaultNames = (SI.MEMBERS || []).map(function (m) { return m.name; });
  var groupCount = 4;
  var lastGroups = [];
  var running = false;

  /* ------------------------------------------------------------ data */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function parseNames() {
    var seen = {};
    return String(namesInput.value || "")
      .split(/[\n,;]+/)
      .map(function (s) { return s.replace(/\s+/g, " ").trim(); })
      .filter(function (s) {
        if (!s) return false;
        var key = s.toLowerCase();
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function clampCount(count, total) {
    var max = Math.max(1, Math.min(total, 12));
    return Math.min(Math.max(1, count), max);
  }

  function updateNames(forceClamp) {
    var names = parseNames();
    if (namesMeta) namesMeta.textContent = T("{count} nama", { count: names.length });
    if (namesChips) {
      namesChips.innerHTML = names.slice(0, 40).map(function (n) {
        return '<span class="chip">' + esc(n) + "</span>";
      }).join("") + (names.length > 40 ? '<span class="chip chip--warn">' + T("+{count} lainnya", { count: names.length - 40 }) + "</span>" : "");
    }
    if (forceClamp) {
      groupCount = clampCount(groupCount, names.length);
      if (countEl) countEl.textContent = String(groupCount);
    }
    if (groupHint) {
      groupHint.textContent = names.length
        ? T("Membagi {names} nama ke {groups} kelompok — selisih maksimal satu orang.", { names: names.length, groups: groupCount })
        : T("Tambahkan minimal dua nama untuk mulai mengacak.");
    }
    if (minusBtn) minusBtn.disabled = groupCount <= 1;
    if (plusBtn) plusBtn.disabled = groupCount >= Math.max(1, Math.min(names.length, 12));
    save(LS_NAMES, namesInput.value);
  }

  /* --------------------------------------------------------- inisialisasi */
  var savedNames = load(LS_NAMES, null);
  if (namesInput) {
    namesInput.value = savedNames && String(savedNames).trim() ? savedNames : defaultNames.join("\n");
  }
  groupCount = clampCount(Number(load(LS_COUNT, 4)) || 4, parseNames().length);
  if (countEl) countEl.textContent = String(groupCount);
  updateNames(true);

  namesInput.addEventListener("input", function () { updateNames(true); });

  if (namesReset) {
    namesReset.addEventListener("click", function () {
      namesInput.value = defaultNames.join("\n");
      groupCount = clampCount(groupCount, defaultNames.length);
      if (countEl) countEl.textContent = String(groupCount);
      updateNames(true);
      SI.toast(T("Daftar anggota dikembalikan"));
    });
  }

  function setCount(next) {
    var total = parseNames().length;
    groupCount = clampCount(next, total);
    if (countEl) countEl.textContent = String(groupCount);
    save(LS_COUNT, groupCount);
    updateNames(false);
  }
  minusBtn.addEventListener("click", function () { setCount(groupCount - 1); });
  plusBtn.addEventListener("click", function () { setCount(groupCount + 1); });

  /* ---------------------------------------------------------- Fisher-Yates */
  function randomInt(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      var arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return arr[0] % max;
    }
    return Math.floor(Math.random() * max);
  }
  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function distribute(names, k) {
    var list = shuffled(names);
    var out = [];
    for (var g = 0; g < k; g++) out.push([]);
    var base = Math.floor(list.length / k);
    var extra = list.length % k;
    var idx = 0;
    for (var i = 0; i < k; i++) {
      var size = base + (i < extra ? 1 : 0);
      out[i] = list.slice(idx, idx + size);
      idx += size;
    }
    return out;
  }

  /* ------------------------------------------------------------- render */
  function renderGroups(groups) {
    if (!groupsEl) return;
    groupsEl.innerHTML = groups.map(function (members, i) {
      return (
        '<article class="group-card' + (i % 2 ? " group-card--odd" : "") + '" style="--i:' + i + '">' +
          '<div class="group-card__head">' +
            '<span class="group-card__name">' + T("Kelompok {number}", { number: i + 1 }) + "</span>" +
            '<span class="group-card__count">' + T("{count} orang", { count: members.length }) + "</span>" +
          "</div>" +
          '<ol class="group-card__list">' +
            members.map(function (n, j) {
              return "<li><span>" + String(j + 1).padStart(2, "0") + "</span>" + esc(n) + "</li>";
            }).join("") +
          "</ol>" +
        "</article>"
      );
    }).join("");
    SI.refreshReveal();
  }

  function copyPayload(groups) {
    var lines = [];
    lines.push(T("*Pembagian Kelompok Presentasi*"));
    lines.push("_" + (SI.CLASS ? SI.CLASS.name : "SI 2026") + "_");
    lines.push("");
    groups.forEach(function (members, i) {
      lines.push("*" + T("Kelompok {number}", { number: i + 1 }) + "* (" + T("{count} orang", { count: members.length }) + ")");
      members.forEach(function (n, j) { lines.push(j + 1 + ". " + n); });
      lines.push("");
    });
    lines.push(T("_Diacak dengan Academic Hub SI 2026_"));
    return lines.join("\n");
  }

  /* ------------------------------------------------------------- shuffle */
  function runShuffle() {
    if (running) return;
    var names = parseNames();
    if (names.length < 2) {
      SI.toast(T("Minimal dua nama untuk mengacak"));
      namesInput.focus();
      return;
    }
    if (groupCount > names.length) groupCount = names.length;
    running = true;
    if (copyBtn) copyBtn.disabled = true;
    shuffleBtn.disabled = true;

    if (stage) {
      stage.hidden = false;
      stage.innerHTML = shuffled(names).map(function (n) {
        return '<span class="chip">' + esc(n) + "</span>";
      }).join("");
      stage.classList.add("is-running");
    }

    var chips = stage ? Array.prototype.slice.call(stage.children) : [];
    var pool = shuffled(names);
    var ticks = 0;

    var timer = setInterval(function () {
      ticks++;
      if (!stage) return;
      pool = shuffled(pool);
      chips.slice(0, pool.length).forEach(function (chip, i) {
        if (chip.textContent !== pool[i]) chip.textContent = pool[i];
      });
      if (ticks >= 8) {
        clearInterval(timer);
        finish();
      }
    }, 110);

    function finish() {
      lastGroups = distribute(names, groupCount);
      if (stage) {
        stage.classList.remove("is-running");
        stage.hidden = true;
        stage.innerHTML = "";
      }
      renderGroups(lastGroups);
      if (copyBtn) copyBtn.disabled = false;
      shuffleBtn.disabled = false;
      running = false;
      SI.toast(T("Kelompok berhasil diacak"));
    }
  }

  shuffleBtn.addEventListener("click", runShuffle);
  copyBtn.addEventListener("click", function () {
    if (!lastGroups.length) return;
    SI.copyText(copyPayload(lastGroups))
      .then(function () { SI.toast(T("Hasil disalin — tempel ke grup WhatsApp")); })
      .catch(function () { SI.toast(T("Gagal menyalin. Coba lagi.")); });
  });

  /* ---------------------------------------------------------------- poll */
  var poll = SI.POLL || { question: "", options: [], initialVotes: [] };
  var pollKey = "si:poll:" + String(poll.question || "kelas").slice(0, 40);
  var pollState = load(pollKey, { votes: [], voted: null });
  if (!pollState || !Array.isArray(pollState.votes)) pollState = { votes: [], voted: null };
  var optsEl = document.getElementById("poll-options");
  var totalEl = document.getElementById("poll-total");
  var pollTitle = document.getElementById("poll-title");
  if (pollTitle && poll.question) pollTitle.textContent = T(poll.question);

  function renderPoll() {
    if (!optsEl) return;
    var base = (poll.initialVotes || []).slice();
    var totals = (poll.options || []).map(function (_, i) {
      return (base[i] || 0) + (pollState.votes[i] || 0);
    });
    var sum = totals.reduce(function (a, b) { return a + b; }, 0);
    optsEl.innerHTML = (poll.options || []).map(function (label, i) {
      var pct = sum ? Math.round((totals[i] / sum) * 100) : 0;
      return (
        '<button class="poll__opt' + (pollState.voted === i ? " is-selected" : "") + '" type="button" data-opt="' + i + '" aria-pressed="' + (pollState.voted === i) + '">' +
          '<span class="poll__bar" style="width:' + pct + '%"></span>' +
          '<span class="poll__label">' + esc(T("poll.option." + i)) + "</span>" +
          '<span class="poll__pct">' + pct + "%</span>" +
        "</button>"
      );
    }).join("");
    if (totalEl) totalEl.textContent = T("{count} suara", { count: sum });
  }

  if (optsEl) {
    optsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-opt]");
      if (!btn) return;
      var opt = parseInt(btn.getAttribute("data-opt"), 10);
      var prev = pollState.voted;
      if (prev === opt) {
        SI.toast(T("Kamu sudah memilih opsi ini"));
        return;
      }
      if (prev != null && pollState.votes[prev] > 0) pollState.votes[prev]--;
      pollState.votes[opt] = (pollState.votes[opt] || 0) + 1;
      pollState.voted = opt;
      save(pollKey, pollState);
      renderPoll();
      SI.toast(T("Suara tercatat"));
    });
    renderPoll();
  }
})();
