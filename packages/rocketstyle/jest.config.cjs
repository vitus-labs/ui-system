const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'rocketstyle',
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@vitus-labs/core$': '<rootDir>/../core/lib/index.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
}
