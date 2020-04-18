// // const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin')
// // const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = async ({ config }) => {
  // config.module.rules.push({
  //   test: /\.stories\.jsx?$/,
  //   loaders: [require.resolve('@storybook/source-loader')],
  //   enforce: 'pre'
  // })

  // config.module.rules.push({
  //   test: /\.(ts|tsx)$/,
  //   use: [
  //     {
  //       loader: require.resolve('awesome-typescript-loader')
  //     }
  //   ]
  // })
  // //   // config.plugins.push(new CheckerPlugin(), new TSDocgenPlugin()) // optional
  // config.resolve.extensions.push('.ts', '.tsx')

  return config
}
