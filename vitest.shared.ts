import { defineConfig } from 'vitest/config'
import tildeResolve from './vitest.tilde-plugin'

type Options = {
  name: string
  define?: Record<string, unknown>
}

export default ({ name, define }: Options) =>
  defineConfig({
    plugins: [tildeResolve()],
    ...(define ? { define } : {}),
    resolve: {
      conditions: ['source'],
    },
    test: {
      name,
      environment: 'jsdom',
      globals: true,
      setupFiles: ['../../vitest.setup.ts'],
      include: ['src/__tests__/**/*.test.{ts,tsx}'],
    },
  })
