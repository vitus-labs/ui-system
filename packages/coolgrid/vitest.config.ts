import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __WEB__: true,
    __NATIVE__: false,
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: 'coolgrid',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
