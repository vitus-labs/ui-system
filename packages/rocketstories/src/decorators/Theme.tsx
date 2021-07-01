/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType, ReactElement } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from '@vitus-labs/rocketstyle'
import { Provider as provider } from '@vitus-labs/unistyle'
import getTheme from '~/utils/theme'

type ThemeDecoratorType = (Story: ComponentType) => ReactElement

const ThemeDecorator: ThemeDecoratorType = (Story) => (
  <Provider provider={provider} mode="light" theme={getTheme() as any}>
    <Story />
  </Provider>
)

export default ThemeDecorator
