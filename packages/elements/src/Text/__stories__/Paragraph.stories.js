import React, { Fragment } from 'react'
import styled, { css } from 'styled-components'
import { storiesOf } from '@storybook/react'
import Text from '..'

storiesOf('Text', module).add('Paragraph', () => {
  return (
    <Fragment>
      <Text>
        This is a Text <Text>This is an inline text inside paragraph</Text>
      </Text>

      <Text deleted>
        This is a Text{' '}
        <Text replaced>This is an inline text inside paragraph</Text>{' '}
        <Text>Another inline text should be rendered as span</Text>
      </Text>
    </Fragment>
  )
})
