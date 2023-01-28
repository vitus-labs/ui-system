import React, { createRef } from 'react'
import Button from './Button'

export default {
  component: Button,
  title: 'Button',
}

export const button = () => (
  <>
    <Button label="Button" />
    <Button label="Button" />
  </>
)

export const withRef = () => {
  const ref = createRef()

  return <Button ref={ref} />
}
