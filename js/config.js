/* =========================================================================
   SI 2026 — konfigurasi opsional
   Isi bagian supabase kalau ingin menfess tersimpan di database (bukan hanya
   di browser pengunjung). Selama kosong, situs berjalan dalam mode demo lokal.
   Lihat README untuk skema tabel & kebijakan RLS.
   ========================================================================= */
window.SI_CONFIG = {
  supabase: {
    url: "",       // contoh: "https://abcdefgh.supabase.co"
    anonKey: "",   // anon public key (aman dipakai di frontend dengan RLS)
    table: "menfess"
  },
  menfess: {
    maxLength: 280,
    cooldownSeconds: 30
  }
};
