import { Context, createContext } from 'react'
import styled, { css, ThemeContext } from 'styled-components'

const context = createContext<any>({})

interface Internal {
  css: typeof css
  styled: typeof styled
  styledContext: Context<Record<string, any>>
  context: Context<Record<string, any>>
  component: any
  textComponent: any
}

const internal: Internal = Object.freeze({
  css,
  styled,
  styledContext: ThemeContext,
  context,
  component: 'div',
  textComponent: 'span',
})

export default internal
