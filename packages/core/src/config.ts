import { Context } from 'react'
import styled, { withTheme, css, ThemeContext } from 'styled-components'

interface Internal {
  css: import('styled-components').ThemedCssFunction<object>
  styled: import('styled-components').ThemedStyledInterface<
    import('styled-components').DefaultTheme
  >
  withTheme: import('styled-components').BaseWithThemeFnInterface<object>
  context: Context<any>
  platform: 'web' | 'native'
}

const internal: Internal & { [key: string]: any } = {
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

// interface Config {
//   readonly platform: 'web' | 'native'
//   readonly isWeb: boolean
//   readonly isNative: boolean
//   readonly context: Context<any>
//   readonly styled: ThemedStyledInterface<DefaultTheme>
//   readonly css: ThemedCssFunction<object>
//   readonly withTheme: BaseWithThemeFnInterface<object>
//   readonly component: string
//   readonly textComponent: string
// }

const config = {
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
