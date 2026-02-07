const base = require('../../jest.config.base.cjs')

/** @type {import('jest').Config} */
module.exports = {
  ...base,
  displayName: 'unistyle',
  globals: {
    __WEB__: true,
  },
}
