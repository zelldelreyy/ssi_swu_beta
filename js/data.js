/* =========================================================================
   SI 2026 — DATA KELAS
   -------------------------------------------------------------------------
   SEMUA konten yang perlu diganti pengurus ada di file ini.
   Cari komentar "GANTI" untuk data yang masih placeholder.
   ========================================================================= */

const CLASS = {
  name: "Sistem Informasi 2026",
  short: "SI 2026",
  campus: "STMIK Widya Utama",
  faculty: "Fakultas Ilmu Komputer",
  tagline: "Satu angkatan, satu ruang untuk bertumbuh.",
  lead:
    "Hub digital angkatan Sistem Informasi 2026 — tempat profil teman sekelas, " +
    "jejak perjalanan, foto kegiatan, playlist kelas, dan alat bantu akademik " +
    "berkumpul dalam satu ruang yang rapi.",
  motto: "Belajar bersama, tumbuh bersama.",
  // GANTI: akun Instagram kelas (dipakai sebagai tujuan QR default anggota)
  instagram: "si2026.wu",
  instagramUrl: "https://instagram.com/si2026.wu",
  // GANTI: kontak & grup
  email: "halo@si2026.id",
  whatsappGroup: "https://chat.whatsapp.com/XXXXXXXXXXXXXX",
  // GANTI: tanggal resmi mulai kuliah (dipakai di halaman Tentang)
  startedAt: "2026-09-14",
  // GANTI: statistik ringkas di beranda
  stats: [
    { value: 157, suffix: "", label: "Anggota aktif" },
    { value: 6, suffix: "", label: "Milestone tercatat" },
    { value: 18, suffix: "+", label: "Foto kegiatan" },
    { value: 1, suffix: "", label: "Dosen wali" },
  ],
};

/* Dosen wali — GANTI dengan data asli sebelum dibagikan ke dosen. */
const ADVISOR = {
  name: "Aditya Pratama, M.Kom.",
  initials: "AP",
  nip: "NIDN 0612 8701",
  email: "aditya.pratama@stmikwidyautama.ac.id",
  phone: "+62 812-0000-0000",
  office: "Ruang Dosen Lt. 2, STMIK Widya Utama",
  hours: "Senin–Kamis, 09.00–15.00 WIB",
};

/* Anggota kelas.
   photo  : taruh file di assets/members/ lalu tulis path-nya
   ig     : username Instagram tanpa @. null = otomatis ke akun kelas.
   Jabatan tidak ditampilkan — kartu anggota hanya memuat nama.
   Delapan nama pertama dipakai untuk bagian wajah kelas di halaman Tentang.
   GANTI semua nama, foto, dan username di bawah ini. */
const MEMBERS = [
  { name: "Kinza Eshan Ijas Benzema", nim: "SSI202604568", ig: null, photo: "assets/members/ssi-001.svg" },
  { name: "Refa Indira Putri", nim: "SSI202604569", ig: null, photo: "assets/members/ssi-002.svg" },
  { name: "Rasya Ardhiansyah Ramadhan", nim: "SSI202604672", ig: null, photo: "assets/members/ssi-003.svg" },
  { name: "Ana Nurita Candra", nim: "SSI202604567", ig: null, photo: "assets/members/ssi-004.svg" },
  { name: "Triada Rahayu", nim: "SSI202604462", ig: null, photo: "assets/members/ssi-005.svg" },
  { name: "Nafisah Nada Artanti", nim: "SSI202604463", ig: null, photo: "assets/members/ssi-006.svg" },
  { name: "Alif Fia Dwi Cahyaningtias", nim: "SSI202604465", ig: null, photo: "assets/members/ssi-007.svg" },
  { name: "Aila Azzahra", nim: "SSI202604524", ig: null, photo: "assets/members/ssi-008.svg" },
  { name: "Vindiastiti", nim: "SSI202604466", ig: null, photo: "assets/members/ssi-009.svg" },
  { name: "Wera Setiana", nim: "SSI202604467", ig: null, photo: "assets/members/ssi-010.svg" },
  { name: "Bagas Prasetiyo", nim: "SSI202604527", ig: null, photo: "assets/members/ssi-011.svg" },
  { name: "Muhamad Zhulton Aulia", nim: "SSI202604468", ig: null, photo: "assets/members/ssi-012.svg" },
  { name: "Zuhrotus Shofi", nim: "SSI202604469", ig: null, photo: "assets/members/ssi-013.svg" },
  { name: "Ikha Arifiatun Muamalah", nim: "SSI202604530", ig: null, photo: "assets/members/ssi-014.svg" },
  { name: "Alif Iqbal Prastya", nim: "SSI202604470", ig: null, photo: "assets/members/ssi-015.svg" },
  { name: "Wisnu Darmawan", nim: "SSI202604471", ig: null, photo: "assets/members/ssi-016.svg" },
  { name: "Slamet Raditya", nim: "SSI202604473", ig: null, photo: "assets/members/ssi-017.svg" },
  { name: "Azzahra Nur Fala", nim: "SSI202604532", ig: null, photo: "assets/members/ssi-018.svg" },
  { name: "Shopie Meilani Putri", nim: "SSI202604534", ig: null, photo: "assets/members/ssi-019.svg" },
  { name: "Nikeisha Nabilah Hayu", nim: "SSI202604474", ig: null, photo: "assets/members/ssi-020.svg" },
  { name: "Hasna Qonita", nim: "SSI202604522", ig: null, photo: "assets/members/ssi-021.svg" },
  { name: "Reno Aditya", nim: "SSI202604520", ig: null, photo: "assets/members/ssi-022.svg" },
  { name: "Afifah Nurul Hidayah", nim: "SSI202604523", ig: null, photo: "assets/members/ssi-023.svg" },
  { name: "Dian Arfiyansah", nim: "SSI202604475", ig: null, photo: "assets/members/ssi-024.svg" },
  { name: "Fahrul Fai Bahtiar", nim: "SSI202604529", ig: null, photo: "assets/members/ssi-025.svg" },
  { name: "Dwi Rofingatul Musaroh", nim: "SSI202604526", ig: null, photo: "assets/members/ssi-026.svg" },
  { name: "Arlita Tria Saputri", nim: "SSI202604528", ig: null, photo: "assets/members/ssi-027.svg" },
  { name: "Kholi Safinatus Salisa", nim: "SSI202604540", ig: null, photo: "assets/members/ssi-028.svg" },
  { name: "Siva Oriza Dalma Putri", nim: "SSI202604513", ig: null, photo: "assets/members/ssi-029.svg" },
  { name: "Atik Rahmawati", nim: "SSI202604517", ig: null, photo: "assets/members/ssi-030.svg" },
  { name: "Ikhiya Maulluna", nim: "SSI202604496", ig: null, photo: "assets/members/ssi-031.svg" },
  { name: "Labibah", nim: "SSI202604501", ig: null, photo: "assets/members/ssi-032.svg" },
  { name: "Cinta Mahaliya", nim: "SSI202604543", ig: null, photo: "assets/members/ssi-033.svg" },
  { name: "Ifadhilah", nim: "SSI202604504", ig: null, photo: "assets/members/ssi-034.svg" },
  { name: "Dimas Alfa Rizki", nim: "SSI202604547", ig: null, photo: "assets/members/ssi-035.svg" },
  { name: "Muhammad Zaki Ma'arif", nim: "SSI202604510", ig: null, photo: "assets/members/ssi-036.svg" },
  { name: "Afif Al Fawwaz", nim: "SSI202604551", ig: null, photo: "assets/members/ssi-037.svg" },
  { name: "Muhamad Axyas", nim: "SSI202604515", ig: null, photo: "assets/members/ssi-038.svg" },
  { name: "Nur Tria Agustin", nim: "SSI202604521", ig: null, photo: "assets/members/ssi-039.svg" },
  { name: "Sevano Anggara Putra", nim: "SSI202604482", ig: null, photo: "assets/members/ssi-040.svg" },
  { name: "Ukhtia Purwaningsih", nim: "SSI202604487", ig: null, photo: "assets/members/ssi-041.svg" },
  { name: "Anggun Al Fajer", nim: "SSI202604552", ig: null, photo: "assets/members/ssi-042.svg" },
  { name: "Dwi Septiyani", nim: "SSI202604544", ig: null, photo: "assets/members/ssi-043.svg" },
  { name: "Fadhilah Rahmalinda", nim: "SSI202604495", ig: null, photo: "assets/members/ssi-044.svg" },
  { name: "Agisha Abdul Majid", nim: "SSI202604489", ig: null, photo: "assets/members/ssi-045.svg" },
  { name: "Jalal Setiawan", nim: "SSI202604548", ig: null, photo: "assets/members/ssi-046.svg" },
  { name: "Titik Nur Maya Afifah", nim: "SSI202604512", ig: null, photo: "assets/members/ssi-047.svg" },
  { name: "Noviana Barokah", nim: "SSI202604505", ig: null, photo: "assets/members/ssi-048.svg" },
  { name: "Wahyu Mahardika", nim: "SSI202604539", ig: null, photo: "assets/members/ssi-049.svg" },
  { name: "Amelia Agata Fety Putri Wijayanti", nim: "SSI202604531", ig: null, photo: "assets/members/ssi-050.svg" },
  { name: "Sisi Menawati", nim: "SSI202604498", ig: null, photo: "assets/members/ssi-051.svg" },
  { name: "Salsa Marini", nim: "SSI202604500", ig: null, photo: "assets/members/ssi-052.svg" },
  { name: "Fransisko", nim: "SSI202604541", ig: null, photo: "assets/members/ssi-053.svg" },
  { name: "M. Mualimin", nim: "SSI202604509", ig: null, photo: "assets/members/ssi-054.svg" },
  { name: "Muhamad Zakaria", nim: "SSI202604511", ig: null, photo: "assets/members/ssi-055.svg" },
  { name: "Desti Utami", nim: "SSI202604516", ig: null, photo: "assets/members/ssi-056.svg" },
  { name: "Drajat Ridho Mu'amar", nim: "SSI202604555", ig: null, photo: "assets/members/ssi-057.svg" },
  { name: "Nur Fitri Azizatus Zahiroh", nim: "SSI202604553", ig: null, photo: "assets/members/ssi-058.svg" },
  { name: "Tri Puji Febriyanti", nim: "SSI202604493", ig: null, photo: "assets/members/ssi-059.svg" },
  { name: "Arum Listiorini", nim: "SSI202604494", ig: null, photo: "assets/members/ssi-060.svg" },
  { name: "Miko Raditya Pratama", nim: "SSI202604497", ig: null, photo: "assets/members/ssi-061.svg" },
  { name: "Fakhri Fradifta", nim: "SSI202604506", ig: null, photo: "assets/members/ssi-062.svg" },
  { name: "Fami Mau'idzotul Azkiya'", nim: "SSI202604507", ig: null, photo: "assets/members/ssi-063.svg" },
  { name: "Ridho Luz Zulaikha", nim: "SSI202604499", ig: null, photo: "assets/members/ssi-064.svg" },
  { name: "Ardiansyah Rafli Ramadhan", nim: "SSI202604545", ig: null, photo: "assets/members/ssi-065.svg" },
  { name: "Najuwa Putri Cahyani", nim: "SSI202604490", ig: null, photo: "assets/members/ssi-066.svg" },
  { name: "Fitria Imaniar", nim: "SSI202604486", ig: null, photo: "assets/members/ssi-067.svg" },
  { name: "Chayrin Haryoso", nim: "SSI202604484", ig: null, photo: "assets/members/ssi-068.svg" },
  { name: "Asief Nur Khafidhin", nim: "SSI202604483", ig: null, photo: "assets/members/ssi-069.svg" },
  { name: "Fadilah Anwar", nim: "SSI202604559", ig: null, photo: "assets/members/ssi-070.svg" },
  { name: "Munikhatun Jannah", nim: "SSI202604561", ig: null, photo: "assets/members/ssi-071.svg" },
  { name: "Setya Nurrizka Aulia", nim: "SSI202604598", ig: null, photo: "assets/members/ssi-072.svg" },
  { name: "Selarizah Nainila Putri", nim: "SSI202604599", ig: null, photo: "assets/members/ssi-073.svg" },
  { name: "Ismi Nuraeni", nim: "SSI202604600", ig: null, photo: "assets/members/ssi-074.svg" },
  { name: "Ananda Hanif Aldiansyah", nim: "SSI202604601", ig: null, photo: "assets/members/ssi-075.svg" },
  { name: "Elishya Kusuma Wardani", nim: "SSI202604642", ig: null, photo: "assets/members/ssi-076.svg" },
  { name: "Tri Dhia Afalah", nim: "SSI202604603", ig: null, photo: "assets/members/ssi-077.svg" },
  { name: "Menik Triana", nim: "SSI202604711", ig: null, photo: "assets/members/ssi-078.svg" },
  { name: "Beger Nofendi", nim: "SSI202604609", ig: null, photo: "assets/members/ssi-079.svg" },
  { name: "Rois Adli Salim Alfaqih", nim: "SSI202604619", ig: null, photo: "assets/members/ssi-080.svg" },
  { name: "Mesa Nurcahyo", nim: "SSI202604629", ig: null, photo: "assets/members/ssi-081.svg" },
  { name: "Fadilatus Sani", nim: "SSI202604650", ig: null, photo: "assets/members/ssi-082.svg" },
  { name: "Aisyah Putri Amelia", nim: "SSI202604630", ig: null, photo: "assets/members/ssi-083.svg" },
  { name: "Mohamad Afif Saputra", nim: "SSI202604631", ig: null, photo: "assets/members/ssi-084.svg" },
  { name: "Viola Wahyunias Putri", nim: "SSI202604632", ig: null, photo: "assets/members/ssi-085.svg" },
  { name: "Andhini Nur Arifah", nim: "SSI202604614", ig: null, photo: "assets/members/ssi-086.svg" },
  { name: "Naila Aprianti", nim: "SSI202604615", ig: null, photo: "assets/members/ssi-087.svg" },
  { name: "Firman Ramadani", nim: "SSI202604633", ig: null, photo: "assets/members/ssi-088.svg" },
  { name: "Shifa Sabila", nim: "SSI202604620", ig: null, photo: "assets/members/ssi-089.svg" },
  { name: "Renaldi Valentino", nim: "SSI202604638", ig: null, photo: "assets/members/ssi-090.svg" },
  { name: "Sesha Aninda Kirana", nim: "SSI202604646", ig: null, photo: "assets/members/ssi-091.svg" },
  { name: "Aliya Khoirunisa", nim: "SSI202604649", ig: null, photo: "assets/members/ssi-092.svg" },
  { name: "Marsa Vira Rahma Anjani", nim: "SSI202604626", ig: null, photo: "assets/members/ssi-093.svg" },
  { name: "Aulia Salshabilla Mundiarsyita", nim: "SSI202604652", ig: null, photo: "assets/members/ssi-094.svg" },
  { name: "Aprilia Erlita", nim: "SSI202604621", ig: null, photo: "assets/members/ssi-095.svg" },
  { name: "Krisna Dwi Saputra", nim: "SSI202604617", ig: null, photo: "assets/members/ssi-096.svg" },
  { name: "Nabila Saraswati Irchamni", nim: "SSI202604660", ig: null, photo: "assets/members/ssi-097.svg" },
  { name: "Agil Abdilah", nim: "SSI202604611", ig: null, photo: "assets/members/ssi-098.svg" },
  { name: "Seful Hidayah", nim: "SSI202604663", ig: null, photo: "assets/members/ssi-099.svg" },
  { name: "Bastian Rovy Aulia", nim: "SSI202604641", ig: null, photo: "assets/members/ssi-100.svg" },
  { name: "Lulu Uljanah", nim: "SSI202604645", ig: null, photo: "assets/members/ssi-101.svg" },
  { name: "Wirda Nur Azizah", nim: "SSI202604680", ig: null, photo: "assets/members/ssi-102.svg" },
  { name: "Abyakta Rouf", nim: "SSI202604667", ig: null, photo: "assets/members/ssi-103.svg" },
  { name: "Jefri Abdul Manaf", nim: "SSI202604670", ig: null, photo: "assets/members/ssi-104.svg" },
  { name: "Alan Eka Sudiro", nim: "SSI202604666", ig: null, photo: "assets/members/ssi-105.svg" },
  { name: "Tania Zahroh Sari", nim: "SSI202604662", ig: null, photo: "assets/members/ssi-106.svg" },
  { name: "Fauzan Zaenur Rofi", nim: "SSI202604654", ig: null, photo: "assets/members/ssi-107.svg" },
  { name: "Lintang Ayu Felicia", nim: "SSI202604664", ig: null, photo: "assets/members/ssi-108.svg" },
  { name: "Hanif Adly Nugraha", nim: "SSI202604674", ig: null, photo: "assets/members/ssi-109.svg" },
  { name: "Najib Akbar", nim: "SSI202604677", ig: null, photo: "assets/members/ssi-110.svg" },
  { name: "Zaqilatul Ummah", nim: "SSI202604678", ig: null, photo: "assets/members/ssi-111.svg" },
  { name: "Sakti Bagus Ramadhan", nim: "SSI202604679", ig: null, photo: "assets/members/ssi-112.svg" },
  { name: "Alwi Zidni", nim: "SSI202604692", ig: null, photo: "assets/members/ssi-113.svg" },
  { name: "Dwi Cahyaningtyas", nim: "SSI202604712", ig: null, photo: "assets/members/ssi-114.svg" },
  { name: "Rafif Alvino Setiawan", nim: "SSI202604700", ig: null, photo: "assets/members/ssi-115.svg" },
  { name: "Setiawan Wiganda", nim: "SSI202604701", ig: null, photo: "assets/members/ssi-116.svg" },
  { name: "Sebastian Nugroho Setiadi", nim: "SSI202604702", ig: null, photo: "assets/members/ssi-117.svg" },
  { name: "Silfiyani", nim: "SSI202604703", ig: null, photo: "assets/members/ssi-118.svg" },
  { name: "Aji Khoeru Anam", nim: "SSI202604705", ig: null, photo: "assets/members/ssi-119.svg" },
  { name: "Rias Dwi Subi Astuti", nim: "SSI202604583", ig: null, photo: "assets/members/ssi-120.svg" },
  { name: "Indah Fatmawati", nim: "SSI202604574", ig: null, photo: "assets/members/ssi-121.svg" },
  { name: "Fatimah", nim: "SSI202604689", ig: null, photo: "assets/members/ssi-122.svg" },
  { name: "Fiola Sariati Khasanah", nim: "SSI202604690", ig: null, photo: "assets/members/ssi-123.svg" },
  { name: "Nadhif Athaya", nim: "SSI202604586", ig: null, photo: "assets/members/ssi-124.svg" },
  { name: "Ari Ramadani", nim: "SSI202604581", ig: null, photo: "assets/members/ssi-125.svg" },
  { name: "Robi Ardian", nim: "SSI202604588", ig: null, photo: "assets/members/ssi-126.svg" },
  { name: "Meisya Agri Faugati", nim: "SSI202604681", ig: null, photo: "assets/members/ssi-127.svg" },
  { name: "Wina Alfiana", nim: "SSI202604685", ig: null, photo: "assets/members/ssi-128.svg" },
  { name: "Azkha Khoirurijal", nim: "SSI202604716", ig: null, photo: "assets/members/ssi-129.svg" },
  { name: "Hilsa Azansa Putrian", nim: "SSI202604608", ig: null, photo: "assets/members/ssi-130.svg" },
  { name: "Ade Ashar Dafa Rizqullah", nim: "SSI202604719", ig: null, photo: "assets/members/ssi-131.svg" },
  { name: "Dafit Chinglinghow", nim: "SSI202604721", ig: null, photo: "assets/members/ssi-132.svg" },
  { name: "Itsna Maulidia", nim: "SSI202604723", ig: null, photo: "assets/members/ssi-133.svg" },
  { name: "Aisyah Ummu Latifah", nim: "SSI202604725", ig: null, photo: "assets/members/ssi-134.svg" },
  { name: "Kaefa Anti", nim: "SSI202604727", ig: null, photo: "assets/members/ssi-135.svg" },
  { name: "Anjani Wulan Subekti", nim: "SSI202604729", ig: null, photo: "assets/members/ssi-136.svg" },
  { name: "Tri Lestari", nim: "SSI202604731", ig: null, photo: "assets/members/ssi-137.svg" },
  { name: "Mayang Nursiana Sari", nim: "SSI202604733", ig: null, photo: "assets/members/ssi-138.svg" },
  { name: "Laela Nur Fitriyah", nim: "SSI202604734", ig: null, photo: "assets/members/ssi-139.svg" },
  { name: "Rizqi Amalia Putri", nim: "SSI202604736", ig: null, photo: "assets/members/ssi-140.svg" },
  { name: "Muhammad Sof Rahmana Yusuf", nim: "SSI202604738", ig: null, photo: "assets/members/ssi-141.svg" },
  { name: "Sulsilafatun Anjua", nim: "SSI202604742", ig: null, photo: "assets/members/ssi-142.svg" },
  { name: "Tasya Nabila Putri", nim: "SSI202604745", ig: null, photo: "assets/members/ssi-143.svg" },
  { name: "Apri Nur Faizan", nim: "SSI202604747", ig: null, photo: "assets/members/ssi-144.svg" },
  { name: "Soffia Yonata", nim: "SSI202604749", ig: null, photo: "assets/members/ssi-145.svg" },
  { name: "Bilma Agung Wibawa", nim: "SSI202604755", ig: null, photo: "assets/members/ssi-146.svg" },
  { name: "Rizkiana Novianto", nim: "SSI202604754", ig: null, photo: "assets/members/ssi-147.svg" },
  { name: "Ratna Dwi Oktaviana", nim: "SSI202604748", ig: null, photo: "assets/members/ssi-148.svg" },
  { name: "Cika Gladistya Ningsih", nim: "SSI202604746", ig: null, photo: "assets/members/ssi-149.svg" },
  { name: "Shafira Dwi Amelia", nim: "SSI202604744", ig: null, photo: "assets/members/ssi-150.svg" },
  { name: "Dhian Nabil Asshidqi", nim: "SSI202604741", ig: null, photo: "assets/members/ssi-151.svg" },
  { name: "Dwi Isna Ramadhani", nim: "SSI202604730", ig: null, photo: "assets/members/ssi-152.svg" },
  { name: "Khadafi Prian Gani Prasetyo", nim: "SSI202604720", ig: null, photo: "assets/members/ssi-153.svg" },
  { name: "Sigit Tri Pambudi", nim: "SSI202604726", ig: null, photo: "assets/members/ssi-154.svg" },
  { name: "Achmad Rahmadani", nim: "SSI202604724", ig: null, photo: "assets/members/ssi-155.svg" },
  { name: "Annazwa Fitria Ramadhani", nim: "SSI202604579", ig: null, photo: "assets/members/ssi-156.svg" },
  { name: "Mahrain Kharisma Abi", nim: "SSI202604590", ig: null, photo: "assets/members/ssi-157.svg" },
];

/* Milestone angkatan — GANTI tanggal & cerita sesuai yang sebenarnya. */
const MILESTONES = [
  {
    date: "2026-08-18",
    label: "18 Agu 2026",
    title: "Hari pertama angkatan",
    desc: "PKKMB dan perkenalan pertama seluruh anggota SI 2026 di kampus.",
    icon: "flag",
  },
  {
    date: "2026-09-14",
    label: "14 Sep 2026",
    title: "Kuliah perdana",
    desc: "Kelas pertama semester ganjil, sekaligus pembentukan pengurus kelas.",
    icon: "book",
  },
  {
    date: "2026-10-03",
    label: "03 Okt 2026",
    title: "Makrab angkatan",
    desc: "Malam keakraban: games, makan bersama, dan sesi kenalan yang bikin kelas cair.",
    icon: "users",
  },
  {
    date: "2026-10-24",
    label: "24 Okt 2026",
    title: "Proyek bersama: website kelas",
    desc: "Angkatan mulai menggarap hub digital ini sebagai proyek kolaborasi pertama.",
    icon: "code",
  },
  {
    date: "2026-11-14",
    label: "14 Nov 2026",
    title: "Website kelas rilis",
    desc: "Link ACC dibagikan ke dosen wali dan kelas. Satu ruang untuk semua.",
    icon: "globe",
  },
  {
    date: "2026-12-07",
    label: "07 Des 2026",
    title: "Ujian Tengah Semester",
    desc: "Minggu tenang dimulai. Belajar bareng dibuka tiap malam di kampus.",
    icon: "calendar",
  },
  {
    date: "2027-02-08",
    label: "08 Feb 2027",
    title: "Semester genap",
    desc: "Target semester depan: satu proyek nyata untuk mitra di luar kampus.",
    icon: "target",
    next: true,
  },
];

/* Agenda untuk countdown di beranda. Yang terdekat & belum lewat dipakai otomatis. */
const EVENTS = [
  { title: "Ujian Tengah Semester", date: "2026-12-07T08:00:00+07:00", place: "Kampus STMIK Widya Utama" },
  { title: "Deadline proyek web kelas", date: "2027-01-10T23:59:00+07:00", place: "Online" },
  { title: "Makrab semester genap", date: "2027-02-14T16:00:00+07:00", place: "Lokasi menyusul" },
];

/* Galeri — GANTI file di assets/gallery/ dengan foto asli (JPG/WebP).
   width/height penting supaya layout tidak loncat saat lazy-load. */
const GALLERY = [
  { src: "assets/gallery/g01.svg", caption: "Foto bersama PKKMB 2026", date: "18 Agu 2026", w: 1200, h: 900 },
  { src: "assets/gallery/g02.svg", caption: "Sesi perkenalan angkatan", date: "19 Agu 2026", w: 900, h: 1200 },
  { src: "assets/gallery/g03.svg", caption: "Kelas perdana semester ganjil", date: "14 Sep 2026", w: 1100, h: 1100 },
  { src: "assets/gallery/g04.svg", caption: "Belajar bareng sebelum kuis", date: "26 Sep 2026", w: 1200, h: 800 },
  { src: "assets/gallery/g05.svg", caption: "Malam keakraban angkatan", date: "03 Okt 2026", w: 860, h: 1140 },
  { src: "assets/gallery/g06.svg", caption: "Foto panitia makrab", date: "03 Okt 2026", w: 1200, h: 900 },
  { src: "assets/gallery/g07.svg", caption: "Diskusi kelompok proyek web", date: "10 Okt 2026", w: 1000, h: 1000 },
  { src: "assets/gallery/g08.svg", caption: "Ngoding bareng di lab", date: "17 Okt 2026", w: 900, h: 1200 },
  { src: "assets/gallery/g09.svg", caption: "Presentasi ide proyek", date: "24 Okt 2026", w: 1200, h: 900 },
  { src: "assets/gallery/g10.svg", caption: "Sesi foto setelah presentasi", date: "24 Okt 2026", w: 1080, h: 1350 },
  { src: "assets/gallery/g11.svg", caption: "Class meeting sore", date: "31 Okt 2026", w: 1200, h: 800 },
  { src: "assets/gallery/g12.svg", caption: "Kopi bareng pengurus", date: "02 Nov 2026", w: 960, h: 960 },
  { src: "assets/gallery/g13.svg", caption: "Work session website kelas", date: "07 Nov 2026", w: 1200, h: 900 },
  { src: "assets/gallery/g14.svg", caption: "Behind the scene fotbar", date: "10 Nov 2026", w: 900, h: 1200 },
  { src: "assets/gallery/g15.svg", caption: "Rapat pembagian tugas", date: "11 Nov 2026", w: 1200, h: 1000 },
  { src: "assets/gallery/g16.svg", caption: "Uji coba website kelas", date: "12 Nov 2026", w: 1000, h: 1250 },
  { src: "assets/gallery/g17.svg", caption: "Foto rilis website kelas", date: "14 Nov 2026", w: 1200, h: 800 },
  { src: "assets/gallery/g18.svg", caption: "Foto penutup angkatan", date: "14 Nov 2026", w: 1080, h: 1080 },
];

/* Playlist kelas. GANTI spotifyId dengan ID playlist asli:
   buka playlist di Spotify -> Share -> Copy link -> ambil bagian setelah /playlist/. */
const PLAYLIST = {
  title: "Sistem Informasi 2026",
  subtitle: "Lagu yang nemenin kelas dari kelas pagi sampai begadang tugas.",
  spotifyId: "37i9dQZF1DXcBWIGoYBM5M",
  curator: "SI 2026",
  tracks: [
    { title: "Senja di Pelupuk Mata", artist: "Contoh Artis", dur: "3:42" },
    { title: "Ruang Tunggu", artist: "Contoh Artis", dur: "4:05" },
    { title: "Kopi Pahit", artist: "Contoh Artis", dur: "3:18" },
    { title: "Telepon Tengah Malam", artist: "Contoh Artis", dur: "3:56" },
    { title: "Pulang", artist: "Contoh Artis", dur: "4:21" },
    { title: "Kelas Pagi", artist: "Contoh Artis", dur: "2:58" },
    { title: "Tugas Besok", artist: "Contoh Artis", dur: "3:33" },
    { title: "Sampai Lulus", artist: "Contoh Artis", dur: "4:44" },
  ],
};

/* Menfess awal yang sudah disetujui. Tambah/kurangi bebas. */
const MENFESS_SEED = [
  { text: "Makasih buat yang kemarin udah bagi catatan sebelum kuis. Kalian penyelamat semester ini.", from: "anonim", tag: "terima kasih", date: "2026-11-10T19:20:00+07:00" },
  { text: "Yang mau ikut belajar bareng Sabtu pagi, gas. Bawa laptop dan kopi sendiri ya.", from: "pengurus", tag: "info", date: "2026-11-11T08:15:00+07:00" },
  { text: "Baru sadar, kelas kita kalau kompak itu serem banget hasilnya. Lanjut terus ya.", from: "anonim", tag: "apresiasi", date: "2026-11-12T21:05:00+07:00" },
  { text: "Reminder: jangan lupa presensi sebelum jam 9. Yang telat traktir teman sebelah.", from: "anonim", tag: "pengingat", date: "2026-11-13T07:40:00+07:00" },
];

/* Polling cepat "Acara Mendadak" di Academic Hub. */
const POLL = {
  question: "Kapan kita kumpul untuk tugas besar?",
  options: ["Jumat malam", "Sabtu pagi", "Minggu sore"],
  // GANTI angka awal sesuai hasil nyata (atau biarkan 0 untuk mulai dari nol).
  initialVotes: [3, 7, 2],
};

/* Filter menfess — saringan pertama sebelum masuk antrean moderasi.
   Tambah kata sesuai kebutuhan. Pencocokan dilakukan pada teks yang sudah
   dinormalisasi (huruf kecil, angka ala leetspeak diubah, simbol dibuang). */
const BAD_WORDS = [
  "anjing", "anjir", "anying", "bangsat", "bajingan", "brengsek", "goblok", "goblog",
  "idiot", "kasar", "kampang", "keparat", "kontol", "memek", "ngentot", "pepek",
  "perek", "sialan", "tai", "tolol", "titit", "babi", "monyet", "bego", "dungu",
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "pussy", "slut", "whore",
  "retard", "stfu", "dafuq", "wtf",
];

/* Kontributor halaman Kredit — GANTI nama & tautan. */
const CREDITS = [
  { name: "Agil Abdilah", desc: "Membangun website, sistem data anggota, dan seluruh tampilan antarmuka.", link: "https://instagram.com/agil.abdilah" },
  { name: "SI 2026", desc: "Menyusun konten, mengumpulkan data anggota, dan menjaga ruang ini tetap hidup.", link: "#" },
  { name: "Aditya Pratama, M.Kom.", desc: "Pendamping akademik angkatan sekaligus penerima link ACC website kelas.", link: "#" },
];

/* Ekspos ke global supaya script biasa (tanpa module) bisa memakai. */
window.SI = Object.assign(window.SI || {}, { CLASS, ADVISOR, MEMBERS, MILESTONES, EVENTS, GALLERY, PLAYLIST, MENFESS_SEED, POLL, BAD_WORDS, CREDITS });
