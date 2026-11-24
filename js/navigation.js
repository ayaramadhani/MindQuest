import { renderPersonalityResult } from "./features/results.js";
import { renderMood } from "./features/mood.js";

export const VALID_VIEWS = Object.freeze([
  "home",
  "quiz",
  "results",
  "mood",
  "challenge",
  "audio",
]);

let isNavigationInitialized = false;

/**
 * Menampilkan salah satu view utama dan menyembunyikan view lainnya.
 * @param {string} viewName - home | quiz | results | mood | challenge | audio
 */
export function showView(viewName) {
  const targetView = VALID_VIEWS.includes(viewName) ? viewName : "home";

  // 1. Atur visibilitas semua container view
  VALID_VIEWS.forEach((name) => {
    const section = document.getElementById(`${name}-view`);
    if (!section) return;

    const isTarget = name === targetView;
    section.classList.toggle("is-active", isTarget);
    section.hidden = !isTarget;
  });

  // 2. Perbarui status aktif tombol navbar
document.querySelectorAll("[data-nav]").forEach((link) => {
  const active = link.dataset.nav === targetView;

  link.classList.toggle("is-active", active);

  if (active) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

  // 3. Tutup drawer menu mobile jika sedang terbuka
  const navMenu = document.getElementById("mq-nav-menu");
  const navToggle = document.getElementById("mq-nav-toggle");
  if (navMenu && navToggle) {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  // 4. Jalankan hook render khusus saat berpindah ke view tertentu
  if (targetView === "results") {
    renderPersonalityResult();
  }

  if (targetView === "mood") {
    renderMood();
  }

  // 5. Sinkronkan hash URL & gulir ke atas
  if (window.location.hash !== `#${targetView}`) {
    history.replaceState(null, "", `#${targetView}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Memasang event listener navigasi global satu kali (delegated).
 */
export function initNavigation() {
  if (isNavigationInitialized) return;
  isNavigationInitialized = true;

  // Delegasi klik untuk semua elemen beratribut data-view di seluruh halaman
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-view]");
    if (!trigger) return;

    event.preventDefault();
    const viewName = trigger.dataset.view;
    showView(viewName);
  });

  // Toggle menu mobile
  const navToggle = document.getElementById("mq-nav-toggle");
  const navMenu = document.getElementById("mq-nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const willOpen = !navMenu.classList.contains("is-open");
      navMenu.classList.toggle("is-open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
    });
  }
}