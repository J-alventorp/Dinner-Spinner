import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Dinner-Spinner/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/icon.svg'],
      manifest: {
        name: 'DinnerSpinner',
        short_name: 'DinnerSpinner',
        description: 'Snurra fram kvällens middag utifrån vad du har hemma.',
        start_url: '/Dinner-Spinner/',
        scope: '/Dinner-Spinner/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#241626',
        theme_color: '#FF6B35',
        lang: 'sv',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
