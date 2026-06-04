import { initTheme } from './theme.js';
initTheme();

const cards = document.querySelectorAll('#grid > a');
const search = document.getElementById('search');
const stats = document.getElementById('stats');
const empty = document.getElementById('empty');

if (search) {
  function updateStats(visible) {
    if (visible === 0) {
      empty.classList.remove('hidden');
      stats.textContent = '';
    } else {
      empty.classList.add('hidden');
      const countries = new Set(
        Array.from(cards).filter(c => !c.classList.contains('hidden')).map(c => c.dataset.country)
      ).size;
      stats.textContent = `${visible} brag page${visible !== 1 ? 's' : ''} across ${countries} countries`;
    }
  }

  search.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    let visible = 0;

    for (const card of cards) {
      if (!q || card.dataset.search.includes(q)) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    }

    updateStats(visible);
  });
}
