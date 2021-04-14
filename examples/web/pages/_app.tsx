import React from 'react'
import styled, { css, ThemeContext } from 'styled-components'
// import { css, ThemeContext } from '@emotion/react'
// import styled from '@emotion/styled'
import { init } from '@vitus-labs/core'
import { Provider } from '@vitus-labs/rocketstyle'

init({ styled, css, context: ThemeContext })

const MyApp = ({ Component, pageProps }) => (
  <Provider theme={{ rootSize: 16 }}>
    <Component {...pageProps} />
  </Provider>
)

export default MyApp
