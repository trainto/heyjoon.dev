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
        'bg-main': '#282c34',
        'bg-shadow': '#070709',
        brand1: colors.pink[600],
        brand2: colors.cyan[600],
      },
    },
  },
  safelist: [
    'w-full',
    'aspect-video',
    'bg-indigo-900',
    'hover:bg-indigo-950',
    'bg-zinc-900',
    'hover:bg-zinc-950',
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'w-5',
    'w-8',
  ],
  plugins: [],
};
export default config;
