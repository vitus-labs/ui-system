import storybook from '@internal/storybook'
import { breakpoints } from '@vitus-labs/unistyle'

const source = require.context('../src', true, /\/*stories.js$/)

storybook({ source, theme: { ...breakpoints } })
