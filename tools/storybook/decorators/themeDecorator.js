import React, { createElement } from 'react'
import { ThemeProvider } from 'styled-components'

export default theme => story =>
  createElement(ThemeProvider, { theme, children: story() })
