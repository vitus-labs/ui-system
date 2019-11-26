const path = require('path')

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: `babel-plugin-module-resolver`,
    options: {
      alias: {
        '~': process.cwd() + '/../src' // TODO: this is just a quick solution
      }
    }
  })
}
