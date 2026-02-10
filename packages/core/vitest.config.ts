import { defineConfig } from 'vitest/config'
import tildeResolve from '../../vitest.tilde-plugin'

export default defineConfig({
  plugins: [tildeResolve()],
  resolve: {
    conditions: ['source'],
  },
  test: {
    name: 'core',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
