import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' permite abrir el build desde cualquier subcarpeta o hosting estático.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
})
