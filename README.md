# SI 2026 — Website Kelas

Hub digital angkatan **Sistem Informasi 2026, STMIK Widya Utama**. Situs statis multi-halaman: profil kelas, anggota, milestone, galeri, playlist & menfess, Academic Hub, dan kredit.

Tidak ada build step dan tidak perlu `npm install`. Semua halaman memakai HTML, CSS, dan JavaScript biasa. **React 18 + Framer Motion 11** disertakan sebagai file UMD lokal di `js/vendor/` (tanpa CDN, tanpa bundler) untuk welcome screen di Beranda dan animasi navigasi (`useScroll`, `useTransform`, `layoutId`). Jika vendor gagal dimuat, situs tetap berfungsi lewat fallback CSS/JS.

> **Status:** versi 1.2 — daftar anggota sudah memakai **157 mahasiswa ber-prefix SSI** dari data MABA 26. Ditambah tema gelap/terang, bahasa Indonesia/Inggris, halaman Pengaturan, reveal per-section, dan navigasi tanpa reload. Foto anggota dan galeri masih placeholder SVG. Ganti dengan foto asli sebelum link dibagikan luas.

---

## 1. Menjalankan lokal

Paling cepat:

```bash
cd si-2026
npx serve .
```

Lalu buka `http://localhost:3000`.

Alternatif tanpa npm:

- Buka `index.html` langsung di browser. Semua fitur inti jalan, **kecuali** service worker/PWA (butuh `http://` atau `https://`).
- Python: `python -m http.server 8000`
- Node: `npx http-server .`

> Service worker hanya aktif di `localhost` atau HTTPS. Saat mengubah CSS/JS dan cache terasa “nyangkut”, buka DevTools → Application → Service Workers → **Unregister**, lalu reload.

---

## 2. Struktur file

```
si-2026/
├─ index.html            Beranda (hero, countdown, statistik, sorotan)
├─ tentang.html          Tentang kelas + dosen wali
├─ anggota.html          Grid anggota + modal profil & QR
├─ milestone.html        Linimasa angkatan
├─ galeri.html           Masonry + infinite scroll + lightbox
├─ playlist.html         Playlist Spotify + menfess + mini player
├─ akademik.html         Acak kelompok + polling cepat
├─ kredit.html           Kontributor & teknologi
├─ pengaturan.html       Tema, bahasa, dan kontras (akses dari sheet Menu)
├─ admin.html            Moderasi menfess lokal (noindex, jangan dibagikan)
├─ offline.html          Fallback saat offline
├─ manifest.webmanifest  Manifest PWA
├─ sw.js                 Service worker (cache shell + halaman)
├─ css/
│  └─ style.css          Seluruh design system + komponen + responsif
├─ js/
│  ├─ data.js            ★ SEMUA KONTEN DI SINI
│  ├─ app.js             Header fallback, kontras, reveal 3D, tilt, parallax, QR, toast, PWA, dialog
│  ├─ nav.js             Navigasi responsif: floating pill desktop + bottom tab bar mobile
│  ├─ splash.js          Welcome screen React/Framer (sekali per sesi) + shared-layout logo ke navbar
│  ├─ theme.js           Tema gelap/terang + kontras tinggi (localStorage)
│  ├─ reveal.js          Reveal per-section via whileInView + Motion.animate
│  ├─ router.js          Transisi halaman tanpa reload via AnimatePresence
│  ├─ home.js … kredit.js  Logika per halaman
│  ├─ menfess-store.js   Penyimpanan menfess + filter kata kasar
│  ├─ config.js          Konfigurasi opsional Supabase
│  ├─ qrcode-generator.js  Library QR (MIT)
│  └─ vendor/            React, ReactDOM, Framer Motion UMD + lisensi (splash + navigasi)
└─ assets/
   ├─ logo-kelas.png     Logo kelas asli (720×720, latar transparan)
   ├─ logo-kelas-sm.png  Versi kecil untuk header/footer (256×256)
   ├─ og.png              Kartu Open Graph 1200×630
   ├─ noise.svg          Tekstur halus
   ├─ icons/             Ikon PWA 192/512/maskable + apple-touch + favicon
   ├─ members/           Foto anggota (placeholder SVG)
   ├─ gallery/           Foto galeri (placeholder SVG)
   └─ playlist-cover.svg Sampul mini player
```

**Aturan path:** semua halaman harus tetap di root `si-2026/` karena path di `data.js` relatif (`assets/...`).

### Welcome screen & efek 3D

- Welcome screen hanya muncul di Beranda dan **sekali per sesi** (`sessionStorage` key `si:splash-seen`). Untuk melihat lagi: DevTools → Application → Session Storage → hapus key tersebut, lalu reload.
- Timeline: 0–200 ms layar kosong; 200–900 ms logo scale 0.8→1 + fade dengan spring **120/14**; 900–1700 ms logo berpindah ke navbar dengan spring **140/16** sementara tagline muncul 100 ms setelahnya; 1700–1900 ms tagline fade-out 200 ms; 1900–2300 ms latar splash crossfade 400 ms; overlay dibersihkan pada 2500 ms.
- Logo memakai **satu elemen shared-layout** (`layoutId="logo"` di Framer Motion), bukan dua gambar yang saling di-fade. Logo baru dilepas setelah logo navbar terlihat, jadi tidak ada lompatan.
- Tombol **Lewati intro** muncul di kanan bawah setelah 500 ms dan langsung menutup sequence tanpa sisa animasi.
- Latar splash punya gradien + partikel halus dengan parallax mouse maksimal **8px**.
- Jika `prefers-reduced-motion: reduce` aktif, seluruh sequence dilewati dan Beranda tampil dengan fade 200 ms.
- Efek kedalaman halaman lain: reveal section `translateZ(-150px) → 0`, tilt kartu maksimal 8°, dan parallax dekorasi maksimal 12px.
- Semua parallax, tilt, dan animasi 3D otomatis dimatikan saat pengguna mengaktifkan `prefers-reduced-motion` atau memakai perangkat sentuh.

### Navigasi responsif (dua tampilan)

`js/nav.js` mengubah navbar menjadi dua tampilan berbeda. Breakpoint **tepat 768px**: `≥768px` desktop/tablet, `<768px` mobile.

**Desktop/tablet (≥768px) — floating pill**

- Sejak awal (scroll 0) navbar sudah berupa **pill membulat penuh** yang melayang di dalam hero: **lebarnya mengikuti konten (hug content, `width: fit-content`)**, jadi tidak ada ruang kosong menganggur — di 1280px hasilnya ±859px, di 1024px ±768px, di 900px ±649px. Margin-top 18px, `border-radius: 999px`, background semi-transparan (±40–50% opacity) + blur 10px, gap brand↔menu 28px, logo/nama kelas di kiri, nav item + aksi di kanan. Item aktif berwarna accent-cyan.
- Setelah scroll > 50px, pill **menyusut & memadat**: nama kelas mengecil ke lebar 0 (brand jadi logo saja), font/padding/gap nav item mengecil, gap 28→20px, jadi di 1280px lebar turun ke ±647px (−25%); tinggi 66→58px, margin-top 12px, `backdrop-filter: blur(16px)`, background `bg-panel` ±74–85% opacity, border `border-soft`, shadow halus, plus glow cyan tipis.
- Shrink dianimasikan dengan Framer Motion `useScroll` + `useTransform` (range 50→90px) + `useSpring`, lalu nilainya ditulis ke CSS variable `--nav-p` (0 → 1) pada `.site-header`. Karena lebar pill mengikuti konten, penyusutan terjadi mulus dari perubahan `--nav-p` (brand text, font-size, padding, gap) — tanpa mengunci `max-width`. Efek visualnya ±300ms ease-out. Bukan scroll listener manual.
- Logo ikut mengecil (scale 1 → 0.88) dan teks brand menyusut/hilang saat pill memadat.
- Hover/fokus nav item memakai pill highlight yang bergeser dengan shared layout animation `motion layoutId="nav-pill"`; saat kursor keluar, pill kembali ke item aktif.
- CTA “Acak kelompok” hanya ditampilkan pada layar ≥1401px (di bawah itu ruang pill tidak cukup); teks brand disembunyikan di 768–900px.

**Mobile (<768px) — bottom tab bar**

- `position: fixed` di bawah layar, full width, blur 16px + border tipis, `padding-bottom` memakai `env(safe-area-inset-bottom)` untuk notch/gesture bar iOS.
- 5 item: **Beranda, Anggota, Galeri, Milestone, Menu**. Tiga item tersering (Anggota, Galeri, Milestone) sengaja ditaruh di slot tengah agar masuk thumb zone; Menu yang sekunder di ujung kanan.
- Tiap item punya ikon + label, tap target ±74×52px (minimal **44×44px**).
- Active state: highlight rounded di belakang ikon+label dengan warna accent, ikon & label jadi accent-cyan, ikon naik **-2px** dengan spring ringan, ikon berganti outline → filled.
- Indikator aktif memakai shared layout animation (`motion layoutId="tabbar-indicator"`). Saat tab ditekan, indikator sudah bergeser ke tab tujuan selama 200ms fade-out sebelum halaman berganti — bukan lompatan.
- `z-index: 130` supaya selalu di atas konten. `body` diberi `padding-bottom: var(--tabbar-h)` agar footer tidak tertutup.
- Menu membuka `nav__sheet` yang di-restyle jadi bottom sheet tepat di atas tab bar (bukan dropdown dari atas); indikator ikut pindah ke tab Menu selama sheet terbuka.
- Pindah tab: `#main` fade-out 200ms lalu halaman baru fade-in 200ms (`si:tab-nav` di `sessionStorage`), sementara tab bar tetap diam.
- Halaman `admin.html` sengaja memakai `body.admin-page`: tetap hamburger + sheet dropdown, tanpa tab bar.

**Aturan umum**

- Breakpoint memakai `@media (max-width: 767.98px)` / `(min-width: 768px)`, jadi tidak ada celah di 768px.
- `prefers-reduced-motion: reduce`: shrink navbar, hover pill, indikator tab, dan spring ikon jadi instan; backdrop blur tetap dipakai karena bukan motion.
- Tanpa JavaScript/React, link nav asli tetap ada (disembunyikan di `.nav__fallback`), tab bar dirender statis dengan `.tabbar__pill`, dan header memakai fallback CSS `--nav-p` berbasis class `.is-scrolled`, jadi navigasi tidak pernah mati.

### Tema gelap / terang

- Tema dibaca dari `localStorage` (`si:theme`) oleh inline script di `<head>` **sebelum render pertama**, jadi tidak ada flash tema salah. Default: gelap `#0A0E14`.
- Tombol matahari/bulan ada di ujung kanan navbar desktop. Di mobile, tema diatur dari halaman **Pengaturan** (sheet Menu → Pengaturan), bukan di bottom tab bar.
- `js/theme.js` mengganti atribut `data-theme` dan melakukan crossfade 300ms lewat class `html.theme-switching`. Warna terang: latar `#F4F6F8`, panel `#FFFFFF`, teks `#11151C`, aksen cyan/gold/orange digelapkan agar kontras ≥4.5:1.
- Toggle **kontras tinggi** (`si:contrast`) benar-benar terpisah dan bisa digabung dengan tema terang maupun gelap (`[data-theme="light"][data-contrast="high"]` punya override sendiri).
- `meta[name="theme-color"]` ikut berubah (`#0A0E14` ↔ `#F4F6F8`).

### Bahasa

- Situs ini **hanya Bahasa Indonesia**. Semua teks ditulis langsung di HTML (dan di `js/data.js` untuk data dinamis), tanpa katalog terjemahan, atribut `data-i18n`, atau tombol ganti bahasa.
- Atribut `lang="id"` di `<head>` tidak diubah oleh JavaScript.

### Transisi halaman tanpa reload

- `js/router.js` menangani link internal `.html`: fetch halaman, tukar isi `#main` di dalam `AnimatePresence`, fade + translateY 8px selama ~240ms, lalu `history.pushState`. Tidak ada reload/flash putih.
- Elemen dialog/lightbox di luar `#main` ikut dipindahkan supaya script halaman tetap menemukannya; script spesifik halaman dijalankan ulang, script vendor hanya dimuat sekali.
- `popstate` (tombol back/forward browser) memakai jalur yang sama. Tanpa React/Framer atau dengan `prefers-reduced-motion: reduce`, navigasi kembali memakai reload biasa.

### Reveal per-section

- `js/reveal.js` memasang sentinel Framer Motion `whileInView` + `viewport={{ once: true, amount: 0.2 }}` pada setiap `<section>` di `#main`.
- Anak-anaknya muncul bertahap 70ms (maksimal 8 item terlihat), hanya mengubah `opacity` dan `transform`. `will-change` dipasang selama animasi dan dihapus setelah selesai.
- Efek 3D `translateZ` dibatasi pada Hero, Anggota, dan Galeri; bagian teks biasa memakai fade + slide 16px.
- Sistem reveal lama berbasis `IntersectionObserver` dinonaktifkan lewat `html.has-framer-reveal` supaya tidak ada elemen yang dianimasikan dua kali.

---

## 3. Mengubah konten

Hampir semua konten ada di **`js/data.js`**. Cari komentar `GANTI`.

| Konstanta | Isi |
|---|---|
| `CLASS` | Nama kelas, kampus, tagline, Instagram, email, grup WhatsApp, tanggal mulai, statistik beranda |
| `ADVISOR` | Dosen wali: nama, NIDN, email, telepon, ruang, jam |
| `MEMBERS` | Daftar anggota: nama, NIM, username IG, path foto (hanya prefix **SSI**) |
| `MILESTONES` | Linimasa: tanggal, label, judul, deskripsi, ikon |
| `EVENTS` | Agenda untuk countdown beranda (yang terdekat dipakai otomatis) |
| `GALLERY` | Foto galeri: path, caption, tanggal, `w`/`h` |
| `PLAYLIST` | Judul, deskripsi, `spotifyId`, daftar track |
| `MENFESS_SEED` | Menfess contoh yang sudah “terbit” |
| `POLL` | Pertanyaan + opsi polling Academic Hub |
| `BAD_WORDS` | Daftar kata kasar untuk filter menfess |
| `CREDITS` | Kontributor halaman Kredit |

### Foto anggota

- Saat ini `MEMBERS` berisi **157 mahasiswa SSI** yang diambil dari `NAMA-NIM-USER MABA 26.xlsx`. Baris dengan prefix NIM selain `SSI` (STI/DTI/DKA) tidak dimasukkan.
- Nama tampil apa adanya, NIM hanya disimpan untuk data dan tidak ditampilkan di kartu.
- Rasio **3:2**, disarankan **900×600 px**, format JPG/WebP.
- Simpan di `assets/members/`, lalu ganti `photo` pada `MEMBERS`.
- `ig` diisi username tanpa `@`. Isi `null` agar QR otomatis mengarah ke Instagram kelas.
- Jabatan tidak ditampilkan di kartu; delapan nama pertama dipakai untuk bagian wajah kelas di halaman Tentang.
- Placeholder unik tiap anggota ada di `assets/members/ssi-001.svg` … `ssi-157.svg`.

### Foto galeri

- Simpan di `assets/gallery/`.
- Isi `w` dan `h` sesuai dimensi asli supaya layout tidak loncat saat lazy-load.
- Caption dan tanggal tampil di lightbox.

### Playlist Spotify

1. Buka playlist di Spotify → **Share** → **Copy link**.
2. Ambil bagian setelah `/playlist/`, misalnya `37i9dQZF1DXcBWIGoYBM5M`.
3. Ganti `PLAYLIST.spotifyId`. Perbarui juga `tracks` bila perlu.

### Menfess contoh

`MENFESS_SEED` selalu tampil sebagai pesan yang sudah disetujui. Tambah, kurangi, atau kosongkan array-nya.

---

## 4. Identitas, tautan, dan SEO

Sebelum deploy, ganti placeholder berikut:

- `https://si2026.vercel.app/` di **semua** `canonical`, `og:url`, dan `og:image` (cari di seluruh file HTML).
- `halo@si2026.id` (footer, tombol mailto, `CLASS.email`).
- `https://chat.whatsapp.com/XXXXXXXXXXXXXX` (footer + `CLASS.whatsappGroup`).
- `si2026.wu` / `https://instagram.com/si2026.wu` (footer, `CLASS.instagram`).
- Data dosen wali dan nomor telepon di `ADVISOR`.
- Nama, foto, dan Instagram seluruh anggota di `MEMBERS`.

Kartu Open Graph:

- File: `assets/og.png`, ukuran **1200×630**.
- Dipakai oleh `og:image` dan `twitter:image` di semua halaman.
- Ganti file ini kalau nama/identitas kelas berubah. Tidak perlu mengubah HTML selama nama file tetap.

---

## 5. PWA (install ke HP)

File terkait: `manifest.webmanifest`, `sw.js`, `assets/icons/`.

- Ikon: `favicon-64.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png`, `apple-touch-icon.png`.
- Manifest memakai `start_url: "./index.html"`, `display: "standalone"`, tema `#0A0E14`.
- Service worker:
  - HTML → **network-first**, fallback cache, lalu `offline.html`.
  - CSS/JS/gambar → **stale-while-revalidate**.
  - `admin.html` sengaja **tidak** di-cache.
- Tombol “Pasang aplikasi” muncul otomatis di Chrome/Edge saat syarat PWA terpenuhi. Di iPhone: **Share → Add to Home Screen**.

**Setiap kali mengubah file inti**, naikkan `CACHE_VERSION` di `sw.js` (misalnya `si2026-v1.0.1`) agar pengguna mendapat versi baru. Untuk perubahan mendesak, unregister service worker lewat DevTools.

> Logo kelas memakai gambar asli dari pengurus (`assets/logo-kelas.png`), tidak didesain ulang. Jangan mengganti, memotong, atau mewarnai ulang logonya. Ikon PWA dan OG dibuat otomatis dari gambar tersebut; versi maskable memakai logo lebih kecil agar aman di dalam safe zone.

---

## 6. Menfess: dua mode

### A. Mode demo lokal (default)

- Tanpa konfigurasi. Data disimpan di `localStorage` browser pengunjung.
- Pesan baru berstatus **pending** dan hanya muncul setelah disetujui.
- Moderasi: buka `admin.html` **di browser yang sama** dengan pengiriman.
- Kunci penyimpanan: `si:menfess:pending`, `si:menfess:approved`, `si:menfess:last`.
- Cocok untuk demo/ACC dosen. **Tidak** cocok untuk produksi: moderator tidak bisa melihat kiriman dari perangkat lain.

### B. Mode Supabase (disarankan untuk produksi)

1. Buat project Supabase.
2. Jalankan SQL berikut di SQL Editor:

```sql
create table if not exists public.menfess (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 3 and 280),
  sender text not null default 'anonim' check (char_length(sender) <= 24),
  tag text not null default 'menfess',
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists menfess_status_created_idx
  on public.menfess (status, created_at desc);

alter table public.menfess enable row level security;

-- Publik hanya bisa membaca yang sudah disetujui.
create policy "public read approved"
  on public.menfess for select
  using (status = 'approved');

-- Publik hanya bisa mengirim sebagai pending.
create policy "public insert pending"
  on public.menfess for insert
  with check (status = 'pending' and char_length(text) between 3 and 280 and char_length(sender) <= 24);

grant select, insert on public.menfess to anon;
```

3. Isi `js/config.js`:

```js
window.SI_CONFIG = {
  supabase: {
    url: "https://PROJECT.supabase.co",
    anonKey: "ANON_PUBLIC_KEY",
    table: "menfess"
  },
  menfess: { maxLength: 280, cooldownSeconds: 30 }
};
```

4. Moderasi lewat **Supabase Dashboard → Table Editor → `menfess`**:
   - Setujui: ubah `status` menjadi `approved`.
   - Tolak: hapus barisnya.
5. `admin.html` akan otomatis mendeteksi mode remote dan menampilkan instruksi (tidak bisa approve/reject dari halaman statis).

Catatan keamanan:

- `anonKey` memang publik; keamanan bergantung pada RLS di atas.
- Filter kata kasar berjalan di browser. Untuk jaminan penuh, tambahkan validasi di Edge Function atau trigger database.
- Jangan pernah memakai `service_role` key di frontend.

---

## 7. Deploy

### Vercel (drag & drop)

1. Buka [vercel.com/new](https://vercel.com/new).
2. Drag folder `si-2026` ke halaman deploy (atau hubungkan repo dan set **Root Directory** ke `si-2026`).
3. Tidak perlu build command; framework preset **Other**.
4. Setelah dapat URL, ganti semua URL placeholder `https://si2026.vercel.app/` di HTML.
5. Redeploy.

### Netlify

- Drag folder `si-2026` ke [app.netlify.com/drop](https://app.netlify.com/drop), atau set publish directory `si-2026` tanpa build command.

### GitHub Pages

- Push isi folder `si-2026` ke branch `gh-pages` (atau folder `/docs`).
- Aktifkan Pages di Settings.
- Service worker tetap bekerja selama situs disajikan lewat HTTPS.

Setelah deploy, uji:

- `manifest.webmanifest` dapat dibuka dan ikon 192/512 termuat.
- DevTools → Application → Manifest: tidak ada error.
- DevTools → Application → Service Workers: status **activated**.
- `assets/og.png` dapat diakses langsung.
- Coba “Add to Home Screen” di HP.

---

## 8. Aksesibilitas & performa

- Tema (`si:theme`) dan kontras tinggi (`si:contrast`) disimpan terpisah di `localStorage` dan bisa dikombinasikan. Kontrol lengkap ada di `pengaturan.html`; toggle tema ada di navbar desktop.
- Kontras tema terang sudah disetel (≥4.5:1) untuk teks utama, teks redup, dan aksen.
- Ganti tema memakai crossfade 300ms dan memicu event `si:themechange` supaya komponen React (nav, tab bar) ikut sinkron.
- Semua animasi menghormati `prefers-reduced-motion`. Saat aktif, welcome screen dilewati, reveal langsung menampilkan konten tanpa sentinel Framer, transisi halaman memakai navigasi biasa, dan navbar langsung menyusut ke bentuk ramping tanpa animasi.
- Navigasi desktop memakai pill `layoutId` dengan dukungan keyboard (fokus memindahkan highlight); navigasi mobile memakai tab bar dengan indikator `layoutId`, `aria-current`, `aria-expanded` untuk menu, dan tap target ≥44px.
- Modal anggota dan lightbox memakai `<dialog>` + tombol tutup + backdrop.
- Skip link tersedia di setiap halaman.
- Gambar memakai `loading="lazy"` dan atribut `width`/`height` untuk mengurangi layout shift.
- Font dimuat dari Google Fonts (Sora, Inter, JetBrains Mono).
- Tidak ada spinner; loading memakai skeleton shimmer.

---

## 9. Checklist sebelum dibagikan

- [ ] Semua nama anggota SSI (157) sudah benar; baris non-SSI tidak ikut masuk.
- [ ] Foto anggota asli sudah menggantikan SVG placeholder (3:2).
- [ ] Foto galeri asli sudah menggantikan SVG placeholder; `w`/`h` sesuai.
- [ ] `CLASS`, `ADVISOR`, `EVENTS`, dan `CREDITS` sudah final.
- [ ] `PLAYLIST.spotifyId` memakai playlist asli.
- [ ] Email, grup WhatsApp, dan Instagram kelas sudah diganti.
- [ ] Semua URL `si2026.vercel.app` diganti dengan domain final.
- [ ] `og.png` sudah sesuai identitas final.
- [ ] `CACHE_VERSION` di `sw.js` dinaikkan setelah perubahan terakhir.
- [ ] Menfess diuji: kirim → pending → approve di `admin.html` → tampil.
- [ ] Halaman diuji di 360px, 390px, 768px, 1280px, dan 1920px.
- [ ] Navbar diuji: pill semi-transparan di top, pill ramping & solid saat scroll >50px, hover pill, dan bottom tab bar + sheet Menu di <768px.
- [ ] Tema gelap/terang dan kontras tinggi diuji di desktop & mobile, termasuk kombinasi terang + kontras tinggi.
- [ ] Navigasi tanpa reload diuji: URL berubah, tidak ada flash putih, back/forward browser bekerja, dan dialog anggota tetap tersedia.
- [ ] Reveal per-section terlihat di semua halaman saat scroll; tidak ada konten yang tetap transparan.
- [ ] `pengaturan.html`, `js/theme.js`, `js/reveal.js`, `js/router.js` masuk `PRECACHE`.
- [ ] `admin.html` tidak dibagikan ke luar pengurus.

---

## 10. Lisensi & kredit

- Kode situs: dibuat oleh angkatan SI 2026 untuk keperluan kelas. Bebas dipakai ulang angkatan lain dengan mengganti identitas.
- `js/qrcode-generator.js` — [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) oleh Kazuhiko Arase, lisensi MIT.
- `js/vendor/` — React 18 dan ReactDOM (MIT), Framer Motion 11 (MIT). Lisensi lengkap ada di `js/vendor/LICENSE-react.txt` dan `js/vendor/LICENSE-framer-motion.txt`.
- Font: Sora, Inter, JetBrains Mono (Google Fonts, SIL Open Font License).
- Emblem, ilustrasi placeholder, dan `og.png` dibuat khusus untuk proyek ini.

Kontributor lengkap ada di halaman **`kredit.html`** dan dapat diubah lewat `CREDITS` di `js/data.js`.
