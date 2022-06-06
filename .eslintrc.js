module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'prettier', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': ['warn', {
      destructuring: 'all'
    }],
    'no-var': 'error',
    eqeqeq: ['error', 'smart']
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};