import { createVitestConfig } from '@vitus-labs/tools-vitest'
import tildeResolve from './vitest.tilde-plugin'

type Options = {
  name: string
  define?: Record<string, unknown>
}

export default ({ name, define }: Options) => {
  const config = createVitestConfig({
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    plugins: [tildeResolve()],
  })

  return {
    ...config,
    ...(define ? { define } : {}),
    resolve: {
      ...config.resolve,
      conditions: ['source'],
    },
    test: {
      ...config.test,
      name,
      include: ['src/__tests__/**/*.test.{ts,tsx}'],
    },
  }
}
