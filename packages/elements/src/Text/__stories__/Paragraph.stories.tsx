/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import Text from '~/Text'

export default {
  component: Text,
}

export const paragraph = () => (
  <>
    <Text paragraph>
      This is a Text <Text>This is an inline text inside paragraph</Text>
    </Text>

    <Text tag="p">
      This is a Text <Text>This is an inline text inside paragraph</Text>{' '}
      <Text>Another inline text should be rendered as span</Text>
    </Text>

    <Text tag="div">
      This is a div Text{' '}
      <Text tag="del">This is an inline text inside paragraph</Text>
    </Text>
  </>
)
