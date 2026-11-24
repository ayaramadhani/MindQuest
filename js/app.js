
/*
 * APP.JS
 * Entry point utama MindQuest.
 * Anggota 1 / Integrator
 */

// Import sistem navigasi
import {
  initNavigation,
  showView
} from "./navigation.js";

// Import Home Page
import { renderHome } from "./features/home.js";

// Import Personality Quiz
import { initQuiz } from "./features/quiz.js";

// Import Mood Tracker
import { initMood } from "./features/mood.js";

// Import Mini Challenge
import { initChallenge } from "./features/challenge.js";

// Import Audio Relaxation
import { initAudio } from "./features/audio.js";

function bootstrapApp() {

  // 1. Render Home Page
  renderHome();

  // 2. Inisialisasi Personality Quiz
  initQuiz();

  // 3. Inisialisasi Mood Tracker
  initMood();

  // 4. Inisialisasi Mini Challenge
  initChallenge();

  // 5. Inisialisasi Audio Relaxation
  initAudio();

  // 6. Aktifkan sistem navigasi
  initNavigation();

  // 7. Tentukan halaman awal
  const initialHash = window.location.hash
    .replace("#", "")
    .trim();

  showView(initialHash || "home");
}

// Jalankan aplikasi setelah HTML selesai dimuat
document.addEventListener(
  "DOMContentLoaded",
  bootstrapApp
);
