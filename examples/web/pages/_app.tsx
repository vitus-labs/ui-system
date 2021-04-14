// import styled, { css, ThemeContext } from 'styled-components'
import { css, ThemeContext } from '@emotion/react'
import styled from '@emotion/styled'
import { init } from '@vitus-labs/core'

init({ styled, css, context: ThemeContext })

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />

export default MyApp
