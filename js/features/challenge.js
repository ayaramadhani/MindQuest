import { getStoredData, setStoredData } from "../storage.js";
import { CHALLENGES_DATA, CATEGORY_ICONS } from "../data/challenge-data.js";

const CHALLENGE_STORAGE_KEY = "mindquest_challenges";
let activeCategory = "All";
let recentlyCompletedId = null;

function getChallengeState() {
  const defaultState = { completedIds: [], totalPoints: 0 };
  const stored = getStoredData(CHALLENGE_STORAGE_KEY, defaultState);
  const validIds = Array.isArray(stored.completedIds) ? stored.completedIds : [];
  return {
    completedIds: validIds,
    totalPoints: validIds.length * 10
  };
}

export function completeChallenge(challengeId) {
  const challengeExists = CHALLENGES_DATA.some((item) => item.id === challengeId);
  if (!challengeExists) return false;

  const state = getChallengeState();

  if (state.completedIds.includes(challengeId)) {
    return false;
  }

  const updatedIds = [...state.completedIds, challengeId];
  const updatedState = {
    completedIds: updatedIds,
    totalPoints: updatedIds.length * 10
  };

  recentlyCompletedId = challengeId;
  setStoredData(CHALLENGE_STORAGE_KEY, updatedState);
  renderChallenges();

  setTimeout(() => {
    recentlyCompletedId = null;
  }, 900);

  return true;
}

export function renderChallenges() {
  const container = document.getElementById("challenge-content");
  if (!container) return;

  const state = getChallengeState();
  const totalChallenges = CHALLENGES_DATA.length;
  const completedCount = state.completedIds.length;
  const maxPoints = totalChallenges * 10;
  const progressPercent = Math.round((completedCount / totalChallenges) * 100);

  const categories = ["All", "Self Reflection", "Creativity", "Social Connection"];
  const filteredChallenges = activeCategory === "All"
    ? CHALLENGES_DATA
    : CHALLENGES_DATA.filter((item) => item.category === activeCategory);

  container.innerHTML = `
    <div class="mq-challenge-header mq-card mq-fade-in">
      <div class="mq-progress-top">
        <div>
          <h2>Mini Self-Care Challenge</h2>
          <p>Selesaikan tantangan kecil harian untuk mengumpulkan poin refleksi diri.</p>
        </div>
        <div class="mq-points-badge ${recentlyCompletedId ? "mq-pop-anim" : ""}">
          <span class="mq-points-value">${state.totalPoints}</span>
          <span class="mq-points-label">/ ${maxPoints} Poin</span>
        </div>
      </div>

      <div class="mq-progress-bar-bg">
        <div class="mq-progress-bar-fill" style="width: ${progressPercent}%"></div>
      </div>
      <p class="mq-progress-caption">${completedCount} dari ${totalChallenges} tantangan selesai (${progressPercent}%)</p>

      <div class="mq-filter-group">
        ${categories
          .map(
            (cat) => `
            <button 
              class="mq-filter-btn ${activeCategory === cat ? "active" : ""}" 
              data-category="${cat}">
              ${cat}
            </button>`
          )
          .join("")}
      </div>
    </div>

    <div class="mq-challenge-grid">
      ${filteredChallenges
        .map((item) => {
          const isDone = state.completedIds.includes(item.id);
          const isJustCompleted = recentlyCompletedId === item.id;
          const iconSvg = CATEGORY_ICONS[item.category] || "";

          return `
            <div class="mq-card mq-challenge-card ${isDone ? "is-completed" : ""} ${isJustCompleted ? "mq-card-celebrate" : ""}">
              ${isJustCompleted ? `<div class="mq-floating-plus">+10 Poin!</div>` : ""}
              <div class="mq-challenge-meta">
                <span class="mq-category-tag">${iconSvg} ${item.category}</span>
                <span class="mq-point-tag">+${item.points} Poin</span>
              </div>
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <button 
                class="mq-btn ${isDone ? "mq-btn-done" : "mq-btn-primary"} btn-complete-challenge" 
                data-id="${item.id}"
                ${isDone ? "disabled" : ""}>
                ${isDone ? "✓ Selesai" : "Tandai Selesai"}
              </button>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  container.querySelectorAll(".mq-filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      activeCategory = e.currentTarget.dataset.category;
      renderChallenges();
    });
  });

  container.querySelectorAll(".btn-complete-challenge").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      completeChallenge(id);
    });
  });
}