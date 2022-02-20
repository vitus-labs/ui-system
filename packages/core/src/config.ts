import { ComponentType } from 'react'
import styled, {
  css,
  ThemeProvider,
  ThemedCssFunction,
  StyledInterface,
  DefaultTheme,
  ThemeProviderComponent,
} from 'styled-components'
import type { HTMLTags } from '~/html'

const OPTIONS: Internal = {
  styled,
  css,
  styledContext: ThemeProvider,
  component: 'div',
  textComponent: 'span',
} as Internal

type Init = ({
  styled,
  css,
  context,
  component,
  textComponent,
}: {
  styled: any
  css: any
  context: any
  component?: ComponentType | HTMLTags
  textComponent?: ComponentType | HTMLTags
}) => void

const init: Init = ({
  styled,
  css,
  context,
  component = 'div',
  textComponent = 'span',
}) => {
  OPTIONS.css = css
  OPTIONS.styled = styled
  OPTIONS.styledContext = context
  OPTIONS.component = component
  OPTIONS.textComponent = textComponent
}

interface Internal {
  css: ThemedCssFunction<DefaultTheme>
  styled: StyledInterface
  styledContext: ThemeProviderComponent<any, any>
  component: any
  textComponent: any
}

const internal: Internal = Object.freeze({
  get css() {
    return OPTIONS.css
  },
  get styled() {
    return OPTIONS.styled
  },
  get styledContext() {
    return OPTIONS.styledContext
  },
  get component() {
    return OPTIONS.component
  },
  get textComponent() {
    return OPTIONS.textComponent
  },
})

export { init }
export default internal
