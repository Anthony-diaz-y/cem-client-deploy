import type { Config } from 'tailwindcss';
import { brandColors } from './src/shared/design-tokens/brand-colors';
import { systemColors } from './src/shared/design-tokens/system-colors';

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