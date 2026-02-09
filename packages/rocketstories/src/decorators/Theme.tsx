/**
 * Storybook decorator that wraps each story in the rocketstyle and unistyle
 * theme providers. Reads the theme from the global window store and applies
 * it in "light" mode so that all rocketstyle components receive proper theming.
 */
import { Provider } from '@vitus-labs/rocketstyle'
import { Provider as provider } from '@vitus-labs/unistyle'
import type { ComponentType, ReactElement } from 'react'
import getTheme from '~/utils/theme'

type ThemeDecoratorType = (Story: ComponentType) => ReactElement

const ThemeDecorator: ThemeDecoratorType = (Story) => (
  <Provider provider={provider} mode="light" theme={getTheme() as any}>
    <Story />
  </Provider>
)

export default ThemeDecorator
