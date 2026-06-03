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
