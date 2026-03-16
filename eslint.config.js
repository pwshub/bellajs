// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.es2026,
        ...globals.denoBuiltin,
        ...globals.nodeBuiltin,
        ...globals.bunBuiltin,
        ...globals.browser,
      },
    },
    rules: {
      // Critical, to avoid AI mistake
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-func-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-debugger': 'error',

      // Best Practices
      'eqeqeq': 'error',
      'no-throw-literal': 'error',
      'no-async-promise-executor': 'error',
      'require-await': 'warn',
      'no-implicit-globals': 'error',
    }
  }
]
