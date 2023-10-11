const { createEslint } = require('@vitus-labs/tools-lint')

module.exports = createEslint()({
  config: {
    rules: {
      '@typescript-eslint/ban-types': 0,
    },
  },
})
