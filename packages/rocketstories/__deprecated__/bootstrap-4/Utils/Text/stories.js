import React, { Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../../theme'
import Badge from '../../Badge'
import Text from './'

storiesOf('Utils/Text', module).add('Examples', () => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <Text white thinner>
        <Badge label="Example" />
      </Text>

      <Text primary lighter>
        <Badge success label="Example" />
      </Text>
    </Fragment>
  </ThemeProvider>
))
