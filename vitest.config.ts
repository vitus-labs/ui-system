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
      // Thresholds set at the current baseline — any drop fails CI.
      // Bump these up when coverage improves so we never silently lose
      // what we've gained.
      thresholds: {
        statements: 98.41,
        branches: 94.22,
        functions: 98.45,
        lines: 99.1,
      },
    },
  },
})
