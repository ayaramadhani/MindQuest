
/*
 * HOME PAGE - MINDQUEST
 * Pemilik: Anggota 1
 * Fungsi: Menampilkan halaman utama dan navigasi fitur.
 */

// Daftar kartu fitur MindQuest
const FEATURE_CARDS = [
  {
    view: "quiz",
    icon: "assets/icons/icon_quiz.png",
    label: "KENALI DIRI",
    title: "Kuis Kepribadian",
    description:
      "Kenali kecenderungan dirimu melalui 16 pertanyaan sederhana.",
    action: "Mulai kuis"
  },
  {
    view: "results",
    icon: "assets/icons/icon_hasil.png",
    label: "PAHAMI DIRI",
    title: "Hasil Kepribadian",
    description:
      "Temukan kategori dominan, kekuatan, dan saran pengembangan diri.",
    action: "Lihat hasil"
  },
  {
    view: "mood",
    icon: "assets/icons/icon_mood.png",
    label: "SADARI PERASAAN",
    title: "Mood Tracker",
    description:
      "Catat suasana hatimu dan kenali perubahan perasaan setiap hari.",
    action: "Catat mood"
  },
  {
    view: "challenge",
    icon: "assets/icons/icon_challenge.png",
    label: "BERTUMBUH",
    title: "Tantangan Kecil",
    description:
      "Lakukan aktivitas sederhana untuk mengembangkan dirimu.",
    action: "Lihat tantangan"
  },
  {
    view: "audio",
    icon: "assets/icons/icon_audio.png",
    label: "AMBIL JEDA",
    title: "Audio Relaksasi",
    description:
      "Nikmati audio yang menenangkan untuk menemani waktu istirahatmu.",
    action: "Dengarkan audio"
  }
];
/**
 * Menampilkan Home Page MindQuest.
 */
export function renderHome() {
  const container = document.getElementById("home-view");

  if (!container) {
    console.error("Container home-view tidak ditemukan.");
    return;
  }

  container.innerHTML = `
    <!-- HERO SECTION -->
    <section class="home-hero" aria-labelledby="home-title">

      <div class="home-hero-copy">

        <p class="home-eyebrow">
          <span aria-hidden="true">✦</span>
          RUANG KECIL UNTUK MENGENAL DIRI
        </p>

        <h1 id="home-title">
          Kenali dirimu.
          <span>Tumbuh dengan caramu.</span>
        </h1>

        <p class="home-hero-description">
          Setiap orang punya cerita dan perjalanan yang berbeda.
          MindQuest hadir untuk menemanimu mengenal diri,
          memahami perasaan, dan bertumbuh melalui langkah-langkah kecil.
        </p>

        <div class="home-hero-actions">

          <button
            class="home-primary-action mq-btn mq-btn-primary btn btn--primary"
            type="button"
            data-view="quiz"
          >
            Mulai Menjelajah
            <span aria-hidden="true">→</span>
          </button>

          <span class="home-hero-caption">
            Tidak perlu akun. Mulai dari dirimu sendiri.
          </span>

        </div>

      </div>

      <!-- ILUSTRASI HERO -->
      <div class="home-hero-visual" aria-hidden="true">

        <div class="home-visual-orbit home-visual-orbit--outer"></div>
        <div class="home-visual-orbit home-visual-orbit--inner"></div>

        <div class="home-visual-sparkle home-visual-sparkle--one">✦</div>
        <div class="home-visual-sparkle home-visual-sparkle--two">✧</div>

        <div class="home-visual-card">

          <div class="home-visual-card-top">

            <span class="home-visual-icon">✿</span>

            <span class="home-visual-tag">
              A LITTLE SPACE FOR YOU
            </span>

          </div>

          <p class="home-visual-quote">
            "Pelan-pelan, kamu sedang mengenal dirimu."
          </p>

          <div class="home-visual-divider"></div>

          <div class="home-visual-bottom">

            <span>Grow at your own pace</span>
            <span class="home-visual-leaf">🌿</span>

          </div>

        </div>

      </div>

    </section>

    <!-- FEATURE SECTION -->
    <section class="home-features" aria-labelledby="home-features-title">

      <div class="home-section-heading">

        <div>

          <p class="home-eyebrow">
            JELAJAHI MINDQUEST
          </p>

          <h2 id="home-features-title">
            Temukan ruang yang kamu butuhkan.
          </h2>

        </div>

        <p class="home-section-description">
          Mulai perjalanan mengenal dirimu melalui berbagai
          pengalaman sederhana yang tersedia di MindQuest.
        </p>

      </div>

      <div class="home-grid">

        ${FEATURE_CARDS.map((card) => `
          <a
            class="home-card mq-card card"
            href="#${card.view}"
            data-view="${card.view}"
            aria-label="${card.title}: ${card.action}"
          >

            <div class="home-card-top">

              <span class="home-card-icon" aria-hidden="true">
                <img src="${card.icon}" alt="">
              </span>

              <span class="home-card-arrow" aria-hidden="true">
                ↗
              </span>

            </div>

            <div class="home-card-content">

              <p class="home-card-label">
                ${card.label}
              </p>

              <h3>${card.title}</h3>

              <p class="home-card-description">
                ${card.description}
              </p>

            </div>

            <span class="home-card-action">
              ${card.action}
              <span aria-hidden="true">→</span>
            </span>

          </a>
        `).join("")}

      </div>

    </section>
  `;
}
