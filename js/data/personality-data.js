export const PERSONALITY_TYPES = {
  explorer: {
    id: "explorer",
    title: "The Explorer",
    tagline: "Penjelajah rasa ingin tahu dan pengalaman baru",
    svgIllustration: `
      <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#F5F0E6"/>
        <circle cx="80" cy="80" r="54" fill="#A3B18A" fill-opacity="0.3" stroke="#344E41" stroke-width="3"/>
        <polygon points="80,34 94,76 80,68 66,76" fill="#344E41"/>
        <polygon points="80,126 94,84 80,92 66,84" fill="#A3B18A" stroke="#344E41" stroke-width="2"/>
        <circle cx="80" cy="80" r="7" fill="#FFFFFF" stroke="#344E41" stroke-width="3"/>
        <path d="M36 42L44 50M124 42L116 50M36 118L44 110M124 118L116 110" stroke="#344E41" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `,
    description:
      "Kamu memiliki dorongan alami untuk mencoba hal-hal baru, menjelajahi perspektif berbeda, dan belajar langsung melalui pengalaman nyata. Rasa ingin tahumu membuatmu mudah beradaptasi dalam situasi dinamis.",
    strengths: [
      "Cepat beradaptasi di lingkungan atau situasi baru",
      "Berpikiran terbuka dan antusias mencoba ide segar",
      "Berani keluar dari zona nyaman untuk bertumbuh"
    ],
    advice: [
      "Luangkan waktu jeda agar energi tidak terkuras karena terlalu banyak aktivitas sekaligus",
      "Catat pelajaran kecil dari setiap pengalaman baru yang kamu coba",
      "Fokus menuntaskan satu proyek utama sebelum melompat ke eksplorasi berikutnya"
    ]
  },
  thinker: {
    id: "thinker",
    title: "The Thinker",
    tagline: "Pengamat mendalam yang mengutamakan logika dan refleksi",
    svgIllustration: `
      <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#F5F0E6"/>
        <path d="M56 96C46 88 42 74 47 61C52 47 66 38 80 38C94 38 108 47 113 61C118 74 114 88 104 96V108H56V96Z" fill="#A3B18A" fill-opacity="0.35" stroke="#344E41" stroke-width="3" stroke-linejoin="round"/>
        <rect x="62" y="108" width="36" height="9" rx="4.5" fill="#344E41"/>
        <rect x="67" y="121" width="26" height="8" rx="4" fill="#A3B18A"/>
        <path d="M80 54V74M70 64H90" stroke="#344E41" stroke-width="3" stroke-linecap="round"/>
        <circle cx="80" cy="88" r="4" fill="#344E41"/>
      </svg>
    `,
    description:
      "Kamu cenderung menganalisis situasi secara tenang, mencari pola di balik masalah, dan mengambil keputusan berdasarkan pertimbangan matang. Ketenangan dan ketelitian adalah ciri khasmu.",
    strengths: [
      "Mampu berpikir sistematis dan melihat akar permasalahan",
      "Tenang dalam mengambil keputusan di bawah tekanan",
      "Memiliki kesadaran diri dan kemampuan refleksi yang kuat"
    ],
    advice: [
      "Jangan terjebak overthinking; langkah kecil yang nyata sering lebih baik daripada rencana sempurna",
      "Bagikan pemikiranmu kepada orang tepercaya agar tidak memendam beban sendirian",
      "Seimbangkan aktivitas berpikir dengan istirahat fisik atau relaksasi ringan"
    ]
  },
  creator: {
    id: "creator",
    title: "The Creator",
    tagline: "Imajinatif, ekspresif, dan penuh ide orisinal",
    svgIllustration: `
      <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#F5F0E6"/>
        <path d="M44 92C44 65 65 44 90 44C112 44 126 58 126 76C126 91 114 98 102 98H94C88 98 85 103 88 109C91 115 86 122 78 122C58 122 44 109 44 92Z" fill="#A3B18A" fill-opacity="0.35" stroke="#344E41" stroke-width="3"/>
        <circle cx="66" cy="76" r="6" fill="#344E41"/>
        <circle cx="84" cy="62" r="6" fill="#A3B18A" stroke="#344E41" stroke-width="2"/>
        <circle cx="104" cy="72" r="6" fill="#344E41"/>
        <path d="M112 34L128 50L96 82L80 86L84 70L112 34Z" fill="#FFFFFF" stroke="#344E41" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>
    `,
    description:
      "Kamu melihat dunia sebagai ruang penuh kemungkinan untuk berkarya dan mengekspresikan diri. Kepekaan estetika dan imajinasimu membantumu menemukan cara unik dalam menyelesaikan tantangan.",
    strengths: [
      "Kaya akan ide orisinal dan pendekatan kreatif",
      "Peka terhadap detail visual, emosi, dan makna",
      "Mampu mengubah hal sederhana menjadi sesuatu yang berkesan"
    ],
    advice: [
      "Tetapkan jadwal rutin agar inspirasi kreatif bisa terwujud menjadi karya nyata",
      "Terima bahwa proses berkarya tidak harus langsung sempurna sejak percobaan pertama",
      "Gunakan jurnal atau sketsa cepat untuk menangkap ide spontan setiap hari"
    ]
  },
  connector: {
    id: "connector",
    title: "The Connector",
    tagline: "Hangat, empatik, dan penguat hubungan antarmanusia",
    svgIllustration: `
      <svg viewBox="0 0 160 160" width="140" height="140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="72" fill="#F5F0E6"/>
        <circle cx="58" cy="74" r="22" fill="#A3B18A" fill-opacity="0.45" stroke="#344E41" stroke-width="3"/>
        <circle cx="102" cy="74" r="22" fill="#A3B18A" fill-opacity="0.45" stroke="#344E41" stroke-width="3"/>
        <path d="M80 96C80 96 63 85 63 75C63 70 67 66 72 66C75.5 66 78.5 68 80 71C81.5 68 84.5 66 88 66C93 66 97 70 97 75C97 85 80 96 80 96Z" fill="#344E41"/>
        <path d="M44 114C52 104 68 104 80 112C92 104 108 104 116 114" stroke="#344E41" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `,
    description:
      "Kamu mendapatkan energi dari interaksi bermakna, kerja sama, dan kepedulian terhadap orang-orang di sekitarmu. Kehadiranmu sering membawa rasa nyaman dan keharmonisan dalam kelompok.",
    strengths: [
      "Empatik dan pendengar yang baik bagi orang lain",
      "Mampu membangun komunikasi hangat dan kolaborasi solid",
      "Peka terhadap suasana hati dan kebutuhan tim"
    ],
    advice: [
      "Tetapkan batasan yang sehat agar kamu tidak kelelahan secara emosional saat membantu orang lain",
      "Sisihkan waktu me-time untuk merawat kebutuhan dirimu sendiri",
      "Jangan ragu menyuarakan pendapat pribadimu meskipun berbeda dengan mayoritas"
    ]
  }
};