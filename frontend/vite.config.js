import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Build timestamp: 2026-02-05-v2
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Force new hashes on each build
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-v2.js`,
        chunkFileNames: `assets/[name]-[hash]-v2.js`,
        assetFileNames: `assets/[name]-[hash]-v2.[ext]`,
        manualChunks: {
          // Core React runtime — cached across all pages
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library — large, changes rarely
          'vendor-framer': ['framer-motion'],
          // State + utilities
          'vendor-state': ['zustand'],
          // Icon library
          'vendor-icons': ['react-icons'],
          // Firebase — only needed for auth pages
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
        },
      }
    }
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces for global access
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
