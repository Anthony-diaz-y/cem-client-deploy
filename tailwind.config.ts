import type { Config } from 'tailwindcss';

const brandColors = {
  primary: {
    DEFAULT: '#02819E',
    light: '#C4EBDF',
    dark: '#0d9488',
    darker: '#0f766e',
  },
  background: '#fdfdfd',
  cardbackground: '#ffffff',
  accent: '#A6EFFF4D',
  celeste: {
    light: '#E8F8FD',
    DEFAULT: '#D4EEF7',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
};

const systemColors = {
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
};

const allColors = {
  cem: brandColors,
  ...systemColors,
};

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...allColors,
      },
    },
  },
  plugins: [],
};

export default config;