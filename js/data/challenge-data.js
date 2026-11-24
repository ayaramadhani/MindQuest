// ==========================================
// ICON KATEGORI CHALLENGE
// ==========================================

export const CATEGORY_ICONS = {
  "Self Reflection": `
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3"/>
    </svg>
  `,

  "Creativity": `
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  `,

  "Social Connection": `
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `
};


// ==========================================
// DATA MINI SELF-CARE CHALLENGE
// ==========================================

export const CHALLENGES_DATA = [
  {
    id: "reflect-01",
    category: "Self Reflection",
    title: "Tiga Hal yang Disyukuri",
    description: "Tuliskan tiga hal sederhana yang membuatmu bersyukur hari ini.",
    points: 10
  },
  {
    id: "reflect-02",
    category: "Self Reflection",
    title: "Jeda Tanpa Layar 15 Menit",
    description: "Istirahatkan mata dari ponsel dan laptop selama 15 menit sambil menarik napas tenang.",
    points: 10
  },
  {
    id: "reflect-03",
    category: "Self Reflection",
    title: "Cek Kondisi Diri",
    description: "Luangkan 5 menit untuk mengenali emosi yang sedang kamu rasakan tanpa menghakiminya.",
    points: 10
  },
  {
    id: "reflect-04",
    category: "Self Reflection",
    title: "Rapikan Meja Kerja",
    description: "Bersihkan dan atur ulang area belajar atau meja kerjamu agar pikiran terasa lebih lega.",
    points: 10
  },
  {
    id: "creative-01",
    category: "Creativity",
    title: "Sketsa Bebas 5 Menit",
    description: "Gambar bentuk atau pola bebas di kertas tanpa memikirkan bagus atau tidaknya hasil.",
    points: 10
  },
  {
    id: "creative-02",
    category: "Creativity",
    title: "Potret Sudut Tenang",
    description: "Ambil satu foto objek atau sudut ruangan di sekitarmu yang menurutmu terlihat menenangkan.",
    points: 10
  },
  {
    id: "creative-03",
    category: "Creativity",
    title: "Playlist Suasana Hati",
    description: "Susun 3–5 lagu favorit yang paling menggambarkan suasana hatimu minggu ini.",
    points: 10
  },
  {
    id: "social-01",
    category: "Social Connection",
    title: "Sapa Teman Lama",
    description: "Kirim pesan singkat untuk menanyakan kabar teman atau anggota keluarga yang sudah lama tidak dihubungi.",
    points: 10
  },
  {
    id: "social-02",
    category: "Social Connection",
    title: "Apresiasi Tulus",
    description: "Ucapkan terima kasih atau pujian tulus kepada seseorang atas hal baik yang ia lakukan.",
    points: 10
  },
  {
    id: "social-03",
    category: "Social Connection",
    title: "Dengarkan Tanpa Menyela",
    description: "Saat mengobrol hari ini, fokuslah mendengarkan cerita lawan bicara sepenuhnya sebelum menanggapi.",
    points: 10
  }
];