import React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../../../src/theme'

export default story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>
