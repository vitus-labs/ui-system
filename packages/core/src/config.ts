import { ComponentType } from 'react'
import { styled, css, ThemeProvider } from 'styled-components'
import type { HTMLTags } from '~/html'

interface Internal {
  css: typeof css
  styled: typeof styled
  provider?: typeof ThemeProvider
  component?: ComponentType | HTMLTags
  textComponent?: ComponentType | HTMLTags
}

class Configuration {
  css

  styled

  provider

  component: Internal['component']

  textComponent: Internal['textComponent']

  constructor(props: Internal) {
    this.css = props.css
    this.styled = props.styled
    this.provider = props.provider
    this.component = props.component
    this.textComponent = props.textComponent
  }

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

const defaultParams = {
  css,
  styled,
  provider: ThemeProvider,
  component: 'div',
  textComponent: 'span',
} as const

const config = new Configuration(defaultParams)

const { init } = config

export default config
export { init }
