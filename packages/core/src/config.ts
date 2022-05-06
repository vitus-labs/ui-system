import { ComponentType } from 'react'
import type { HTMLTags } from '~/html'
import styled, {
  css,
  ThemeProvider,
  ThemedCssFunction,
  StyledInterface,
  DefaultTheme,
  ThemeProviderComponent,
} from 'styled-components'

interface Internal {
  css: ThemedCssFunction<DefaultTheme>
  styled: StyledInterface
  provider: ThemeProviderComponent<any, any>
  component: ComponentType | HTMLTags
  textComponent: ComponentType | HTMLTags
}

class Configuration {
  css = css
  styled = styled
  provider = ThemeProvider
  component: ComponentType | HTMLTags = 'div'
  textComponent: ComponentType | HTMLTags = 'span'

  init = (props: Internal) => {
    this.css = props.css
    this.styled = props.styled
    this.provider = props.provider
    this.component = props.component
    this.textComponent = props.textComponent
  }
}

const config = new Configuration()

const { init } = config

export default config
export { init }
