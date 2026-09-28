/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#121212',
        graphite: '#1E1E1E',
        graphite2: '#262626',
        border: '#333333',
        ash: '#EDEDED',
        ashMuted: '#A3A3A3',
        ember: '#E8623A',
        emberSoft: '#C4552E',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        app: '480px',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
