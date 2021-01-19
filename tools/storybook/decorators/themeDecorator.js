import React from 'react'
import { Provider } from '@vitus-labs/unistyle'

export default (theme) => (Story) => (
  <Provider theme={theme}>
    <Story />
  </Provider>
)
