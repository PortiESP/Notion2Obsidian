import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 6969
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@/components': "/src/render/components",
      '@/scenes': "/src/render/scenes",
      '@/algorithms': "/src/electron/algorithms",
    },
  },
})
