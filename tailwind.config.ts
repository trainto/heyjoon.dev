import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '800px',
    },
    extend: {
      colors: {
        brand1: colors.pink[600],
        brand2: colors.cyan[600],
      },
    },
  },
  plugins: [],
};
export default config;
