/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@vitus-labs/core$': '<rootDir>/../core/lib/index.js',
  },
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.cjs'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__stories__/**',
    '!src/**/types/**',
    '!src/**/types.ts',
    '!src/index.ts',
  ],
  coverageDirectory: '.coverage',
  coverageReporters: ['text', 'lcov', 'html'],
}
