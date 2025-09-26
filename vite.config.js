/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'icon.svg', 'favicon.svg'],
            manifest: {
                name: 'Raspil - Калькулятор расходов',
                short_name: 'Raspil',
                description: 'Простой калькулятор для справедливого разделения общих расходов',
                theme_color: '#4f46e5',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                    },
                    {
                        src: 'icon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                    },
                    {
                        src: 'favicon.svg',
                        sizes: '32x32',
                        type: 'image/svg+xml',
                        purpose: 'favicon',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
        }),
    ],
    resolve: {
        alias: {
            '~app': fileURLToPath(new URL('./src/app', import.meta.url)),
            '~pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '~widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
            '~features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '~entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
            '~shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],
    },
});
