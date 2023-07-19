import React, { createRef } from 'react'
import Button from './Button'

export default {
  component: Button,
  title: 'Button',
}

export const button = {
  render: () => (
    <>
      <Button label="Button" />
      <Button label="Button" />
    </>
  ),
}

export const withRef = {
  render: () => {
    const ref = createRef()

    return <Button ref={ref} />
  },
}
