module.exports = {
  extends: ['plugin:@next/next/recommended', 'plugin:jest/recommended'],
  plugins: ['@typescript-eslint', 'testing-library', 'jest'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
  },
};
