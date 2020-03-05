import storybook from '@vitus-labs/tools-storybook'
import theme from '../src/theme'

const source = require.context('../src', true, /\/*stories.js$/)

storybook({ source, theme })
