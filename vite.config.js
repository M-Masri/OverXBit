import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor'
            }
            if (id.includes('framer-motion')) {
              return 'motion-vendor'
            }
          }
        },
      },
    },
  },
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
})


