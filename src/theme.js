const STORAGE_KEY = 'brag-theme';
const MODES = ['system', 'light', 'dark'];

function getSavedMode() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

function getSystemIsDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(mode) {
  const html = document.documentElement;
  if (mode === 'system') {
    if (getSystemIsDark()) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  } else if (mode === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

function setMode(mode) {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
  updateSwitcherUI(mode);
}

function updateSwitcherUI(mode) {
  const pill = document.getElementById('theme-pill');
  if (!pill) return;
  const index = MODES.indexOf(mode);
  pill.style.transform = `translateX(${index * 100}%)`;
}

function initTheme() {
  const mode = getSavedMode();
  applyTheme(mode);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (getSavedMode() === 'system') {
      applyTheme('system');
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    setMode(btn.dataset.mode);
  });

  updateSwitcherUI(mode);
}

export { initTheme };
