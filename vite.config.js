import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const peoplePath = resolve(import.meta.dirname, 'data/people.json');
const cardTemplatePath = resolve(import.meta.dirname, 'src/partials/card.html');

function loadPeople() {
  return JSON.parse(fs.readFileSync(peoplePath, 'utf-8'));
}

function loadCardTemplate() {
  return fs.readFileSync(cardTemplatePath, 'utf-8');
}

function renderCard(template, person, basePath) {
  const imgPath = person.image ? `${basePath}images/people/${person.image}` : '';
  const location = [person.city, person.state, person.country].filter(Boolean).join(', ');
  const displayUrl = person.url.replace(/^https?:\/\//, '');
  const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const imageClass = person.image ? '' : 'hidden';
  const fallbackClass = person.image ? 'hidden' : 'flex';
  const search = [person.name, person.tagline, person.city, person.state, person.country, person.url]
    .filter(Boolean).join(' ').toLowerCase();

  return template
    .replace(/{{url}}/g, person.url)
    .replace(/{{search}}/g, search)
    .replace(/{{country}}/g, person.country || '')
    .replace(/{{imageSrc}}/g, imgPath)
    .replace(/{{name}}/g, person.name)
    .replace(/{{imageClass}}/g, imageClass)
    .replace(/{{fallbackClass}}/g, fallbackClass)
    .replace(/{{initials}}/g, initials)
    .replace(/{{tagline}}/g, person.tagline)
    .replace(/{{location}}/g, location)
    .replace(/{{displayUrl}}/g, displayUrl);
}

function renderStats(people) {
  const countries = new Set(people.map(p => p.country)).size;
  return `${people.length} brag page${people.length !== 1 ? 's' : ''} across ${countries} countries`;
}

export default defineConfig({
  base: '/slash-brag/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'src/index.html'),
        about: resolve(import.meta.dirname, 'src/about.html'),
      },
    },
  },
  plugins: [
    (() => {
      let basePath = '/';
      return {
        name: 'inject-people-cards',
        configResolved(config) {
          basePath = config.base;
        },
        configureServer(server) {
          server.watcher.add(peoplePath);
          server.watcher.add(cardTemplatePath);
          server.watcher.on('change', (changedPath) => {
            if (changedPath === peoplePath || changedPath === cardTemplatePath) {
              server.ws.send({ type: 'full-reload' });
            }
          });
        },
        transformIndexHtml(html) {
          const people = loadPeople();
          const template = loadCardTemplate();
          const cards = people.map(p => renderCard(template, p, basePath)).join('\n    ');
          const stats = renderStats(people);
          return html
            .replace('<!-- CARDS -->', cards)
            .replace('<!-- STATS -->', stats);
        },
      };
    })(),
  ],
});
