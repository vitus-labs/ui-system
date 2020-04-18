import { createElement } from 'react'
import {context}
import { ThemeProvider } from 'styled-components'

export default () => story =>
  createElement(ThemeProvider, { theme, children: story() })
