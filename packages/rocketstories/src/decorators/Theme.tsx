import React from 'react'
import { Provider } from '@vitus-labs/rocketstyle'
import { Provider as provider } from '@vitus-labs/unistyle'
import getTheme from '~/utils/theme'

export default (Story) => (
  <Provider provider={provider} mode="light" theme={getTheme() as any}>
    <Story />
  </Provider>
)
