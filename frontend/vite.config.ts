import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The browser only ever talks to this dev server (one origin, so no CORS), and Vite
      // forwards /api/* to Phoenix. 127.0.0.1 rather than localhost: Phoenix binds IPv4 only
      // in dev, and localhost may resolve to ::1 first on some machines.
      '/api': 'http://127.0.0.1:4000',
    },
  },
  test: {
    // Tests render components, so they need a DOM; jsdom provides one inside Node.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
