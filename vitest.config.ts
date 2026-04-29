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
        statements: 98.58,
        branches: 94.32,
        functions: 98.47,
        lines: 99.31,
      },
    },
  },
})
