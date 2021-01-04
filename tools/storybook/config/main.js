const path = require('path')
const { DefinePlugin } = require('webpack')
const CONFIG = require('../src/config')

module.exports = {
  stories: CONFIG.stories,
  addons: Object.keys(CONFIG.addons).map((item) => `@storybook/addon-${item}`),

  webpackFinal: async (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias['~'] = path.resolve(process.cwd(), 'src/')
    config.plugins.push(
      new DefinePlugin({
        __BROWSER__: true,
        __NATIVE__: false,
        __SERVER__: true,
        __WEB__: true,
        __CLIENT__: true,
      })
    )

    return config
  },
}
