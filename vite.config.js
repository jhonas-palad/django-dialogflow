import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: './public',
  build: {
    rollupOptions: {
      output: {
        assetFileNames() {
          return `assets/css/[name].min.css`
        },
        entryFileNames() {
          return `assets/js/[name].min.js`
        }
      }
    }
  }
})
