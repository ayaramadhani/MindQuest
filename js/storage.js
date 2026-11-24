export function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.error(`Gagal membaca ${key}:`, error);
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Gagal menyimpan ${key}:`, error);
    return false;
  }
}

export function removeStoredData(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Gagal menghapus ${key}:`, error);
    return false;
  }
}