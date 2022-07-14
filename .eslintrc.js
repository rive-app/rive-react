module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': [
      'warn',
      {
        destructuring: 'all',
      },
    ],
    'no-var': 'error',
    eqeqeq: ['error', 'smart'],
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'off', // Checks effect dependencies
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
