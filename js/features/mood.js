/**
 * mood.js — Mood Tracker (Anggota 3)
 *
 * Kontrak (Dokumen Acuan v1.0):
 *  - Key LocalStorage : mindquest_mood_history
 *  - Skema entri      : { id: "mood-YYYYMMDD", date: "YYYY-MM-DD", mood, note }
 *  - Mood ID          : happy, calm, neutral, sad, stressed
 *  - Satu entri per tanggal; menyimpan lagi pada tanggal yang sama = memperbarui.
 *  - Fungsi publik    : saveMoodEntry(entry), deleteMoodEntry(entryId)
 *  - Render hanya di  : #mood-view
 *
 * Cara pakai di app.js : initMood();      // sekali saat aplikasi dimuat
 * Saat view dibuka     : renderMood();    // panggil setelah showView('mood')
 *
 * Grafik memakai Chart.js yang harus dimuat global (window.Chart) di index.html.
 */
import { getStoredData, setStoredData } from '../storage.js';

const STORAGE_KEY = 'mindquest_mood_history';
const NOTE_MAX_LENGTH = 300;
const CHART_MAX_POINTS = 14;

/**
 * score dipakai hanya untuk sumbu grafik (1 = paling berat, 5 = paling ringan).
 * Ganti `icon` dengan <img> dari assets/images/mood/ jika ilustrasi sudah siap.
 */
export const MOODS = [
  { id: 'happy', label: 'Senang', icon: '😊', score: 5 },
  { id: 'calm', label: 'Tenang', icon: '😌', score: 4 },
  { id: 'neutral', label: 'Biasa', icon: '😐', score: 3 },
  { id: 'sad', label: 'Sedih', icon: '😔', score: 2 },
  { id: 'stressed', label: 'Stres', icon: '😣', score: 1 },
];

let initialized = false;
let editingId = null;
let chartInstance = null;

/* ------------------------------------------------------------------ */
/* Helper tanggal & data                                               */
/* ------------------------------------------------------------------ */

/** Tanggal lokal (WITA) dalam format YYYY-MM-DD. Jangan pakai toISOString (UTC). */
function toDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isValidDateKey(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function formatLongDate(key) {
  return parseDateKey(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(key) {
  return parseDateKey(key).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function findMood(id) {
  return MOODS.find((mood) => mood.id === id);
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry === 'object' &&
    isValidDateKey(entry.date) &&
    Boolean(findMood(entry.mood))
  );
}

/** Riwayat mood, terbaru di atas. Data rusak atau tidak sesuai skema dibuang. */
export function getMoodHistory() {
  const raw = getStoredData(STORAGE_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isValidEntry)
    .map((entry) => ({
      id: `mood-${entry.date.replaceAll('-', '')}`, // id selalu diturunkan dari tanggal
      date: entry.date,
      mood: entry.mood,
      note: typeof entry.note === 'string' ? entry.note : '',
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/* ------------------------------------------------------------------ */
/* API publik (kontrak)                                                */
/* ------------------------------------------------------------------ */

/**
 * Membuat atau memperbarui entri mood berdasarkan tanggal.
 * @param {{date?: string, mood: string, note?: string}} entry
 * @returns {{ok: true, updated: boolean, entry: object} | {ok: false, error: string}}
 */
export function saveMoodEntry(entry) {
  const date = entry?.date || toDateKey();
  const mood = entry?.mood;
  const note = String(entry?.note ?? '').trim().slice(0, NOTE_MAX_LENGTH);

  if (!findMood(mood)) return { ok: false, error: 'Pilih salah satu mood terlebih dahulu.' };
  if (!isValidDateKey(date)) return { ok: false, error: 'Tanggal tidak valid.' };
  if (date > toDateKey()) return { ok: false, error: 'Tanggal tidak boleh di masa depan.' };

  const history = getMoodHistory();
  const id = `mood-${date.replaceAll('-', '')}`;
  const index = history.findIndex((item) => item.id === id);
  const newEntry = { id, date, mood, note };

  if (index >= 0) history[index] = newEntry;
  else history.push(newEntry);

  history.sort((a, b) => b.date.localeCompare(a.date));

  if (!setStoredData(STORAGE_KEY, history)) {
    return { ok: false, error: 'Catatan gagal disimpan. Periksa penyimpanan browser Anda.' };
  }
  return { ok: true, updated: index >= 0, entry: newEntry };
}

/**
 * Menghapus satu entri mood.
 * @returns {boolean} true jika ada entri yang terhapus
 */
export function deleteMoodEntry(entryId) {
  const history = getMoodHistory();
  const next = history.filter((item) => item.id !== entryId);
  if (next.length === history.length) return false;
  return setStoredData(STORAGE_KEY, next);
}

/* ------------------------------------------------------------------ */
/* Tampilan                                                            */
/* ------------------------------------------------------------------ */

const byId = (id) => document.getElementById(id);

export function initMood() {
  const root = byId('mood-view');
  if (!root) {
    console.error('mood.js: container #mood-view tidak ditemukan di index.html.');
    return;
  }
  if (!initialized) {
    buildLayout(root);
    attachEvents();
    resetForm();
    initialized = true;
  }
}

/** Muat ulang riwayat dan grafik. Panggil setiap kali view mood dibuka. */
export function renderMood() {
  if (!initialized) return;
  byId('mood-date').max = toDateKey();
  renderHistory();
  renderChart();
}

function buildLayout(root) {
  const options = MOODS.map(
    (mood) => `
      <label class="mood-option">
        <input class="mood-option-input" type="radio" name="mood" value="${mood.id}">
        <span class="mood-option-card">
          <span class="mood-option-icon" aria-hidden="true">${mood.icon}</span>
          <span class="mood-option-label">${mood.label}</span>
        </span>
      </label>`
  ).join('');

  root.innerHTML = `
    <section class="mood-section" aria-labelledby="mood-heading">
      <header class="mood-header">
        <h2 class="mood-title" id="mood-heading">Mood Tracker</h2>
        <p class="mood-subtitle">Catat suasana hatimu. Satu catatan untuk setiap hari.</p>
      </header>

      <div class="mood-layout">
        <form class="mood-form" id="mood-form" novalidate>
          <fieldset class="mood-fieldset">
            <legend class="mood-legend">Bagaimana perasaanmu?</legend>
            <div class="mood-options">${options}</div>
          </fieldset>

          <div class="mood-field">
            <label class="mood-label" for="mood-date">Tanggal</label>
            <input class="mood-input" type="date" id="mood-date" name="date" required>
            <p class="mood-hint" id="mood-date-hint"></p>
          </div>

          <div class="mood-field">
            <label class="mood-label" for="mood-note">Catatan (opsional)</label>
            <textarea class="mood-textarea" id="mood-note" name="note" rows="4"
              maxlength="${NOTE_MAX_LENGTH}"
              placeholder="Tulis singkat apa yang kamu rasakan."></textarea>
            <p class="mood-hint"><span id="mood-note-count">0</span>/${NOTE_MAX_LENGTH} karakter. Jangan menulis data pribadi atau sensitif.</p>
          </div>

          <p class="mood-message" id="mood-message" role="status" aria-live="polite"></p>

          <div class="mood-actions">
            <button class="mood-button mood-button-primary" type="submit" id="mood-submit">Simpan mood</button>
            <button class="mood-button mood-button-secondary" type="button" id="mood-cancel" hidden>Batal edit</button>
          </div>
        </form>

        <div class="mood-panel">
          <section class="mood-card" aria-labelledby="mood-chart-heading">
            <h3 class="mood-card-title" id="mood-chart-heading">Tren ${CHART_MAX_POINTS} catatan terakhir</h3>
            <div class="mood-chart-wrap" id="mood-chart-wrap">
              <canvas id="mood-chart" role="img" aria-label="Grafik garis tren mood dari catatan terakhir"></canvas>
            </div>
            <p class="mood-empty" id="mood-chart-empty" hidden></p>
          </section>

          <section class="mood-card" aria-labelledby="mood-history-heading">
            <h3 class="mood-card-title" id="mood-history-heading">Riwayat mood</h3>
            <ul class="mood-history" id="mood-history"></ul>
            <p class="mood-empty" id="mood-history-empty" hidden>
              Belum ada catatan. Pilih mood pada formulir, lalu tekan Simpan mood.
            </p>
          </section>
        </div>
      </div>
    </section>`;
}

function attachEvents() {
  byId('mood-form').addEventListener('submit', handleSubmit);
  byId('mood-cancel').addEventListener('click', () => resetForm());
  byId('mood-date').addEventListener('change', updateDateHint);
  byId('mood-note').addEventListener('input', updateNoteCount);
  byId('mood-history').addEventListener('click', handleHistoryClick);
}

function handleSubmit(event) {
  event.preventDefault();
  const selected = document.querySelector('#mood-form input[name="mood"]:checked');

  const result = saveMoodEntry({
    date: byId('mood-date').value,
    mood: selected ? selected.value : null,
    note: byId('mood-note').value,
  });

  if (!result.ok) {
    showMessage(result.error, true);
    return;
  }

  const dateText = formatLongDate(result.entry.date);
  resetForm({ keepMessage: true });
  showMessage(
    result.updated
      ? `Catatan ${dateText} diperbarui.`
      : `Mood untuk ${dateText} tersimpan.`
  );
  renderHistory();
  renderChart();
}

function handleHistoryClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'edit') startEdit(id);
  if (action === 'delete') confirmDelete(id);
}

function startEdit(id) {
  const entry = getMoodHistory().find((item) => item.id === id);
  if (!entry) return;

  editingId = id;
  const radio = document.querySelector(`#mood-form input[name="mood"][value="${entry.mood}"]`);
  if (radio) radio.checked = true;

  const dateInput = byId('mood-date');
  dateInput.value = entry.date;
  dateInput.disabled = true; // tanggal tidak diubah saat edit, agar tidak membuat entri ganda
  byId('mood-note').value = entry.note;

  byId('mood-submit').textContent = 'Perbarui mood';
  byId('mood-cancel').hidden = false;
  showMessage('');
  updateNoteCount();
  updateDateHint();
  byId('mood-form').scrollIntoView({ block: 'nearest' });
}

function confirmDelete(id) {
  const entry = getMoodHistory().find((item) => item.id === id);
  if (!entry) return;

  if (!window.confirm(`Hapus catatan mood tanggal ${formatLongDate(entry.date)}?`)) return;

  if (deleteMoodEntry(id)) {
    if (editingId === id) resetForm();
    showMessage('Catatan dihapus.');
    renderHistory();
    renderChart();
  } else {
    showMessage('Catatan gagal dihapus.', true);
  }
}

function resetForm({ keepMessage = false } = {}) {
  byId('mood-form').reset();
  editingId = null;

  const dateInput = byId('mood-date');
  dateInput.disabled = false;
  dateInput.max = toDateKey();
  dateInput.value = toDateKey();

  byId('mood-submit').textContent = 'Simpan mood';
  byId('mood-cancel').hidden = true;
  if (!keepMessage) showMessage('');
  updateNoteCount();
  updateDateHint();
}

function showMessage(text, isError = false) {
  const element = byId('mood-message');
  element.textContent = text;
  element.classList.toggle('mood-message-error', Boolean(text) && isError);
}

function updateNoteCount() {
  byId('mood-note-count').textContent = String(byId('mood-note').value.length);
}

function updateDateHint() {
  const hint = byId('mood-date-hint');
  if (editingId) {
    hint.textContent = 'Tanggal tidak dapat diubah saat mengedit.';
    return;
  }
  const date = byId('mood-date').value;
  const exists = getMoodHistory().some((item) => item.date === date);
  hint.textContent = exists
    ? 'Sudah ada catatan pada tanggal ini. Menyimpan akan memperbarui catatan tersebut.'
    : '';
}

function renderHistory() {
  const list = byId('mood-history');
  const history = getMoodHistory();

  list.replaceChildren();
  byId('mood-history-empty').hidden = history.length > 0;
  history.forEach((entry) => list.appendChild(createHistoryItem(entry)));
  updateDateHint();
}

function createHistoryItem(entry) {
  const mood = findMood(entry.mood);
  const dateText = formatLongDate(entry.date);

  const item = document.createElement('li');
  item.className = 'mood-entry';

  const icon = document.createElement('span');
  icon.className = 'mood-entry-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = mood.icon;

  const body = document.createElement('div');
  body.className = 'mood-entry-body';

  const title = document.createElement('p');
  title.className = 'mood-entry-title';
  title.textContent = `${mood.label} · ${dateText}`;
  body.appendChild(title);

  if (entry.note) {
    const note = document.createElement('p');
    note.className = 'mood-entry-note';
    note.textContent = entry.note; // textContent: catatan pengguna tidak dieksekusi sebagai HTML
    body.appendChild(note);
  }

  const actions = document.createElement('div');
  actions.className = 'mood-entry-actions';
  actions.appendChild(createActionButton('edit', entry.id, 'Edit', `Edit catatan ${dateText}`));
  actions.appendChild(createActionButton('delete', entry.id, 'Hapus', `Hapus catatan ${dateText}`));

  item.append(icon, body, actions);
  return item;
}

function createActionButton(action, id, text, ariaLabel) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mood-link-button';
  button.dataset.action = action;
  button.dataset.id = id;
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel);
  return button;
}

function renderChart() {
  const wrap = byId('mood-chart-wrap');
  const message = byId('mood-chart-empty');

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const entries = getMoodHistory().slice(0, CHART_MAX_POINTS).reverse(); // lama -> baru

  if (typeof window.Chart === 'undefined') {
    wrap.hidden = true;
    message.hidden = false;
    message.textContent = 'Grafik tidak dapat ditampilkan karena Chart.js belum dimuat.';
    return;
  }
  if (entries.length < 2) {
    wrap.hidden = true;
    message.hidden = false;
    message.textContent = 'Grafik muncul setelah kamu memiliki minimal 2 catatan.';
    return;
  }

  wrap.hidden = false;
  message.hidden = true;

  const styles = getComputedStyle(document.documentElement);
  const dark = styles.getPropertyValue('--color-dark-green').trim() || '#344E41';
  const sage = styles.getPropertyValue('--color-sage').trim() || '#A3B18A';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const labelForScore = (score) => MOODS.find((mood) => mood.score === score)?.label ?? '';

  chartInstance = new window.Chart(byId('mood-chart'), {
    type: 'line',
    data: {
      labels: entries.map((entry) => formatShortDate(entry.date)),
      datasets: [
        {
          label: 'Mood',
          data: entries.map((entry) => findMood(entry.mood).score),
          borderColor: dark,
          backgroundColor: sage,
          pointBackgroundColor: dark,
          pointRadius: 4,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion ? false : undefined,
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: { stepSize: 1, color: dark, callback: labelForScore },
          grid: { color: 'rgba(52, 78, 65, 0.12)' },
        },
        x: { ticks: { color: dark }, grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => labelForScore(context.parsed.y) } },
      },
    },
  });
}