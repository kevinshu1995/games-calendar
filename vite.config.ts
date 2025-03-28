import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  root: './frontend',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
    }
  },
  plugins: [vue()],

  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },

})
