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
