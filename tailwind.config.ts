import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 35px rgba(0, 132, 255, .35)',
        warm: '0 0 35px rgba(255, 156, 51, .28)'
      }
    }
  },
  plugins: [],
};
export default config;
