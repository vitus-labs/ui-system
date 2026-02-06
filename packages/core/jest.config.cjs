const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'core',
  collectCoverageFrom: [...base.collectCoverageFrom, '!src/html/**'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
}
