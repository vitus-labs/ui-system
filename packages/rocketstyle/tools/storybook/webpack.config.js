const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader')
  })
  config.plugins.push(new CheckerPlugin(), new TSDocgenPlugin()) // optional
  config.resolve.extensions.push('.ts', '.tsx')

  return config
}
