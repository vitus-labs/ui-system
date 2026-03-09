import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
      reporterOptions: {
        'json-summary': { file: 'coverage-summary.json' },
        json: { file: 'coverage-final.json' },
      },
      reportsDirectory: './coverage',
    },
  },
})
