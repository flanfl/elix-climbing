import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Must come before react(): it reads src/routes/ and writes src/routeTree.gen.ts, the typed
    // route tree. autoCodeSplitting loads each page's code only when that page is visited.
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    // `@/foo` means `src/foo`, so imports don't depend on how deep the importing file sits.
    // Must match `paths` in tsconfig.app.json: Vite resolves the import, TypeScript type-checks it.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
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
