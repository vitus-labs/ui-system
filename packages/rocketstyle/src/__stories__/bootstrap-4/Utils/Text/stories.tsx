import React from 'react'
import Badge from '../../Badge'
import Text from './'

export default {
  component: Text,
  title: 'TextUtils',
}

export const examples = () => (
  <>
    <Text white thinner>
      <Badge label="Example" />
    </Text>

    <Text primary lighter>
      <Badge success label="Example" />
    </Text>
  </>
)
