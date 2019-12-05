import styled, { withTheme, css, ThemeContext } from 'styled-components'

let internal = {
  css,
  styled,
  withTheme,
  context: ThemeContext,
  platform: 'web',
  component: 'div',
  textComponent: 'p'
}

const init = ({ platform, component, textComponent }) => {
  internal.platform = platform
  internal.component = component
  internal.textComponent = textComponent
}

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
  get styled() {
    return internal.styled
  },
  get withTheme() {
    return internal.withTheme
  },
  get component() {
    return internal.component
  },
  get textComponent() {
    return internal.textComponent
  }
}

export { init }
export default config
