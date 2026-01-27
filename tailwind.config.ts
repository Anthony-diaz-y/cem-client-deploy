import type { Config } from 'tailwindcss';
import { brandColors, systemColors } from './src/shared/design-tokens/';

// Asegurar que los colores se exporten correctamente para Tailwind
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