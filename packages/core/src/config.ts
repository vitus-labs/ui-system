import { Context } from 'react'
import styled, { css, ThemeContext } from 'styled-components'

interface Internal {
  css: typeof css
  styled: typeof styled
  context: Context<Record<string, any>>
}

const internal: Internal & Record<string, any> = {
  css,
  styled,
  context: ThemeContext,
  component: 'div',
  textComponent: 'span',
}

export default internal
