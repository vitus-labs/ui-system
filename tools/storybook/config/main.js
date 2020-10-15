const path = require('path')

module.exports = {
  stories: [
    `${process.cwd()}/src/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${process.cwd()}/src/**/stories.@(js|jsx|ts|tsx|mdx)`,
  ],
  addons: [
    '@storybook/addon-viewport/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-docs',
  ],

  webpackFinal: async (config) => {
    config.resolve.alias['~'] = path.resolve(process.cwd(), 'src/')

    return config
  }
}
