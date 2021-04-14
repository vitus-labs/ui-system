import styled, { css, ThemeContext } from 'styled-components'
// import styled, { css, ThemeContext } from 'styled-components'
import { init } from '@vitus-labs/core'

init({ styled, css, context: ThemeContext })

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />

export default MyApp
