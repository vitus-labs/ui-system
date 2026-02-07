const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'elements',
  globals: {
    __WEB__: true,
    __NATIVE__: false,
  },
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@vitus-labs/unistyle$': '<rootDir>/../unistyle/lib/index.js',
  },
}
