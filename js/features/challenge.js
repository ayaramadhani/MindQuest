// ==========================================
// IMPORT MODULE
// ==========================================

import {
  STORAGE_KEYS,
  getStoredData,
  setStoredData
} from "../storage.js";

import {
  CHALLENGES_DATA,
  CATEGORY_ICONS
} from "../data/challenge-data.js";


// ==========================================
// STATE
// ==========================================

let activeCategory = "All";
let recentlyCompletedId = null;
let recentlyCompletedTimer = null;
let challengeEventsInitialized = false;


// ==========================================
// LABEL KATEGORI
// ==========================================

const CATEGORY_LABELS = {
  "All": "Semua",
  "Self Reflection": "Refleksi Diri",
  "Creativity": "Kreativitas",
  "Social Connection": "Koneksi Sosial"
};


// ==========================================
// MENGAMBIL STATUS CHALLENGE
// ==========================================

function getChallengeState() {
  const defaultState = {
    completedIds: [],
    totalPoints: 0
  };

  const stored = getStoredData(
    STORAGE_KEYS.CHALLENGES,
    defaultState
  );

  // Pastikan data yang tersimpan berupa array
  const storedIds = Array.isArray(stored?.completedIds)
    ? stored.completedIds
    : [];

  // Hanya mengambil ID yang benar-benar tersedia
  // di dalam CHALLENGES_DATA
  const validIds = storedIds.filter(id =>
    CHALLENGES_DATA.some(item => item.id === id)
  );

  // Hitung ulang poin berdasarkan data tantangan
  const totalPoints = CHALLENGES_DATA
    .filter(item => validIds.includes(item.id))
    .reduce((total, item) => total + item.points, 0);

  return {
    completedIds: validIds,
    totalPoints: totalPoints
  };
}


// ==========================================
// MENYELESAIKAN CHALLENGE
// ==========================================

export function completeChallenge(challengeId) {

  // Periksa apakah challenge tersedia
  const challenge = CHALLENGES_DATA.find(
    item => item.id === challengeId
  );

  if (!challenge) {
    return false;
  }

  const state = getChallengeState();

  // Mencegah challenge yang sama diselesaikan berulang
  if (state.completedIds.includes(challengeId)) {
    return false;
  }

  // Tambahkan ID challenge yang selesai
  const updatedIds = [
    ...state.completedIds,
    challengeId
  ];

  // Hitung total poin terbaru
  const updatedTotalPoints = CHALLENGES_DATA
    .filter(item => updatedIds.includes(item.id))
    .reduce((total, item) => total + item.points, 0);

  const updatedState = {
    completedIds: updatedIds,
    totalPoints: updatedTotalPoints
  };

  // Simpan ke LocalStorage
  const isSaved = setStoredData(
    STORAGE_KEYS.CHALLENGES,
    updatedState
  );

  // Jika penyimpanan gagal, hentikan proses
  if (!isSaved) {
    return false;
  }

  // Aktifkan animasi penyelesaian
  recentlyCompletedId = challengeId;

  if (recentlyCompletedTimer) {
    clearTimeout(recentlyCompletedTimer);
  }

  // Perbarui tampilan Challenge
  renderChallenges();

  // Reset status animasi setelah beberapa saat
  recentlyCompletedTimer = setTimeout(() => {
    recentlyCompletedId = null;
    recentlyCompletedTimer = null;
  }, 900);

  return true;
}


// ==========================================
// INISIALISASI EVENT CHALLENGE
// ==========================================

function initChallengeEvents(container) {

  // Mencegah pemasangan event listener berulang
  if (challengeEventsInitialized) {
    return;
  }

  challengeEventsInitialized = true;

  // Menggunakan event delegation
  container.addEventListener("click", event => {

    // ======================================
    // FILTER KATEGORI
    // ======================================

    const filterButton = event.target.closest(
      ".mq-filter-btn"
    );

    if (filterButton) {
      activeCategory = filterButton.dataset.category;

      renderChallenges();
      return;
    }

    // ======================================
    // TOMBOL SELESAIKAN CHALLENGE
    // ======================================

    const completeButton = event.target.closest(
      ".btn-complete-challenge"
    );

    if (completeButton) {
      const challengeId = completeButton.dataset.id;

      completeChallenge(challengeId);
    }

  });
}


// ==========================================
// RENDER CHALLENGE
// ==========================================

export function renderChallenges() {

  const container = document.getElementById("challenge-view");

  if (!container) {
    return;
  }

  // Inisialisasi event listener
  initChallengeEvents(container);

  const state = getChallengeState();

  const totalChallenges = CHALLENGES_DATA.length;

  const completedCount = state.completedIds.length;

  const maxPoints = CHALLENGES_DATA.reduce(
    (total, item) => total + item.points,
    0
  );

  const progressPercent = totalChallenges > 0
    ? Math.round(
        (completedCount / totalChallenges) * 100
      )
    : 0;


  // ======================================
  // FILTER CHALLENGE
  // ======================================

  const categories = [
    "All",
    "Self Reflection",
    "Creativity",
    "Social Connection"
  ];

  const filteredChallenges = activeCategory === "All"
    ? CHALLENGES_DATA
    : CHALLENGES_DATA.filter(
        item => item.category === activeCategory
      );


  // ======================================
  // TAMPILAN UTAMA CHALLENGE
  // ======================================

  container.innerHTML = `

    <!-- HEADER DAN PROGRESS -->

    <div class="mq-challenge-header mq-card mq-fade-in">

      <div class="mq-progress-top">

        <div>
          <h2>Mini Self-Care Challenge</h2>

          <p>
            Selesaikan tantangan kecil harian
            untuk mengumpulkan poin refleksi diri.
          </p>
        </div>

        <div class="mq-points-badge ${
          recentlyCompletedId ? "mq-pop-anim" : ""
        }">

          <span class="mq-points-value">
            ${state.totalPoints}
          </span>

          <span class="mq-points-label">
            / ${maxPoints} Poin
          </span>

        </div>

      </div>


      <!-- PROGRESS BAR -->

      <div class="mq-progress-bar-bg">

        <div
          class="mq-progress-bar-fill"
          style="width: ${progressPercent}%"
        ></div>

      </div>

      <p class="mq-progress-caption">
        ${completedCount} dari ${totalChallenges}
        tantangan selesai (${progressPercent}%)
      </p>


      <!-- FILTER KATEGORI -->

      <div class="mq-filter-group">

        ${categories.map(category => `
          <button
            type="button"
            class="mq-filter-btn ${
              activeCategory === category ? "active" : ""
            }"
            data-category="${category}"
          >
            ${CATEGORY_LABELS[category] ?? category}
          </button>
        `).join("")}

      </div>

    </div>


    <!-- DAFTAR CHALLENGE -->

    <div class="mq-challenge-grid">

      ${
        filteredChallenges.length > 0

          ? filteredChallenges.map(item => {

              const isDone = state.completedIds.includes(
                item.id
              );

              const isJustCompleted =
                recentlyCompletedId === item.id;

              const iconSvg =
                CATEGORY_ICONS[item.category] ?? "";

              return `

                <div class="
                  mq-card
                  mq-challenge-card
                  ${isDone ? "is-completed" : ""}
                  ${isJustCompleted ? "mq-card-celebrate" : ""}
                ">

                  ${
                    isJustCompleted
                      ? `
                        <div class="mq-floating-plus">
                          +${item.points} Poin!
                        </div>
                      `
                      : ""
                  }


                  <!-- KATEGORI DAN POIN -->

                  <div class="mq-challenge-meta">

                    <span class="mq-category-tag">
                      ${iconSvg}
                      ${CATEGORY_LABELS[item.category] ?? item.category}
                    </span>

                    <span class="mq-point-tag">
                      +${item.points} Poin
                    </span>

                  </div>


                  <!-- INFORMASI CHALLENGE -->

                  <h3>
                    ${item.title}
                  </h3>

                  <p>
                    ${item.description}
                  </p>


                  <!-- TOMBOL SELESAIKAN -->

                  <button
                    type="button"
                    class="
                      mq-btn
                      ${
                        isDone
                          ? "mq-btn-done"
                          : "mq-btn-primary"
                      }
                      btn-complete-challenge
                    "
                    data-id="${item.id}"
                    ${isDone ? "disabled" : ""}
                  >
                    ${
                      isDone
                        ? "✓ Selesai"
                        : "Tandai Selesai"
                    }
                  </button>

                </div>

              `;

            }).join("")

          : `
            <div class="mq-empty-state">
              <h3>Belum Ada Tantangan</h3>
              <p>
                Tidak ada tantangan pada kategori ini.
              </p>
            </div>
          `
      }

    </div>

  `;
}


// ==========================================
// INISIALISASI FITUR CHALLENGE
// ==========================================

export function initChallenge() {
  renderChallenges();
}