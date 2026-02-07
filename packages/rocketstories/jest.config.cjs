const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'rocketstories',
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@vitus-labs/core$': '<rootDir>/../core/lib/index.js',
    '^@vitus-labs/rocketstyle$': '<rootDir>/../rocketstyle/lib/index.js',
    '^@vitus-labs/elements$': '<rootDir>/../elements/lib/index.js',
    '^@vitus-labs/unistyle$': '<rootDir>/../unistyle/lib/index.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
}
