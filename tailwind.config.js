/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './*.html',
    './FAQ/**/*.html',
    './about/**/*.html',
    './contact/**/*.html',
    './linux/**/*.html',
    './assets/js/**/*.js',
  ],
  safelist: [
    'diff-added',
    'diff-removed',
    'diff-changed',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9d9fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1e40af',
          800: '#1e3a5f',
          900: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
