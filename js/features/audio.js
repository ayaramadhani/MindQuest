/**
 * audio.js — Audio Relaxation (Anggota 3)
 *
 * Kontrak (Dokumen Acuan v1.0):
 *  - Fungsi publik : playTrack(trackId), pauseTrack()
 *  - 3–5 track, tanpa autoplay, hanya satu track aktif pada satu waktu
 *  - Tombol mencerminkan status audio yang sebenarnya
 *  - Jika file gagal dimuat, tampilkan pesan yang ramah
 *  - Render hanya di #audio-view
 *
 * Cara pakai di app.js : initAudio();   // sekali saat aplikasi dimuat
 *
 * Satu objek Audio dipakai untuk semua track, sehingga mustahil ada dua track
 * yang berbunyi bersamaan.
 *
 * Volume terakhir disimpan di mindquest_settings sebagai { audioVolume: 0..1 }
 * (key opsional milik bersama; hanya properti audioVolume yang disentuh).
 */
import { getStoredData, setStoredData } from '../storage.js';

const SETTINGS_KEY = 'mindquest_settings';
const DEFAULT_VOLUME = 0.7;

/**
 * Daftar track (konfigurasi statis). Ganti title/description/src sesuai file yang
 * benar-benar dipakai, lalu catat sumber dan lisensinya di docs/asset-sources.md.
 * src relatif terhadap index.html.
 */
export const TRACKS = [
  {
    id: 'rain',
    title: 'Hujan Lembut',
    description: 'Suara hujan yang stabil untuk menenangkan pikiran.',
    src: 'assets/audio/rain-soft.mp3',
    icon: '🌧️',
  },
  {
    id: 'forest',
    title: 'Pagi di Hutan',
    description: 'Kicau burung dan angin di antara pepohonan.',
    src: 'assets/audio/forest-morning.mp3',
    icon: '🌲',
  },
  {
    id: 'ocean',
    title: 'Ombak Pantai',
    description: 'Ombak pelan yang berulang untuk rileks atau fokus.',
    src: 'assets/audio/ocean-waves.mp3',
    icon: '🌊',
  },
  {
    id: 'piano',
    title: 'Piano Tenang',
    description: 'Piano instrumental dengan tempo lambat.',
    src: 'assets/audio/calm-piano.mp3',
    icon: '🎹',
  },
];

const audio = new Audio();
audio.loop = true;
audio.preload = 'none';

let initialized = false;
let currentTrackId = null;

const byId = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ */
/* API publik (kontrak)                                                */
/* ------------------------------------------------------------------ */

/**
 * Memutar satu track dan menghentikan track lain.
 * Jika track yang sama sedang dijeda, pemutaran dilanjutkan.
 * @returns {Promise<boolean>} true jika pemutaran berhasil dimulai
 */
export async function playTrack(trackId) {
  const track = TRACKS.find((item) => item.id === trackId);
  if (!track) {
    setMessage('Audio yang dipilih tidak ditemukan.');
    return false;
  }

  setMessage('');

  if (currentTrackId !== trackId) {
    audio.pause();
    currentTrackId = trackId;
    audio.src = track.src;
  }

  try {
    await audio.play();
    return true;
  } catch (error) {
    // AbortError terjadi saat pengguna berpindah track dengan cepat; bukan kesalahan.
    if (error.name !== 'AbortError' && !byId('audio-message')?.textContent) {
      setMessage('Audio tidak dapat diputar. Coba pilih audio lain.');
      console.error(`audio.js: gagal memutar "${track.src}"`, error);
    }
    renderState();
    return false;
  }
}

/** Menjeda audio yang sedang aktif. */
export function pauseTrack() {
  audio.pause();
}

/** Mengatur volume (0..1) dan menyimpannya. */
export function setVolume(value) {
  const volume = Math.min(1, Math.max(0, Number(value)));
  audio.volume = Number.isNaN(volume) ? DEFAULT_VOLUME : volume;
  renderVolume();
}

/* ------------------------------------------------------------------ */
/* Tampilan                                                            */
/* ------------------------------------------------------------------ */

export function initAudio() {
  const root = byId('audio-view');
  if (!root) {
    console.error('audio.js: container #audio-view tidak ditemukan di index.html.');
    return;
  }
  if (initialized) {
    renderState();
    return;
  }

  buildLayout(root);
  restoreVolume();
  attachEvents();
  renderState();
  initialized = true;
}

function buildLayout(root) {
  const cards = TRACKS.map(
    (track) => `
      <li class="audio-track" data-track-id="${track.id}">
        <span class="audio-track-icon" aria-hidden="true">${track.icon}</span>
        <div class="audio-track-body">
          <h3 class="audio-track-title">${track.title}</h3>
          <p class="audio-track-description">${track.description}</p>
        </div>
        <button class="audio-button" type="button" data-track-id="${track.id}">Putar</button>
      </li>`
  ).join('');

  root.innerHTML = `
    <section class="audio-section" aria-labelledby="audio-heading">
      <header class="audio-header">
        <h2 class="audio-title" id="audio-heading">Audio Relaksasi</h2>
        <p class="audio-subtitle">Pilih satu suara lalu tekan Putar. Audio tidak menyala otomatis.</p>
      </header>

      <div class="audio-player" id="audio-player">
        <div class="audio-equalizer" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="audio-now">
          <p class="audio-now-label">Sedang diputar</p>
          <p class="audio-now-title" id="audio-now-title">Belum ada audio dipilih</p>
        </div>
        <div class="audio-volume">
          <label class="audio-volume-label" for="audio-volume">Volume</label>
          <input class="audio-volume-input" type="range" id="audio-volume" min="0" max="100" step="1">
          <output class="audio-volume-value" id="audio-volume-value" for="audio-volume"></output>
        </div>
      </div>

      <p class="audio-message" id="audio-message" role="status" aria-live="polite"></p>

      <ul class="audio-track-list" id="audio-track-list">${cards}</ul>
    </section>`;
}

function attachEvents() {
  byId('audio-track-list').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-track-id]');
    if (!button) return;

    const trackId = button.dataset.trackId;
    if (trackId === currentTrackId && !audio.paused) pauseTrack();
    else playTrack(trackId);
  });

  const slider = byId('audio-volume');
  slider.addEventListener('input', () => setVolume(slider.value / 100));
  slider.addEventListener('change', saveVolume);

  // Tombol dan teks selalu mengikuti status audio yang sebenarnya.
  ['play', 'pause', 'ended'].forEach((name) => audio.addEventListener(name, renderState));
  audio.addEventListener('error', () => {
    if (!currentTrackId) return;
    console.error(`audio.js: file "${audio.currentSrc}" gagal dimuat.`);
    setMessage('Audio ini tidak dapat dimuat. Coba pilih audio lain.');
    renderState();
  });
}

function renderState() {
  const playing = Boolean(currentTrackId) && !audio.paused;
  const current = TRACKS.find((track) => track.id === currentTrackId);

  byId('audio-player').classList.toggle('audio-player-playing', playing);
  byId('audio-now-title').textContent = current ? current.title : 'Belum ada audio dipilih';

  document.querySelectorAll('#audio-track-list .audio-track').forEach((card) => {
    const track = TRACKS.find((item) => item.id === card.dataset.trackId);
    const isPlaying = playing && track.id === currentTrackId;
    const button = card.querySelector('.audio-button');

    card.classList.toggle('audio-track-playing', isPlaying);
    button.textContent = isPlaying ? 'Jeda' : 'Putar';
    button.setAttribute('aria-label', `${isPlaying ? 'Jeda' : 'Putar'} ${track.title}`);
  });
}

function setMessage(text) {
  const element = byId('audio-message');
  if (element) element.textContent = text;
}

function renderVolume() {
  const percent = Math.round(audio.volume * 100);
  const slider = byId('audio-volume');
  if (slider) slider.value = String(percent);
  const output = byId('audio-volume-value');
  if (output) output.textContent = `${percent}%`;
}

function restoreVolume() {
  const settings = getStoredData(SETTINGS_KEY, {});
  const saved = Number(settings && typeof settings === 'object' ? settings.audioVolume : NaN);
  setVolume(Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : DEFAULT_VOLUME);
}

function saveVolume() {
  const stored = getStoredData(SETTINGS_KEY, {});
  const settings = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  setStoredData(SETTINGS_KEY, { ...settings, audioVolume: audio.volume });
}