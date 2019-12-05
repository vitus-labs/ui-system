import storybook from '@internal/storybook'
// import theme from '../src/theme'

const source = require.context('../src', true, /\/*stories.js$/)

storybook({ source, theme: {} })
