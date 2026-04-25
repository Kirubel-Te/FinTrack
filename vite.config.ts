import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          const match = id.match(/node_modules\/(?:\.pnpm\/)?(@[^/]+\/[^/]+|[^/]+)/)
          const packageName = match?.[1]

          if (!packageName) {
            return 'vendor-misc'
          }

          if (['react', 'react-dom', 'scheduler', 'react-is'].includes(packageName)) {
            return 'vendor-react'
          }

          if (packageName === 'react-router') {
            return 'vendor-router'
          }

          if (packageName === 'lucide-react') {
            return 'vendor-icons'
          }

          return 'vendor-misc'
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
})
