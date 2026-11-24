export const STORAGE_KEYS = Object.freeze({
  QUIZ_RESULT: "mindquest_quiz_result",
  CHALLENGES: "mindquest_challenges",
  MOOD_HISTORY: "mindquest_mood_history",
  SETTINGS: "mindquest_settings",
});

/**
 * Membaca data JSON dari LocalStorage dengan nilai fallback aman.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
export function getStoredData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.error(`Gagal membaca data LocalStorage (${key}):`, error);
    return fallback;
  }
}

/**
 * Menyimpan objek atau array ke LocalStorage dalam format JSON.
 * @param {string} key
 * @param {*} value
 * @returns {boolean}
 */
export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Gagal menyimpan data LocalStorage (${key}):`, error);
    return false;
  }
}

/**
 * Menghapus satu key spesifik dari LocalStorage tanpa menyentuh fitur lain.
 * @param {string} key
 * @returns {boolean}
 */
export function removeStoredData(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Gagal menghapus data LocalStorage (${key}):`, error);
    return false;
  }
}