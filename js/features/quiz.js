
/* ==========================================
   MINDQUEST - PERSONALITY QUIZ
   Anggota 1
========================================== */

// ==========================================
// IMPORT MODULE
// ==========================================

import {
  STORAGE_KEYS,
  setStoredData
} from "../storage.js";

import {
  QUIZ_QUESTIONS,
  QUIZ_CONFIG
} from "../data/quiz-data.js";

import { showView } from "../navigation.js";


// ==========================================
// ICON PNG QUIZ
// ==========================================

const QUIZ_ICONS = {
  questions: "assets/icons/icon-questions.png",
  choices: "assets/icons/icon-choices.png",
  reflection: "assets/icons/icon-reflection.png",
  completed: "assets/icons/icon-completed.png",
  error: "assets/icons/icon-error.png"
};

// ==========================================
// KONSTANTA DAN STATE QUIZ
// ==========================================

const TYPE_ORDER = [
  "explorer",
  "thinker",
  "creator",
  "connector"
];

let currentQuestionIndex = 0;
let selectedAnswers = [];

let quizStarted = false;
let quizCompleted = false;
let isQuizInitialized = false;


// ==========================================
// MENGAMBIL CONTAINER QUIZ
// ==========================================

function getQuizContainer() {
  return document.getElementById("quiz-view");
}


// ==========================================
// VALIDASI DATA QUIZ
// ==========================================

function validateQuizData() {
  if (
    !Array.isArray(QUIZ_QUESTIONS) ||
    QUIZ_QUESTIONS.length !== 16
  ) {
    return false;
  }

  return QUIZ_QUESTIONS.every(question => {
    return (
      question.question &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every(option => {
        return (
          option.text &&
          TYPE_ORDER.includes(option.type)
        );
      })
    );
  });
}


// ==========================================
// FUNGSI PERHITUNGAN HASIL QUIZ
// ==========================================

export function calculateQuizResult(answers = []) {

  const scores = {
    explorer: 0,
    thinker: 0,
    creator: 0,
    connector: 0
  };

  if (!Array.isArray(answers) || answers.length === 0) {
    return null;
  }

  // Hitung skor setiap tipe kepribadian
  answers.forEach(type => {
    if (Object.prototype.hasOwnProperty.call(scores, type)) {
      scores[type] += 1;
    }
  });

  const totalValidAnswers = Object.values(scores)
    .reduce((total, score) => total + score, 0);

  if (totalValidAnswers === 0) {
    return null;
  }

  // Tentukan skor tertinggi
  const maxScore = Math.max(
    ...Object.values(scores)
  );

  // Tentukan tipe yang memperoleh skor tertinggi
  // Menggunakan urutan prioritas yang disepakati
  const tiedTypes = TYPE_ORDER.filter(
    type => scores[type] === maxScore
  );

  const result = {
    type: tiedTypes[0],
    scores: scores,
    totalQuestions: totalValidAnswers,
    completedAt: new Date().toISOString()
  };

  // Simpan seluruh tipe jika memperoleh skor seri
  if (tiedTypes.length > 1) {
    result.tiedTypes = tiedTypes;
  }

  return result;
}


// ==========================================
// MENYIMPAN HASIL QUIZ
// ==========================================

export function saveQuizResult(result) {

  if (!result || !result.scores) {
    return false;
  }

  return setStoredData(
    STORAGE_KEYS.QUIZ_RESULT,
    result
  );
}


// ==========================================
// TAMPILAN INTRO QUIZ
// ==========================================

function renderQuizIntro() {

  const container = getQuizContainer();

  if (!container) return;

  container.innerHTML = `
    <div class="mq-container quiz-container">

      <div class="mq-card quiz-intro mq-fade-in">

        <span class="mq-badge">
          MindQuest Personality Quiz
        </span>

        <h1 id="quiz-title">
          Kenali Dirimu Lebih Dekat
        </h1>

        <p class="quiz-intro-description">
          ${QUIZ_CONFIG.description}
          Jawablah setiap pertanyaan sesuai dengan
          kecenderungan dirimu dalam kehidupan sehari-hari.
        </p>

        <div class="quiz-intro-info">

          <div class="quiz-info-item">
            <span class="quiz-info-icon" aria-hidden="true">
              <img src="${QUIZ_ICONS.questions}" alt="">
            </span>
            <span>16 Pertanyaan</span>
          </div>

          <div class="quiz-info-item">
           <span class="quiz-info-icon" aria-hidden="true">
            <img src="${QUIZ_ICONS.choices}" alt="">
          </span>
            <span>4 Pilihan Jawaban</span>
          </div>

          <div class="quiz-info-item">
            <span class="quiz-info-icon" aria-hidden="true">
              <img src="${QUIZ_ICONS.reflection}" alt="">
            </span>
            <span>Refleksi Diri</span>
          </div>

        </div>

        <p class="quiz-instruction">
          Tidak ada jawaban benar atau salah.
          Pilih jawaban yang paling menggambarkan dirimu.
        </p>

        <button
          type="button"
          class="mq-btn mq-btn-primary quiz-start-btn"
          data-action="start-quiz"
        >
          Mulai Kuis
          <span aria-hidden="true">→</span>
        </button>

      </div>

    </div>
  `;
}


// ==========================================
// MEMULAI QUIZ
// ==========================================

export function startQuiz() {

  if (!validateQuizData()) {
    renderQuizError();
    return;
  }

  // Reset sesi kuis baru
  currentQuestionIndex = 0;

  selectedAnswers = Array(
    QUIZ_QUESTIONS.length
  ).fill(null);

  quizStarted = true;
  quizCompleted = false;

  // Mulai dari pertanyaan pertama
  renderQuestion();
}


// ==========================================
// MENAMPILKAN PERTANYAAN
// ==========================================

function renderQuestion() {

  const container = getQuizContainer();

  if (!container) return;

  if (
    !quizStarted ||
    currentQuestionIndex < 0 ||
    currentQuestionIndex >= QUIZ_QUESTIONS.length
  ) {
    return;
  }

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  const totalQuestions = QUIZ_QUESTIONS.length;

  const questionNumber = currentQuestionIndex + 1;

  const progressPercent = Math.round(
    (questionNumber / totalQuestions) * 100
  );

  const selectedType =
    selectedAnswers[currentQuestionIndex];

  const hasSelectedAnswer = Boolean(selectedType);

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;


  container.innerHTML = `

    <div class="mq-container quiz-container">

      <!-- HEADER QUIZ -->

      <div class="quiz-top-section">

        <div class="quiz-top-heading">

          <span class="mq-badge">
            Personality Quiz
          </span>

          <p class="quiz-question-count">
            Pertanyaan ${questionNumber}
            dari ${totalQuestions}
          </p>

        </div>


        <!-- PROGRESS BAR -->

        <div
          class="quiz-progress-track"
          role="progressbar"
          aria-label="Progress kuis"
          aria-valuemin="0"
          aria-valuemax="${totalQuestions}"
          aria-valuenow="${questionNumber}"
        >

          <div
            class="quiz-progress-fill"
            style="width: ${progressPercent}%"
          ></div>

        </div>

        <p class="quiz-progress-label">
          ${progressPercent}% selesai
        </p>

      </div>


      <!-- KARTU PERTANYAAN -->

      <div class="mq-card quiz-question-card mq-fade-in">

        <h1 id="quiz-title">
          Kuis Kepribadian
        </h1>

        <p class="quiz-question-number">
          Pertanyaan ${questionNumber}
        </p>

        <h2
          id="quiz-question-text"
          class="quiz-question-text"
        >
          ${question.question}
        </h2>

        <p class="quiz-option-instruction">
          Pilih satu jawaban yang paling sesuai dengan dirimu.
        </p>


        <!-- PILIHAN JAWABAN -->

        <div
          class="quiz-options"
          role="group"
          aria-labelledby="quiz-question-text"
        >

          ${question.options.map((option, index) => {

            const isSelected =
              selectedType === option.type;

            return `

              <button
                type="button"
                class="
                  quiz-option
                  ${isSelected ? "is-selected" : ""}
                "
                data-action="select-answer"
                data-option-index="${index}"
                aria-pressed="${isSelected}"
              >

                <span class="quiz-option-letter">
                  ${String.fromCharCode(65 + index)}
                </span>

                <span class="quiz-option-text">
                  ${option.text}
                </span>

                <span class="quiz-option-check"
                  aria-hidden="true">
                  ${isSelected ? "✓" : ""}
                </span>

              </button>

            `;

          }).join("")}

        </div>


        <!-- NAVIGASI PERTANYAAN -->

        <div class="quiz-navigation">

          <button
            type="button"
            class="mq-btn mq-btn-secondary"
            data-action="previous-question"
            ${currentQuestionIndex === 0 ? "disabled" : ""}
          >
            ← Sebelumnya
          </button>

          <button
            type="button"
            class="mq-btn mq-btn-primary"
            data-action="next-question"
            ${!hasSelectedAnswer ? "disabled" : ""}
          >
            ${
              isLastQuestion
                ? "Lihat Hasil →"
                : "Selanjutnya →"
            }
          </button>

        </div>

        <p class="quiz-navigation-hint">
          ${
            hasSelectedAnswer
              ? "Jawabanmu sudah dipilih."
              : "Pilih salah satu jawaban untuk melanjutkan."
          }
        </p>

      </div>

    </div>

  `;
}


// ==========================================
// MEMILIH JAWABAN
// ==========================================

function selectAnswer(optionIndex) {

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  if (!question) return;

  if (
    !Number.isInteger(optionIndex) ||
    optionIndex < 0 ||
    optionIndex >= question.options.length
  ) {
    return;
  }

  const selectedOption = question.options[optionIndex];

  // Simpan kategori dari pilihan jawaban
  selectedAnswers[currentQuestionIndex] =
    selectedOption.type;

  // Perbarui tampilan pilihan jawaban
  renderQuestion();
}


// ==========================================
// PERTANYAAN BERIKUTNYA
// ==========================================

function nextQuestion() {

  // Pastikan pertanyaan sudah dijawab
  if (!selectedAnswers[currentQuestionIndex]) {
    return;
  }

  const lastIndex = QUIZ_QUESTIONS.length - 1;

  if (currentQuestionIndex < lastIndex) {

    currentQuestionIndex++;

    renderQuestion();

  } else {

    finishQuiz();

  }
}


// ==========================================
// KEMBALI KE PERTANYAAN SEBELUMNYA
// ==========================================

function previousQuestion() {

  if (currentQuestionIndex <= 0) {
    return;
  }

  currentQuestionIndex--;

  renderQuestion();
}


// ==========================================
// MENYELESAIKAN QUIZ
// ==========================================

function finishQuiz() {

  // Pastikan semua pertanyaan sudah dijawab
  const isAllAnswered = selectedAnswers.length ===
    QUIZ_QUESTIONS.length &&
    selectedAnswers.every(answer =>
      TYPE_ORDER.includes(answer)
    );

  if (!isAllAnswered) {
    renderQuestion();
    return;
  }

  // Hitung hasil kepribadian
  const result = calculateQuizResult(selectedAnswers);

  if (!result) {
    renderQuizError(
      "Hasil kuis tidak dapat dihitung. Silakan coba kembali."
    );
    return;
  }

  // Simpan hasil ke LocalStorage
  const isSaved = saveQuizResult(result);

  if (!isSaved) {
    renderQuizError(
      "Hasil kuis gagal disimpan. Periksa penyimpanan browser dan coba kembali."
    );
    return;
  }

  quizStarted = false;
  quizCompleted = true;

  // Tampilkan halaman selesai
  renderQuizCompleted();

  // Arahkan pengguna ke halaman Results
  showView("results");
}


// ==========================================
// TAMPILAN SETELAH QUIZ SELESAI
// ==========================================

function renderQuizCompleted() {

  const container = getQuizContainer();

  if (!container) return;

  container.innerHTML = `

    <div class="mq-container quiz-container">

      <div class="mq-card quiz-completed mq-fade-in">

        <div class="quiz-completed-icon">
          <img
            src="${QUIZ_ICONS.completed}"
            alt=""
          >
        </div>

        <span class="mq-badge">
          Personality Quiz
        </span>

        <h1 id="quiz-title">
          Kuis Berhasil Diselesaikan!
        </h1>

        <p>
          Terima kasih sudah meluangkan waktu
          untuk mengenali dirimu lebih jauh.
          Hasil eksplorasi dirimu sudah siap dilihat.
        </p>

        <button
          type="button"
          class="mq-btn mq-btn-primary"
          data-view="results"
        >
          Lihat Hasil Kepribadian →
        </button>

        <button
          type="button"
          class="mq-btn mq-btn-secondary"
          data-action="retake-quiz"
        >
          ↻ Ulangi Kuis
        </button>

      </div>

    </div>

  `;
}


// ==========================================
// TAMPILAN ERROR
// ==========================================

function renderQuizError(
  message = "Data kuis tidak dapat dimuat. Silakan periksa kembali file quiz-data.js."
) {

  const container = getQuizContainer();

  if (!container) return;

  quizStarted = false;

  container.innerHTML = `

    <div class="mq-container quiz-container">

      <div class="mq-card quiz-error mq-fade-in">

        <div class="quiz-error-icon">
          <img
            src="${QUIZ_ICONS.error}"
            alt=""
          >
        </div>

        <h2 id="quiz-title">
          Kuis Belum Dapat Dimuat
        </h2>

        <p>
          ${message}
        </p>

        <button
          type="button"
          class="mq-btn mq-btn-primary"
          data-view="home"
        >
          Kembali ke Beranda
        </button>

      </div>

    </div>

  `;
}


// ==========================================
// EVENT LISTENER QUIZ
// ==========================================

function handleQuizClick(event) {

  const container = getQuizContainer();

  if (!container) return;

  const trigger = event.target.closest("[data-action]");

  if (!trigger || !container.contains(trigger)) {
    return;
  }

  const action = trigger.dataset.action;

  switch (action) {

    case "start-quiz":
      startQuiz();
      break;

    case "select-answer": {
      const optionIndex = Number(
        trigger.dataset.optionIndex
      );

      selectAnswer(optionIndex);
      break;
    }

    case "next-question":
      nextQuestion();
      break;

    case "previous-question":
      previousQuestion();
      break;

    case "retake-quiz":
      startQuiz();
      break;

    default:
      break;

  }
}


// ==========================================
// INISIALISASI QUIZ
// ==========================================

export function initQuiz() {

  const container = getQuizContainer();

  if (!container || isQuizInitialized) {
    return;
  }

  // Periksa data pertanyaan
  if (!validateQuizData()) {
    renderQuizError();
    return;
  }

  // Pasang event listener satu kali
  container.addEventListener(
    "click",
    handleQuizClick
  );

  // Pasang event listener untuk Retake Quiz
  document.addEventListener(
    "mindquest:retake-quiz",
    startQuiz
  );

  isQuizInitialized = true;

  // Tampilkan halaman pengantar
  renderQuizIntro();

}
