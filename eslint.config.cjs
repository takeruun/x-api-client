const eslintPlugin = require('@typescript-eslint/eslint-plugin');
const tseslint = require('typescript-eslint');
const eslint = require('@eslint/js');
const parser = require('@typescript-eslint/parser');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = [
  ...tseslint.configs.recommended,
  eslint.configs.recommended,
  {
    ignores: ['dist/**/*', 'eslint.config.cjs', '.prettierrc.cjs'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser,
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
