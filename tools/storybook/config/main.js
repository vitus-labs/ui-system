const path = require('path')

module.exports = {
  stories: [`${process.cwd()}/src/**/*.stories.(js|jsx|ts|tsx|mdx)`],
  addons: [
    '@storybook/addon-viewport/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-docs',
  ],

  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
    })
    config.resolve.extensions.push('.ts', '.tsx')
    config.resolve.alias['~'] = path.resolve(process.cwd(), 'src/')

    console.log(config)
    return config
  },

  // webpackFinal: async (config) => {
  //   config.module.rules.push({
  //     test: /\.(ts|tsx)$/,
  //     use: [
  //       {
  //         loader: require.resolve('ts-loader'),
  //       },
  //       {
  //         loader: require.resolve('react-docgen-typescript-loader'),
  //       },
  //     ],
  //   })
  //   config.resolve.extensions.push('.ts', '.tsx')
  //   return config
  // },
}
