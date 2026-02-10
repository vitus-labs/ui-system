import { defineConfig } from 'vitest/config'
import tildeResolve from '../../vitest.tilde-plugin'

export default defineConfig({
  plugins: [tildeResolve()],
  define: {
    __WEB__: true,
  },
  resolve: {
    conditions: ['source'],
  },
  test: {
    name: 'unistyle',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
