import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const peoplePath = resolve(import.meta.dirname, 'data/people.json');

function loadPeople() {
  try {
    return JSON.parse(fs.readFileSync(peoplePath, 'utf-8'));
  } catch (err) {
    throw new Error(
      `Failed to load or parse data/people.json at ${peoplePath}: ${err.message}`
    );
  }
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
    {
      name: 'inject-people-data',
      configureServer(server) {
        server.watcher.add(peoplePath);
        server.watcher.on('change', (changedPath) => {
          if (changedPath === peoplePath) {
            server.ws.send({ type: 'full-reload' });
          }
        });
      },
      transformIndexHtml(html) {
        const people = loadPeople();
        const safeJson = JSON.stringify(people).replace(/</g, '\\u003c');
        const scriptTag = `<script type="application/json" id="people-data">${safeJson}</script>`;
        return html.replace('<!-- PEOPLE_DATA -->', scriptTag);
      },
    },
  ],
});
