import { Context } from 'react'
import styled, {
  withTheme,
  css,
  ThemeContext,
  BaseWithThemeFnInterface,
  ThemedCssFunction,
  ThemedStyledInterface,
  DefaultTheme,
} from 'styled-components'

const internal = {
  css,
  styled,
  withTheme,
  context: ThemeContext,
  platform: 'web',
  component: 'div',
  textComponent: 'p',
}

const init = ({ platform, component, textComponent }) => {
  internal.platform = platform
  internal.component = component
  internal.textComponent = textComponent
}

interface Config {
  readonly platform: string
  readonly isWeb: boolean
  readonly isNative: boolean
  readonly context: Context<any>
  readonly styled: ThemedStyledInterface<DefaultTheme>
  readonly css: ThemedCssFunction<object>
  readonly withTheme: BaseWithThemeFnInterface<object>
  readonly component: string
  readonly textComponent: string
}

const config: Config = {
  get platform() {
    return internal.platform
  },
  get isWeb() {
    return internal.platform === 'web'
  },
  get isNative() {
    return internal.platform !== 'web'
  },
  get context() {
    return internal.context
  },
  get styled() {
    return internal.styled
  },
  get css() {
    return internal.css
  },
  get withTheme() {
    return internal.withTheme
  },
  get component() {
    return internal.component
  },
  get textComponent() {
    return internal.textComponent
  },
}

export { init }
export default config
