import { getStoredData } from "../storage.js";
import { PERSONALITY_TYPES } from "../data/personality-data.js";

const QUIZ_STORAGE_KEY = "mindquest_quiz_result";
let scoreChartInstance = null;

function getTopTypes(scores) {
  const entries = Object.entries(scores);
  if (entries.length === 0) return [];
  const maxScore = Math.max(...entries.map(([, val]) => val));
  return entries
    .filter(([, val]) => val === maxScore)
    .map(([key]) => key);
}

export function renderPersonalityResult(onRetakeCallback) {
  const container = document.getElementById("results-content");
  if (!container) return;

  const resultData = getStoredData(QUIZ_STORAGE_KEY, null);

  if (!resultData || !resultData.scores) {
    container.innerHTML = `
      <div class="mq-card mq-empty-state mq-fade-in">
        <div class="mq-empty-icon">🧭</div>
        <h3>Belum Ada Hasil Kepribadian</h3>
        <p>Kamu belum menyelesaikan Personality Quiz. Ikuti kuis singkat 16 pertanyaan untuk melihat tipe dominan dan grafik kepribadianmu.</p>
        <button id="btn-start-quiz-empty" class="mq-btn mq-btn-primary">Mulai Kuis Sekarang</button>
      </div>
    `;

    const startBtn = document.getElementById("btn-start-quiz-empty");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        if (typeof onRetakeCallback === "function") {
          onRetakeCallback();
        } else if (typeof window.showView === "function") {
          window.showView("quiz");
        }
      });
    }
    return;
  }

  const scores = resultData.scores;
  const topKeys = getTopTypes(scores);
  const primaryKey = topKeys.includes(resultData.type) ? resultData.type : topKeys[0];
  const primaryProfile = PERSONALITY_TYPES[primaryKey] || PERSONALITY_TYPES.explorer;

  const isTie = topKeys.length > 1;
  const secondaryProfile = isTie ? PERSONALITY_TYPES[topKeys[1]] : null;

  const titleDisplay = isTie && secondaryProfile
    ? `${primaryProfile.title} & ${secondaryProfile.title}`
    : primaryProfile.title;

  const taglineDisplay = isTie && secondaryProfile
    ? `Kombinasi seimbang antara ${primaryProfile.title} dan ${secondaryProfile.title}`
    : primaryProfile.tagline;

  container.innerHTML = `
    <div class="mq-result-grid mq-fade-in">
      <div class="mq-card mq-result-profile">
        <div class="mq-result-hero">
          <div class="mq-illustration-wrapper mq-float-anim">
            ${primaryProfile.svgIllustration}
          </div>
          <div>
            <div class="mq-badge">Hasil Eksplorasi Diri</div>
            <h2 class="mq-result-title">${titleDisplay}</h2>
            <p class="mq-result-tagline">${taglineDisplay}</p>
          </div>
        </div>

        <p class="mq-result-desc">${primaryProfile.description}</p>

        <div class="mq-detail-columns">
          <div class="mq-detail-box">
            <h4>✨ Kekuatan Utama</h4>
            <ul>
              ${primaryProfile.strengths.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div class="mq-detail-box">
            <h4>🌱 Saran Pengembangan</h4>
            <ul>
              ${primaryProfile.advice.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        </div>

        <p class="mq-disclaimer">
          *Catatan: Hasil Personality Quiz ini bersifat hiburan dan refleksi diri, bukan alat ukur psikologis tervalidasi atau diagnosis klinis.
        </p>

        <div class="mq-result-actions">
          <button id="btn-retake-quiz" class="mq-btn mq-btn-secondary">↻ Retake Quiz</button>
        </div>
      </div>

      <div class="mq-card mq-result-chart-card">
        <h3>Distribusi Skor Kepribadian</h3>
        <p class="mq-chart-subtitle">Perbandingan skor dari total ${resultData.totalQuestions || 16} pertanyaan</p>
        
        <div class="mq-canvas-wrapper">
          <canvas id="personalityScoreChart"></canvas>
        </div>

        <div class="mq-score-pills">
          <div class="mq-pill"><span>Explorer</span><strong>${scores.explorer ?? 0}</strong></div>
          <div class="mq-pill"><span>Thinker</span><strong>${scores.thinker ?? 0}</strong></div>
          <div class="mq-pill"><span>Creator</span><strong>${scores.creator ?? 0}</strong></div>
          <div class="mq-pill"><span>Connector</span><strong>${scores.connector ?? 0}</strong></div>
        </div>
      </div>
    </div>
  `;

  renderScoreChart(scores);

  const retakeBtn = document.getElementById("btn-retake-quiz");
  if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
      if (typeof onRetakeCallback === "function") {
        onRetakeCallback();
      } else if (typeof window.showView === "function") {
        window.showView("quiz");
      }
    });
  }
}

function renderScoreChart(scores) {
  const canvas = document.getElementById("personalityScoreChart");
  if (!canvas || typeof Chart === "undefined") return;

  if (scoreChartInstance) {
    scoreChartInstance.destroy();
  }

  scoreChartInstance = new Chart(canvas, {
    type: "radar",
    data: {
      labels: ["The Explorer", "The Thinker", "The Creator", "The Connector"],
      datasets: [
        {
          label: "Skor Kategori",
          data: [
            scores.explorer ?? 0,
            scores.thinker ?? 0,
            scores.creator ?? 0,
            scores.connector ?? 0
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
          suggestedMax: 8,
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