// const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin')
// const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = ({ config }) => {
  // // TYPESCRIPT support
  // config.module.rules.push({
  //   test: /\.(ts|tsx)$/,
  //   loader: require.resolve('awesome-typescript-loader')
  // })
  // config.plugins.push(new CheckerPlugin(), new TSDocgenPlugin()) // optional
  // config.resolve.extensions.push('.ts', '.tsx')

  // //STORYBOOK story source support
  // config.module.rules.push({
  //   test: /\.stories\.jsx?$/,
  //   loaders: [require.resolve('@storybook/addon-storysource/loader')],
  //   enforce: 'pre'
  // })

  return config
}
