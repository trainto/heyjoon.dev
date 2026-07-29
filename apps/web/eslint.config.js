import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      'no-console': ['error', { allow: ['error'] }],
      // styled-jsx syntax used in Next.js
      'react/no-unknown-property': ['warn', { ignore: ['jsx'] }],
    },
  },
];
