module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['@ofk/eslint-config-recommend'],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.ts'],
  parserOptions: {
    project: './tsconfig.app.json',
  },
};
