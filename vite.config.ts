import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  root: './frontend',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [vue()],
})
