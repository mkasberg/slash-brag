const dataScript = document.getElementById('people-data');
const people = JSON.parse(dataScript.textContent);

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const stats = document.getElementById('stats');
const empty = document.getElementById('empty');

function render(entries) {
  grid.innerHTML = '';

  if (entries.length === 0) {
    empty.classList.remove('hidden');
    stats.textContent = '';
    return;
  }

  empty.classList.add('hidden');

  const countries = new Set(entries.map(p => p.country)).size;
  stats.textContent = `${entries.length} brag page${entries.length !== 1 ? 's' : ''} across ${countries} countries`;

  for (const person of entries) {
    const card = document.createElement('a');
    card.href = person.url;
    card.target = '_blank';
    card.className = 'block bg-brag-card border border-brag-card-border rounded-2xl p-8 transition-all duration-200 hover:border-brag-orange hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,162,97,0.15)]';

    const imgPath = person.image ? `/images/people/${person.image}` : null;
    const location = [person.city, person.state, person.country].filter(Boolean).join(', ');
    const displayUrl = person.url.replace(/^https?:\/\//, '');

    const showFallback = !imgPath ? 'hidden' : '';
    const fallbackDisplay = !imgPath ? 'flex' : 'hidden';

    card.innerHTML = `
      <div class="flex items-center gap-4 mb-3">
        <img
          src="${imgPath || ''}"
          alt="${person.name}"
          class="w-14 h-14 shrink-0 rounded-full border-2 border-brag-orange object-cover ${showFallback}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="w-14 h-14 shrink-0 rounded-full border-2 border-brag-orange bg-gradient-to-br from-brag-search-bg to-brag-card-border items-center justify-center text-2xl ${fallbackDisplay}">
          ${person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 class="font-heading font-bold text-2xl text-white">${person.name}</h3>
          <p class="text-brag-text-muted text-base">${person.tagline}</p>
        </div>
      </div>
      <p class="text-brag-text-dim text-sm flex items-center gap-1.5">
        <span>📍</span>
        <span>${location}</span>
      </p>
      <p class="text-brag-orange text-sm mt-2 truncate">${displayUrl}</p>
    `;

    grid.appendChild(card);
  }
}

function filter(query) {
  const q = query.toLowerCase().trim();
  if (!q) return people;
  return people.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.tagline || '').toLowerCase().includes(q) ||
    (p.city || '').toLowerCase().includes(q) ||
    (p.state || '').toLowerCase().includes(q) ||
    (p.country || '').toLowerCase().includes(q) ||
    (p.url || '').toLowerCase().includes(q)
  );
}

search.addEventListener('input', (e) => {
  render(filter(e.target.value));
});

render(people);
