/* =========================================================================
   MenfessStore — penyimpanan + filter kata kasar
   Mode default: localStorage (demo, per-browser).
   Mode Supabase: set url + anonKey di js/config.js.
   ========================================================================= */
(function () {
  "use strict";
  var SI = window.SI || (window.SI = {});
  function T(key, vars) { return SI.t ? SI.t(key, vars) : key; }
  var cfg = window.SI_CONFIG || {};
  var sb = cfg.supabase || {};
  var LIMITS = cfg.menfess || { maxLength: 280, cooldownSeconds: 30 };
  var TABLE = sb.table || "menfess";
  var REMOTE = !!(sb.url && sb.anonKey);

  var LS_PENDING = "si:menfess:pending";
  var LS_APPROVED = "si:menfess:approved";
  var LS_LAST = "si:menfess:last";

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      var val = raw ? JSON.parse(raw) : fallback;
      return Array.isArray(val) ? val : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function uid() {
    return "local-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  /* ------------------------------------------------------- normalisasi */
  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[0]/g, "o")
      .replace(/[1|]/g, "i")
      .replace(/[3]/g, "e")
      .replace(/[4@]/g, "a")
      .replace(/[5$]/g, "s")
      .replace(/[7]/g, "t")
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function compact(token) {
    return token.replace(/(.)\1{2,}/g, "$1");
  }
  var BAD = (SI.BAD_WORDS || []).map(function (w) { return normalize(w).replace(/\s+/g, ""); });
  var BAD_MAX = BAD.reduce(function (max, w) { return Math.max(max, w.length); }, 0);

  function isBad(token) {
    if (!token) return null;
    var t = compact(token);
    for (var j = 0; j < BAD.length; j++) {
      if (BAD[j] && t === BAD[j]) return BAD[j];
    }
    return null;
  }

  function findProfanity(text) {
    var tokens = normalize(text).split(" ").filter(Boolean);
    for (var i = 0; i < tokens.length; i++) {
      var hit = isBad(tokens[i]);
      if (hit) return hit;

      // Tangkap kata yang dipecah per huruf/spasi: "a n j i n g".
      var joined = "";
      for (var j = i; j < tokens.length && j < i + 12; j++) {
        joined += compact(tokens[j]);
        if (joined.length > BAD_MAX) break;
        if (j > i) {
          for (var k = 0; k < BAD.length; k++) {
            if (BAD[k] && joined === BAD[k]) return BAD[k];
          }
        }
        // Berhenti kalau sudah melewati satu kata utuh yang panjang.
        if (tokens[j].length > 3) break;
      }
    }
    return null;
  }

  /* --------------------------------------------------------------- API */
  function headers(extra) {
    var h = {
      apikey: sb.anonKey,
      Authorization: "Bearer " + sb.anonKey,
      "Content-Type": "application/json",
    };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }
  function endpoint(query) {
    return String(sb.url).replace(/\/+$/, "") + "/rest/v1/" + TABLE + (query || "");
  }
  function fetchJSON(url, opts) {
    return fetch(url, opts).then(function (res) {
      if (!res.ok) throw new Error("Supabase HTTP " + res.status);
      return res.status === 204 ? null : res.json();
    });
  }
  function mapRow(r) {
    return {
      id: r.id,
      text: r.text,
      sender: r.sender || "anonim",
      tag: r.tag || "menfess",
      created_at: r.created_at,
      status: r.status || "pending",
    };
  }
  function seedList() {
    return (SI.MENFESS_SEED || []).map(function (m, i) {
      return {
        id: "seed-" + i,
        text: m.text,
        sender: m.from || "anonim",
        tag: m.tag || "menfess",
        created_at: m.date,
        status: "approved",
        seed: true,
      };
    });
  }
  function byDateDesc(a, b) { return new Date(b.created_at) - new Date(a.created_at); }

  function listApproved() {
    if (REMOTE) {
      return fetchJSON(endpoint("?select=*&status=eq.approved&order=created_at.desc&limit=60"), { headers: headers() })
        .then(function (rows) { return (rows || []).map(mapRow); });
    }
    var local = read(LS_APPROVED, []);
    return Promise.resolve(seedList().concat(local).sort(byDateDesc));
  }

  function listPending() {
    if (REMOTE) {
      return Promise.reject(new Error("remote-admin"));
    }
    return Promise.resolve(read(LS_PENDING, []).sort(byDateDesc));
  }

  function cooldownLeft() {
    var last = 0;
    try { last = Number(localStorage.getItem(LS_LAST) || 0); } catch (e) {}
    var left = Math.ceil((last + LIMITS.cooldownSeconds * 1000 - Date.now()) / 1000);
    return left > 0 ? left : 0;
  }

  function validate(input) {
    var text = String(input.text || "").replace(/\s+/g, " ").trim();
    var sender = String(input.sender || "").replace(/\s+/g, " ").trim();
    if (text.length < 3) return { ok: false, code: "short", message: T("Pesan terlalu pendek — minimal 3 karakter.") };
    if (text.length > LIMITS.maxLength) return { ok: false, code: "long", message: T("Pesan melebihi {max} karakter.", { max: LIMITS.maxLength }) };
    if (sender.length > 24) return { ok: false, code: "sender", message: T("Nama pengirim maksimal 24 karakter.") };

    var bad = findProfanity(text) || findProfanity(sender);
    if (bad) {
      return { ok: false, code: "profanity", message: T("Pesan mengandung kata yang tidak pantas. Mohon tulis ulang dengan bahasa yang lebih sopan.") };
    }

    var links = (text.match(/https?:\/\//gi) || []).length;
    if (links > 1) return { ok: false, code: "links", message: T("Maksimal satu tautan per pesan.") };

    var left = cooldownLeft();
    if (left > 0) return { ok: false, code: "cooldown", message: T("Tunggu {seconds} detik sebelum mengirim pesan lagi.", { seconds: left }) };

    var all = read(LS_PENDING, []).concat(read(LS_APPROVED, []));
    if (all.some(function (m) { return normalize(m.text) === normalize(text); })) {
      return { ok: false, code: "dup", message: T("Pesan yang sama sudah pernah dikirim.") };
    }

    return { ok: true, text: text, sender: sender || "anonim" };
  }

  function submit(input) {
    var check = validate(input);
    if (!check.ok) return Promise.reject(check);

    var record = {
      text: check.text,
      sender: check.sender,
      tag: "menfess",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    if (REMOTE) {
      return fetchJSON(endpoint(""), {
        method: "POST",
        headers: headers({ Prefer: "return=representation" }),
        body: JSON.stringify([record]),
      }).then(function (rows) {
        try { localStorage.setItem(LS_LAST, String(Date.now())); } catch (e) {}
        return rows && rows[0] ? mapRow(rows[0]) : record;
      });
    }

    var local = read(LS_PENDING, []);
    record.id = uid();
    local.unshift(record);
    write(LS_PENDING, local.slice(0, 100));
    try { localStorage.setItem(LS_LAST, String(Date.now())); } catch (e) {}
    return Promise.resolve(record);
  }

  function approve(id) {
    if (REMOTE) return Promise.reject(new Error("remote-admin"));
    var pending = read(LS_PENDING, []);
    var idx = pending.findIndex(function (m) { return m.id === id; });
    if (idx < 0) return Promise.resolve(false);
    var rec = pending.splice(idx, 1)[0];
    rec.status = "approved";
    var approved = read(LS_APPROVED, []);
    approved.unshift(rec);
    write(LS_PENDING, pending);
    write(LS_APPROVED, approved.slice(0, 200));
    return Promise.resolve(true);
  }

  function reject(id) {
    if (REMOTE) return Promise.reject(new Error("remote-admin"));
    var pending = read(LS_PENDING, []).filter(function (m) { return m.id !== id; });
    write(LS_PENDING, pending);
    return Promise.resolve(true);
  }

  SI.MenfessStore = {
    remote: REMOTE,
    limits: LIMITS,
    normalize: normalize,
    findProfanity: findProfanity,
    listApproved: listApproved,
    listPending: listPending,
    submit: submit,
    approve: approve,
    reject: reject,
    cooldownLeft: cooldownLeft,
  };
})();
