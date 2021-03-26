import React, { createRef } from 'react'
import Button from './Button'

export default {
  component: Button,
  title: 'Button with Hoc',
}

export const buttonHocRef = () => {
  const ref = createRef()

  console.log(ref)

  return (
    <>
      <Button ref={ref} label="Button" />
      <Button state="primary" label="Button" />
    </>
  )
}
