module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // This reviewed hero source is byte-frozen; keep its pre-existing
      // formatting intact while the rest of the project remains linted.
      files: ['src/components/hero/Streamlines.tsx'],
      rules: { '@typescript-eslint/no-extra-semi': 'off' },
    },
  ],
}
