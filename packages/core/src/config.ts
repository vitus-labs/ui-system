import type { ComponentType } from 'react'
import { css, styled, ThemeProvider } from 'styled-components'
import type { HTMLTags } from '~/html'

/**
 * Singleton configuration that bridges the UI system with styled-components.
 * All packages reference `config.css`, `config.styled`, etc. so the styling
 * engine can be swapped at runtime (e.g. for React Native) via `init()`.
 */
interface Internal {
  css: typeof css
  styled: typeof styled
  provider: typeof ThemeProvider
  component: ComponentType | HTMLTags
  textComponent: ComponentType | HTMLTags
}

class Configuration {
  css: Internal['css']

  styled: Internal['styled']

  ExternalProvider: Internal['provider']

  component: Internal['component'] = 'div'

  textComponent: Internal['textComponent'] = 'span'

  constructor(props: Internal) {
    this.css = props.css
    this.styled = props.styled
    this.ExternalProvider = props.provider
    this.component = props.component
    this.textComponent = props.textComponent
  }

  init = (props: Partial<Internal>) => {
    if (props.css) {
      this.css = props.css
    }

    if (props.styled) {
      this.styled = props.styled
    }

    if (props.provider) {
      this.ExternalProvider = props.provider
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
