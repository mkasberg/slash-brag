# /BRAG (slashbrag.com) — Design Spec

**Date:** 2026-06-02
**Status:** Approved

---

## Overview

/BRAG is a static directory website that indexes personal "brag pages" — a /brag URL on someone's personal website where they share what they're proud of. The site is inspired by [nownownow.com](https://nownownow.com) but focuses on brag pages instead of /now pages.

**Goal:** A stylish, simple, dark-mode directory that developers can add themselves to by opening a GitHub PR.

---

## Pages

### 1. Homepage (`/`)
- Bold `/BRAG` header with gradient fill (gold → orange → coral)
- Tagline: "A directory of personal brag pages. What are you proud of?"
- Real-time client-side search bar
- Stats line (e.g., "47 brag pages across 12 countries")
- Grid of person cards (photo, name, tagline, location)
- Footer: About · GitHub · Add Yours

### 2. About Page (`/about`)
- Same dark theme and header style as homepage
- Sections:
  - **What is a brag page?** — Clear explanation inspired by nownownow.com's approach
  - **Why have one?** — Short, punchy reasons
  - **How do I get listed?** — Instructions to open a PR on GitHub with a link to the repo

---

## Data Model

### JSON Schema (per person)

```json
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
}
```

**Field definitions:**
- `key` — URL-safe unique identifier. Used as the image filename: `images/people/{key}.jpg`
- `name` — Display name
- `tagline` — Job title, role, or short descriptor
- `city`, `state`, `country` — Location fields
- `created` — Date the brag page was first listed (ISO 8601)
- `updated` — Date the brag page was last updated (ISO 8601)
- `url` — Full URL to the person's /brag page

**Image path is implicit from `key`.** No image URL stored in JSON. PRs include a `images/people/{key}.jpg` file.

### Source of Truth
All entries live in `data/people.json` (an array of the above objects). The build process reads this file at build time.

---

## Visual Design

### Theme
- **Dark mode only** for MVP
- Background: very dark navy (`#0f0f1a`)
- Text: light gray/white (`#e8e8ec`)

### Header
- `/BRAG` in a very bold, slightly bubbly/curved font (Outfit, weight 900)
- Gradient fill: gold (`#ffd166`) → sandy orange (`#f4a261`) → coral (`#e76f51`)
- Slight text-shadow glow for pop
- No animated sparkles for MVP
- Tagline below in muted gray

### Cards
- Background: slightly lighter dark (`#16162a`)
- Border: subtle (`#252545`)
- Border-radius: 16px
- On hover: border shifts to warm accent (`#f4a261`), subtle lift and glow shadow
- Avatar: circular, 56px, with warm accent border
- Name: bold white (Outfit)
- Tagline: muted warm gray
- Location: very muted gray with pin emoji

### Search
- Full-width (max 500px) search bar
- Dark background (`#1a1a2e`), subtle border
- Placeholder: "Search by name, location, or tagline..."

### Footer
- Centered, muted text
- Links in warm accent color
- Border top in subtle dark shade

### Typography
- **Headings:** Outfit (Google Fonts), weights 700–900
- **Body:** DM Sans (Google Fonts), weights 400–700

---

## Search Functionality

- **Client-side only.** No server-side search.
- The build injects the full `people.json` data into `index.html` as a `<script type="application/json">` tag.
- On page load, JS parses the JSON, renders the grid.
- Search filters in real-time across: `name`, `tagline`, `city`, `state`, `country`.
- Case-insensitive substring matching.
- No fuzzy search for MVP.
- Empty state: "No brags found. Be the first to add yours!" with link to repo.

---

## File Structure

```
/
├── data/
│   └── people.json
├── images/
│   └── people/
│       ├── mike-kasberg.jpg
│       ├── aaron-francis.jpg
│       └── ...
├── src/
│   ├── index.html        (homepage template)
│   ├── about.html        (about page template)
│   ├── main.js           (search logic, grid rendering)
│   └── style.css         (Tailwind imports + custom CSS)
├── vite.config.js
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml    (GitHub Pages deployment)
```

---

## Tech Stack

- **Build tool:** Vite
- **Styling:** Tailwind CSS + custom CSS for the gradient header and dark theme
- **Fonts:** Google Fonts (Outfit, DM Sans)
- **Runtime:** Vanilla JS — no framework

### Build Process
1. Vite reads `data/people.json` at build time.
2. A simple Vite plugin or inline script injects the JSON data into `index.html`.
3. Client-side JS reads the injected data for search/filtering.
4. `npm run build` outputs to `dist/`.
5. GitHub Actions deploys `dist/` to GitHub Pages.

---

## Submission Workflow

1. Developer forks the repo.
2. Adds their entry to `data/people.json`.
3. Adds their photo to `images/people/{key}.jpg`.
4. Opens a PR.
5. On merge, GitHub Actions rebuilds and redeploys the site.

Submission instructions are in the repo README and linked from the /about page.

---

## Non-Goals / Out of Scope

- Light mode (for MVP)
- Pagination or infinite scroll (search handles filtering)
- Individual detail pages for each person
- Fuzzy search
- Animated sparkles or complex animations
- Backend or database
- Form-based submission

---

## Open Questions / Future Considerations

- Should we enforce a max image size for PRs? (e.g., 200KB, 400x400px)
- Should we add a "random brag page" link like nownownow.com?
- Should we group by country/region on the homepage?
- Should `updated` be auto-populated from git history, or manually maintained?
