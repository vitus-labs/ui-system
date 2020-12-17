import React from 'react'
import { Provider } from '@vitus-labs/unistyle'
import theme from './theme'

export default (Story) => (
  <Provider theme={theme}>
    <Story />
  </Provider>
)
