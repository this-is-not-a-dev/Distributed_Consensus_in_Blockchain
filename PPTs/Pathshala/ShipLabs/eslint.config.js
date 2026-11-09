import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // The backdrop's useFrame loop mutates refs outside React's render cycle by design.
    files: ['src/world/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  {
    // Slide modules export one data object (scene + steps); scene kit exports helpers next
    // to components. Fast refresh just falls back to a full reload for them.
    files: ['src/slides/Slide*.tsx', 'src/scene/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
