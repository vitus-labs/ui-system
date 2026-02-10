import { defineConfig } from 'vitest/config'
import tildeResolve from '../../vitest.tilde-plugin'

export default defineConfig({
  plugins: [tildeResolve()],
  define: {
    __WEB__: true,
    __NATIVE__: false,
  },
  resolve: {
    conditions: ['source'],
  },
  test: {
    name: 'elements',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
