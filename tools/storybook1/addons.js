const addons = [
  'a11y',
  'backgrounds',
  'design-assets',
  'jest',
  'knobs',
  'storysource',
  'viewport'
]

module.exports = {
  addons: addons.map(item => `@storybook/addon-${item}/register`)
}
