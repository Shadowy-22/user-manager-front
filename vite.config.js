import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/cuentas/',
  plugins: [react()],
  server: {
    port: 3000, // Set the server to start on localhost:3000
  },
})
