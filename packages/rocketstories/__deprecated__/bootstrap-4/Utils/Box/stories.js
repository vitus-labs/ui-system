import React, { Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../../theme'
import Box from './'

storiesOf('Utils/Box', module).add('Examples', () => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <Box bgPrimary p2 m3 borderPrimary roundedTop>
        <div>Widn padding2 and margin3</div>
      </Box>

      <Box p2 m3 clearfix>
        <div>Widn padding2 and margin3</div>
      </Box>
    </Fragment>
  </ThemeProvider>
))
