import React from 'react'
// import styled, { css, ThemeContext } from 'styled-components'
import { css, ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { init } from '@vitus-labs/core'
// import { Provider } from '@vitus-labs/rocketstyle'
import { Provider } from '@vitus-labs/unistyle'

init({ styled, css, context: ThemeProvider })

const Test = styled.div`
  font-size: 20px;
`

const MyApp = ({ Component, pageProps }) => (
  <Provider theme={{ rootSize: 16 }}>
    <Test>Hello</Test>
    <Component {...pageProps} />
  </Provider>
)

export default MyApp
