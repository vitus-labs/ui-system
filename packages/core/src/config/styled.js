import styled, { css, withTheme, ThemeContext } from 'styled-components'
import { Configuration } from './base'

export default new Configuration({
  platform: 'web',
  component: 'div',
  textComponent: 'p',
  styled,
  css,
  withTheme,
  context: ThemeContext
})
