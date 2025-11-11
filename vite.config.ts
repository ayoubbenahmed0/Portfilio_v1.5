import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Workaround for Windows usernames with apostrophes breaking Workbox SW generation
      // If the absolute path contains a single quote, disable PWA during build to avoid syntax errors
      disable: __dirname.includes("'"),
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Modern Portfolio',
        short_name: 'Portfolio',
        description: 'Modern animated portfolio website',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});

