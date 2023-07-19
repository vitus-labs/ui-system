import { ComponentType } from 'react'
import type { HTMLTags } from '~/html'
import styled, { css, ThemeProvider } from 'styled-components'

interface Internal {
  css: typeof css
  styled: typeof styled
  provider?: typeof ThemeProvider
  component?: ComponentType | HTMLTags
  textComponent?: ComponentType | HTMLTags
}

class Configuration {
  css = css

  styled = styled

  provider = ThemeProvider

  component: ComponentType | HTMLTags = 'div'

  textComponent: ComponentType | HTMLTags = 'span'

  init = (props: Internal) => {
    if (props.css) {
      this.css = props.css
    }

    if (props.styled) {
      this.styled = props.styled
    }

    if (props.provider) {
      this.provider = props.provider
    }

    if (props.component) {
      this.component = props.component
    }

    if (props.textComponent) {
      this.textComponent = props.textComponent
    }
  }
}

const config = new Configuration()

const { init } = config

export default config
export { init }
