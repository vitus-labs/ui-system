import { ThemeProvider } from 'styled-components'

export default theme => Story =>
  <ThemeProvider theme={theme}><Story /></ThemeProvider>
