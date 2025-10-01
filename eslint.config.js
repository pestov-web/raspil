import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import featureSliced from 'eslint-plugin-feature-sliced';
import tseslint from '@typescript-eslint/eslint-plugin/use-at-your-own-risk/raw-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import { fileURLToPath } from 'node:url';

const { plugin: tsPlugin, parser: tsParser, flatConfigs } = tseslint;

export default defineConfig([
    globalIgnores(['dist', 'tailwind.config.ts', 'vite.config.js', 'eslint.config.js']),
    {
        files: ['src/**/*.{js,jsx}'],
        extends: [js.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
            globals: globals.browser,
        },
        plugins: {
            'feature-sliced': featureSliced,
        },
        rules: {
            'feature-sliced/path-checker': ['error', { alias: '~' }],
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...flatConfigs['flat/recommended'],
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)),
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
            globals: globals.browser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'feature-sliced': featureSliced,
        },
        rules: {
            'no-unused-vars': ['off'],
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
            'feature-sliced/path-checker': ['error', { alias: '~' }],
        },
    },
]);
