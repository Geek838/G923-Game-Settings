import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/G923-Game-Settings/',
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
