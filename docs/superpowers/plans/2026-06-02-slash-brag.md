# /BRAG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-mode static directory site for personal /brag pages, deployed to GitHub Pages.

**Architecture:** Vite + Tailwind CSS + vanilla JS. A Vite plugin reads `data/people.json` at build time and injects it into the HTML. Client-side JS parses the injected JSON and implements real-time search across name, tagline, and location fields.

**Tech Stack:** Vite, Tailwind CSS, Google Fonts (Outfit, DM Sans), vanilla JS, GitHub Actions

---

## File Structure

```
/
├── data/
│   └── people.json
├── images/
│   └── people/
│       └── .gitkeep
├── src/
│   ├── index.html
│   ├── about.html
│   ├── main.js
│   └── style.css
├── vite.config.js
├── package.json
├── tailwind.config.js
└── .github/
    └── workflows/
        └── deploy.yml
```

---

### Task 1: Initialize Project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `src/style.css`
- Create: `data/people.json`
- Create: `images/people/.gitkeep`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "slash-brag",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.3.4"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
      },
    },
  },
  plugins: [
    {
      name: 'inject-people-data',
      transformIndexHtml(html) {
        const peoplePath = resolve(__dirname, 'data/people.json');
        const people = JSON.parse(fs.readFileSync(peoplePath, 'utf-8'));
        const scriptTag = `<script type="application/json" id="people-data">${JSON.stringify(people)}</script>`;
        return html.replace('<!-- PEOPLE_DATA -->', scriptTag);
      },
    },
  ],
});
```

- [ ] **Step 3: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        'brag-bg': '#0f0f1a',
        'brag-card': '#16162a',
        'brag-card-border': '#252545',
        'brag-card-hover': '#f4a261',
        'brag-text': '#e8e8ec',
        'brag-text-muted': '#a0a0b0',
        'brag-text-dim': '#6a6a80',
        'brag-search-bg': '#1a1a2e',
        'brag-search-border': '#2a2a4e',
        'brag-gold': '#ffd166',
        'brag-orange': '#f4a261',
        'brag-coral': '#e76f51',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Create src/style.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=DM+Sans:wght@400;500;700&display=swap');

body {
  @apply bg-brag-bg text-brag-text font-body;
}

.brag-gradient {
  background: linear-gradient(135deg, #ffd166 0%, #f4a261 30%, #e76f51 60%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 5: Create data/people.json with sample data**

```json
[
  {
    "key": "mike-kasberg",
    "name": "Mike Kasberg",
    "tagline": "Staff Software Engineer at Strava",
    "city": "Denver",
    "state": "Colorado",
    "country": "United States",
    "created": "2025-01-15",
    "updated": "2025-06-01",
    "url": "https://mikekasberg.com/brag"
  },
  {
    "key": "aaron-francis",
    "name": "Aaron Francis",
    "tagline": "Co-founder of Try Hard Studios",
    "city": "Dallas",
    "state": "Texas",
    "country": "United States",
    "created": "2025-02-10",
    "updated": "2025-06-01",
    "url": "https://aaronfrancis.com/brag"
  },
  {
    "key": "clay-bitner",
    "name": "Clay Bitner",
    "tagline": "Product Designer",
    "city": "San Francisco",
    "state": "California",
    "country": "United States",
    "created": "2025-03-01",
    "updated": "2025-05-15",
    "url": "https://claybitner.com/brag"
  }
]
```

- [ ] **Step 6: Create images/people/.gitkeep**

```
# This directory holds profile photos.
# Photos are named {key}.jpg where key matches the entry in data/people.json.
```

- [ ] **Step 7: Install dependencies and verify build works**

Run: `npm install`
Expected: dependencies install successfully.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js tailwind.config.js src/style.css data/people.json images/people/.gitkeep
git commit -m "chore: initialize vite + tailwind project"
```

---

### Task 2: Build Homepage (index.html)

**Files:**
- Create: `src/index.html`
- Create: `src/main.js`

- [ ] **Step 1: Create src/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>/BRAG — A directory of personal brag pages</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body class="min-h-screen">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Header -->
    <header class="text-center mb-12">
      <h1 class="font-heading font-black text-7xl md:text-8xl tracking-tight brag-gradient drop-shadow-[0_0_40px_rgba(244,162,97,0.3)]">
        /BRAG
      </h1>
      <p class="text-brag-text-muted text-lg mt-4">A directory of personal brag pages. What are you proud of?</p>
    </header>

    <!-- Search -->
    <div class="max-w-lg mx-auto mb-8">
      <input
        type="text"
        id="search"
        placeholder="Search by name, location, or tagline..."
        class="w-full bg-brag-search-bg border border-brag-search-border rounded-xl px-5 py-3.5 text-brag-text placeholder-brag-text-dim focus:outline-none focus:border-brag-orange transition-colors"
      >
    </div>

    <!-- Stats -->
    <p id="stats" class="text-center text-brag-text-dim text-sm mb-8"></p>

    <!-- Grid -->
    <div id="grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>

    <!-- Empty state -->
    <div id="empty" class="hidden text-center py-16">
      <p class="text-brag-text-muted text-lg">No brags found.</p>
      <a href="https://github.com/mkasberg/slash-brag" target="_blank" class="text-brag-orange hover:underline mt-2 inline-block">Be the first to add yours!</a>
    </div>

    <!-- Footer -->
    <footer class="mt-16 pt-8 border-t border-brag-card-border text-center text-brag-text-dim text-sm">
      <a href="./about.html" class="text-brag-orange hover:underline">About</a>
      <span class="mx-2">·</span>
      <a href="https://github.com/mkasberg/slash-brag" target="_blank" class="text-brag-orange hover:underline">GitHub</a>
      <span class="mx-2">·</span>
      <a href="https://github.com/mkasberg/slash-brag#how-to-add-yours" target="_blank" class="text-brag-orange hover:underline">Add yours</a>
    </footer>
  </div>

  <!-- PEOPLE_DATA -->

  <script type="module" src="./main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create src/main.js**

```js
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
    card.className = 'block bg-brag-card border border-brag-card-border rounded-2xl p-6 transition-all duration-200 hover:border-brag-orange hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,162,97,0.15)]';

    const imgPath = `../images/people/${person.key}.jpg`;
    const location = [person.city, person.state, person.country].filter(Boolean).join(', ');

    card.innerHTML = `
      <div class="flex items-center gap-4 mb-3">
        <img
          src="${imgPath}"
          alt="${person.name}"
          class="w-14 h-14 rounded-full border-2 border-brag-orange object-cover"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="w-14 h-14 rounded-full border-2 border-brag-orange bg-gradient-to-br from-brag-search-bg to-brag-card-border items-center justify-center text-xl hidden">
          ${person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 class="font-heading font-bold text-xl text-white">${person.name}</h3>
          <p class="text-brag-text-muted text-sm">${person.tagline}</p>
        </div>
      </div>
      <p class="text-brag-text-dim text-xs flex items-center gap-1.5">
        <span>📍</span>
        <span>${location}</span>
      </p>
    `;

    grid.appendChild(card);
  }
}

function filter(query) {
  const q = query.toLowerCase().trim();
  if (!q) return people;
  return people.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q) ||
    p.city.toLowerCase().includes(q) ||
    p.state.toLowerCase().includes(q) ||
    p.country.toLowerCase().includes(q)
  );
}

search.addEventListener('input', (e) => {
  render(filter(e.target.value));
});

render(people);
```

- [ ] **Step 3: Run dev server and verify homepage renders**

Run: `npm run dev`
Expected: Vite starts, homepage loads at `http://localhost:5173`, sample cards display, search filters work.

- [ ] **Step 4: Commit**

```bash
git add src/index.html src/main.js
git commit -m "feat: add homepage with search"
```

---

### Task 3: Build About Page

**Files:**
- Create: `src/about.html`

- [ ] **Step 1: Create src/about.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — /BRAG</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body class="min-h-screen">
  <div class="max-w-2xl mx-auto px-6 py-12">
    <!-- Header -->
    <header class="text-center mb-16">
      <a href="./index.html" class="font-heading font-black text-6xl md:text-7xl tracking-tight brag-gradient drop-shadow-[0_0_40px_rgba(244,162,97,0.3)] inline-block">
        /BRAG
      </a>
    </header>

    <!-- Content -->
    <article class="space-y-12">
      <section>
        <h2 class="font-heading font-bold text-3xl text-white mb-4">What is a brag page?</h2>
        <p class="text-brag-text-muted leading-relaxed">
          Most websites have an <strong class="text-brag-text">/about</strong> page that tells you someone's background.
          Some have a <strong class="text-brag-text">/now</strong> page that tells you what they're focused on right now.
        </p>
        <p class="text-brag-text-muted leading-relaxed mt-4">
          A <strong class="text-brag-text">/brag</strong> page is where you share what you're proud of — your wins,
          your projects, your journey. It's a public reminder of what you've accomplished and what you're capable of.
        </p>
      </section>

      <section>
        <h2 class="font-heading font-bold text-3xl text-white mb-4">Why have one?</h2>
        <ul class="space-y-3 text-brag-text-muted">
          <li class="flex gap-3">
            <span class="text-brag-orange">→</span>
            <span>It's a confidence boost — writing down your wins reminds you of your progress.</span>
          </li>
          <li class="flex gap-3">
            <span class="text-brag-orange">→</span>
            <span>It's a conversation starter — visitors to your site learn what you care about.</span>
          </li>
          <li class="flex gap-3">
            <span class="text-brag-orange">→</span>
            <span>It's a public commitment — declaring your priorities helps you stay focused.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="font-heading font-bold text-3xl text-white mb-4">How do I get listed?</h2>
        <p class="text-brag-text-muted leading-relaxed mb-4">
          /BRAG is a community-curated directory. To add your brag page:
        </p>
        <ol class="space-y-3 text-brag-text-muted list-decimal list-inside">
          <li>Create a /brag page on your personal website.</li>
          <li>
            <a href="https://github.com/mkasberg/slash-brag" target="_blank" class="text-brag-orange hover:underline">Fork this repo on GitHub</a>.
          </li>
          <li>Add your info to <code class="bg-brag-card px-1.5 py-0.5 rounded text-sm text-brag-text">data/people.json</code>.</li>
          <li>Add your photo to <code class="bg-brag-card px-1.5 py-0.5 rounded text-sm text-brag-text">images/people/</code> (named <code class="bg-brag-card px-1.5 py-0.5 rounded text-sm text-brag-text">{key}.jpg</code>).</li>
          <li>Open a pull request.</li>
        </ol>
      </section>
    </article>

    <!-- Footer -->
    <footer class="mt-16 pt-8 border-t border-brag-card-border text-center text-brag-text-dim text-sm">
      <a href="./index.html" class="text-brag-orange hover:underline">Home</a>
      <span class="mx-2">·</span>
      <a href="https://github.com/mkasberg/slash-brag" target="_blank" class="text-brag-orange hover:underline">GitHub</a>
    </footer>
  </div>
</body>
</html>
```

- [ ] **Step 2: Verify about page renders correctly**

Run: `npm run dev`
Navigate to `http://localhost:5173/about.html`
Expected: About page loads with all three sections, links work, dark theme consistent.

- [ ] **Step 3: Commit**

```bash
git add src/about.html
git commit -m "feat: add about page"
```

---

### Task 4: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Copy images and data to dist
        run: |
          cp -r images dist/
          cp -r data dist/
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add github pages deployment workflow"
```

---

### Task 5: Build, Verify, and Add README

**Files:**
- Create: `README.md`
- Modify: `vite.config.js` (ensure images are copied to dist)

- [ ] **Step 1: Update vite.config.js to copy public assets**

Replace the existing `vite.config.js` with one that uses the `public` directory for images:

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
      },
    },
  },
  plugins: [
    {
      name: 'inject-people-data',
      transformIndexHtml(html) {
        const peoplePath = resolve(__dirname, 'data/people.json');
        const people = JSON.parse(fs.readFileSync(peoplePath, 'utf-8'));
        const scriptTag = `<script type="application/json" id="people-data">${JSON.stringify(people)}</script>`;
        return html.replace('<!-- PEOPLE_DATA -->', scriptTag);
      },
    },
  ],
});
```

Then move images to the public directory:

```bash
mkdir -p public/images/people
mv images/people/* public/images/people/ 2>/dev/null || true
rm -rf images
```

- [ ] **Step 2: Update main.js to use correct image path**

In `src/main.js`, change:
```js
const imgPath = `../images/people/${person.key}.jpg`;
```
to:
```js
const imgPath = `/images/people/${person.key}.jpg`;
```

- [ ] **Step 3: Create README.md**

```markdown
# /BRAG

A directory of personal brag pages.

**Live site:** [slashbrag.com](https://slashbrag.com)

## What is a /brag page?

A /brag page is a page on your personal website where you share what you're proud of — your wins, your projects, your journey.

## How to add yours

1. Create a `/brag` page on your personal website.
2. Fork this repo.
3. Add your info to `data/people.json`.
4. Add your photo to `public/images/people/{key}.jpg`.
5. Open a pull request.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The `dist/` directory will contain the static site.
```

- [ ] **Step 4: Run production build and verify**

Run: `npm run build`
Expected: Build succeeds, `dist/` contains `index.html`, `about.html`, `assets/`, and `images/`.

Run: `npx serve dist`
Verify: Homepage and about page both load correctly, search works, images resolve.

- [ ] **Step 5: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: complete static site with build and readme"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Homepage with gradient /BRAG header | Task 2 |
| Real-time client-side search | Task 2 |
| Stats line | Task 2 |
| Person card grid with photo, name, tagline, location | Task 2 |
| Dark mode only | Task 1 (Tailwind config + CSS) |
| About page with explanation | Task 3 |
| Vite + Tailwind stack | Task 1 |
| people.json data source | Task 1 |
| Build-time data injection | Task 1 (vite plugin) |
| GitHub Pages deployment | Task 4 |
| Submission via PR documented | Task 5 (README) |

---

## Placeholder Scan

No placeholders found. All steps contain exact file paths, exact code, exact commands, and expected outputs.

---

## Type Consistency Check

- `people.json` schema matches spec: `key`, `name`, `tagline`, `city`, `state`, `country`, `created`, `updated`, `url`
- Image path convention: `public/images/people/{key}.jpg`
- Search fields: `name`, `tagline`, `city`, `state`, `country`
- All consistent across tasks.
