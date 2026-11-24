
/* ==========================================
   MINDQUEST - PERSONALITY RESULTS
   Anggota 2
========================================== */

// ==========================================
// IMPORT MODULE
// ==========================================

import {
  STORAGE_KEYS,
  getStoredData
} from "../storage.js";

import {
  PERSONALITY_TYPES
} from "../data/personality-data.js";


// ==========================================
// STATE DAN KONSTANTA
// ==========================================

let scoreChartInstance = null;

const TYPE_ORDER = [
  "explorer",
  "thinker",
  "creator",
  "connector"
];


// ==========================================
// MENENTUKAN TIPE DENGAN SKOR TERTINGGI
// ==========================================

function getTopTypes(scores = {}) {

  const maxScore = Math.max(
    ...TYPE_ORDER.map(type =>
      Number(scores[type] ?? 0)
    )
  );

  if (
    !Number.isFinite(maxScore) ||
    maxScore <= 0
  ) {
    return [];
  }

  // Mengikuti prioritas tipe yang disepakati
  return TYPE_ORDER.filter(
    type => Number(scores[type] ?? 0) === maxScore
  );
}


// ==========================================
// MENGHAPUS GRAFIK SEBELUMNYA
// ==========================================

function destroyScoreChart() {

  if (scoreChartInstance) {
    scoreChartInstance.destroy();
    scoreChartInstance = null;
  }

}


// ==========================================
// MENAMPILKAN HASIL KEPRIBADIAN
// ==========================================

export function renderPersonalityResult() {

  const container = document.getElementById(
    "results-view"
  );

  if (!container) {
    return;
  }


  // ========================================
  // AMBIL HASIL DARI LOCALSTORAGE
  // ========================================

  const resultData = getStoredData(
    STORAGE_KEYS.QUIZ_RESULT,
    null
  );


  // ========================================
  // EMPTY STATE
  // ========================================

  if (
    !resultData ||
    !resultData.scores
  ) {

    destroyScoreChart();

    container.innerHTML = `

      <div class="mq-container">

        <div class="mq-card mq-empty-state mq-fade-in">

          <div class="mq-empty-icon">
            🧭
          </div>

          <h3>
            Belum Ada Hasil Kepribadian
          </h3>

          <p>
            Kamu belum menyelesaikan Personality Quiz.
            Ikuti kuis singkat 16 pertanyaan untuk melihat
            tipe dominan dan grafik kepribadianmu.
          </p>

          <button
            id="btn-start-quiz-empty"
            type="button"
            class="mq-btn mq-btn-primary"
            data-view="quiz"
          >
            Mulai Kuis Sekarang
          </button>

        </div>

      </div>

    `;

    return;
  }


  // ========================================
  // MENGAMBIL SKOR DAN TIPE KEPRIBADIAN
  // ========================================

  const scores = resultData.scores;

  const topKeys = getTopTypes(scores);

  if (topKeys.length === 0) {
    destroyScoreChart();

    container.innerHTML = `
      <div class="mq-container">
        <div class="mq-card mq-empty-state">
          <h3>Hasil Kuis Tidak Valid</h3>
          <p>Silakan ulangi Personality Quiz untuk mendapatkan hasil baru.</p>
          <button
            type="button"
            class="mq-btn mq-btn-primary"
            data-view="quiz"
          >
            Kembali ke Kuis
          </button>
        </div>
      </div>
    `;

    return;
  }


  // ========================================
  // MENENTUKAN TIPE UTAMA
  // ========================================

  const primaryKey = topKeys.includes(resultData.type)
    ? resultData.type
    : topKeys[0];

  const primaryProfile =
    PERSONALITY_TYPES[primaryKey] ??
    PERSONALITY_TYPES.explorer;


  // ========================================
  // MENANGANI SKOR SERI
  // ========================================

  const tiedProfiles = topKeys
    .map(key => PERSONALITY_TYPES[key])
    .filter(Boolean);

  const isTie = tiedProfiles.length > 1;

  const titleDisplay = isTie
    ? tiedProfiles
        .map(profile => profile.title)
        .join(" + ")
    : primaryProfile.title;

  const taglineDisplay = isTie
    ? `Kombinasi seimbang antara ${tiedProfiles
        .map(profile => profile.title)
        .join(" dan ")}`
    : primaryProfile.tagline;


  // ========================================
  // TAMPILKAN HASIL KEPRIBADIAN
  // ========================================

  const totalQuestions =
    resultData.totalQuestions || 16;

  container.innerHTML = `

    <div class="mq-container">

      <div class="mq-result-grid mq-fade-in">


        <!-- =================================
             PROFIL KEPRIBADIAN
        ================================== -->

        <div class="mq-card mq-result-profile">

          <div class="mq-result-hero">

            <div class="mq-illustration-wrapper mq-float-anim">
              ${primaryProfile.svgIllustration}
            </div>

            <div>

              <div class="mq-badge">
                Hasil Eksplorasi Diri
              </div>

              <h2 class="mq-result-title">
                ${titleDisplay}
              </h2>

              <p class="mq-result-tagline">
                ${taglineDisplay}
              </p>

            </div>

          </div>


          <!-- DESKRIPSI -->

          <p class="mq-result-desc">
            ${primaryProfile.description}
          </p>


          <!-- KEKUATAN DAN SARAN -->

          <div class="mq-detail-columns">


            <div class="mq-detail-box">

              <h4>
                ✨ Kekuatan Utama
              </h4>

              <ul>
                ${primaryProfile.strengths
                  .map(item => `<li>${item}</li>`)
                  .join("")}
              </ul>

            </div>


            <div class="mq-detail-box">

              <h4>
                🌱 Saran Pengembangan
              </h4>

              <ul>
                ${primaryProfile.advice
                  .map(item => `<li>${item}</li>`)
                  .join("")}
              </ul>

            </div>

          </div>


          <!-- DISCLAIMER -->

          <p class="mq-disclaimer">

            *Catatan: Hasil Personality Quiz ini
            bersifat hiburan dan refleksi diri,
            bukan alat ukur psikologis tervalidasi
            atau diagnosis klinis.

          </p>


          <!-- TOMBOL RETAKE -->

          <div class="mq-result-actions">

            <button
              id="btn-retake-quiz"
              type="button"
              class="mq-btn mq-btn-secondary"
              data-action="retake-quiz"
            >
              ↻ Retake Quiz
            </button>

          </div>

        </div>


        <!-- =================================
             GRAFIK DISTRIBUSI SKOR
        ================================== -->

        <div class="mq-card mq-result-chart-card">

          <h3>
            Distribusi Skor Kepribadian
          </h3>

          <p class="mq-chart-subtitle">
            Perbandingan skor dari total
            ${totalQuestions} pertanyaan
          </p>


          <!-- RADAR CHART -->

          <div class="mq-canvas-wrapper">

            <canvas id="personalityScoreChart"></canvas>

          </div>


          <!-- DETAIL SKOR -->

          <div class="mq-score-pills">

            <div class="mq-pill">
              <span>Explorer</span>
              <strong>${scores.explorer ?? 0}</strong>
            </div>

            <div class="mq-pill">
              <span>Thinker</span>
              <strong>${scores.thinker ?? 0}</strong>
            </div>

            <div class="mq-pill">
              <span>Creator</span>
              <strong>${scores.creator ?? 0}</strong>
            </div>

            <div class="mq-pill">
              <span>Connector</span>
              <strong>${scores.connector ?? 0}</strong>
            </div>

          </div>

        </div>

      </div>

    </div>

  `;


  // ========================================
  // RENDER GRAFIK
  // ========================================

  renderScoreChart(scores);

}


// ==========================================
// MEMBUAT RADAR CHART
// ==========================================

function renderScoreChart(scores) {

  const canvas = document.getElementById(
    "personalityScoreChart"
  );

  if (!canvas) {
    return;
  }

  // Pastikan grafik sebelumnya sudah dihancurkan
  destroyScoreChart();

  // Pastikan Chart.js tersedia
  if (typeof Chart === "undefined") {
    console.error(
      "Chart.js belum berhasil dimuat."
    );
    return;
  }


  // Buat grafik baru
  scoreChartInstance = new Chart(canvas, {

    type: "radar",

    data: {

      labels: [
        "The Explorer",
        "The Thinker",
        "The Creator",
        "The Connector"
      ],

      datasets: [

        {
          label: "Skor Kategori",

          data: [
            Number(scores.explorer ?? 0),
            Number(scores.thinker ?? 0),
            Number(scores.creator ?? 0),
            Number(scores.connector ?? 0)
          ],

          backgroundColor: "rgba(163, 177, 138, 0.35)",

          borderColor: "#344E41",

          borderWidth: 2,

          pointBackgroundColor: "#344E41",

          pointBorderColor: "#FFFFFF",

          pointRadius: 5
        }

      ]

    },


    options: {

      responsive: true,

      maintainAspectRatio: false,

      scales: {

        r: {

          beginAtZero: true,

          min: 0,

          max: 16,

          ticks: {

            stepSize: 2,

            color: "#344E41",

            backdropColor: "transparent"

          },

          pointLabels: {

            color: "#344E41",

            font: {

              family: "Poppins",

              size: 12,

              weight: "600"

            }

          },

          grid: {

            color: "rgba(52, 78, 65, 0.15)"

          },

          angleLines: {

            color: "rgba(52, 78, 65, 0.15)"

          }

        }

      },


      plugins: {

        legend: {

          display: false

        }

      }

    }

  });

}
