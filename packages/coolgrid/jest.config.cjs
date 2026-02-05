const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'coolgrid',
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@vitus-labs/core$': '<rootDir>/../core/lib/index.js',
    '^@vitus-labs/unistyle$': '<rootDir>/../unistyle/lib/index.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
}
