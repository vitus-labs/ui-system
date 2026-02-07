const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'core',
  moduleNameMapper: {
    ...base.moduleNameMapper,
    // core doesn't import itself — override the base mapping to avoid self-reference
    '^@vitus-labs/core$': '<rootDir>/src/index.ts',
  },
  collectCoverageFrom: [...base.collectCoverageFrom, '!src/html/**'],
}
