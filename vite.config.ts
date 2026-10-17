import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative URLs work for both user.github.io/ and user.github.io/repository/.
  base: './',
  plugins: [react(), tailwindcss()],
})
