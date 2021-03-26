import { Context, createContext } from 'react'
import styled, { css, ThemeContext } from 'styled-components'

const context = createContext<any>({})

interface Internal {
  css: typeof css
  styled: typeof styled
  styledContext: Context<Partial<Record<string, unknown>>>
  context: Context<Partial<Record<string, unknown>>>
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
