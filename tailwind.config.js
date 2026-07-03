/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213d',
        canvas: '#f5f7fb',
      },
      boxShadow: {
        soft: '0 16px 40px -24px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
