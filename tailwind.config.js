/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        richblack: {
          900: '#0e1823',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
          25: '#fafbfc',
          5: '#fafbfc',
        },
        yellow: {
          50: '#ffd60a',
          25: '#ffd60a',
          100: '#ffd60a',
        },
        caribbeangreen: {
          200: '#1ed760',
          400: '#1db954',
        },
        'pure-greys': {
          5: '#f8fafc',
          25: '#f1f5f9',
          50: '#e2e8f0',
          100: '#cbd5e1',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#0e1823',
          800: '#020c1b',
          900: '#000814',
        },
      },
    },
  },
  plugins: [],
}

