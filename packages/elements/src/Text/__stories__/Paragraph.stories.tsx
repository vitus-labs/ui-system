import React from 'react'
import Text from '~/Text'

export default {
  component: Text,
  title: `${Text.displayName}`,
}

export const paragraph = () => (
  <>
    <Text>
      This is a Text <Text>This is an inline text inside paragraph</Text>
    </Text>

    <Text deleted>
      This is a Text{' '}
      <Text replaced>This is an inline text inside paragraph</Text>{' '}
      <Text>Another inline text should be rendered as span</Text>
    </Text>
  </>
)
