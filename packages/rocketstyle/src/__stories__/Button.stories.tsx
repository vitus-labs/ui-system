import React from 'react'
import Button, { HoistedButton, ElementExample } from './Button'

// console.log(Button)

export default {
  component: Button,
  title: 'Button',
}

export const button = () => (
  <>
    <Button active />
    <HoistedButton>
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
    <HoistedButton>
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
    <HoistedButton>
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
    <HoistedButton>
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
    <HoistedButton>
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
    <HoistedButton>
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
    <HoistedButton
      tag="a"
      href="/ale"
      onClick={() => {
        'hello'
      }}
    >
      <ElementExample>sometext inside</ElementExample>
    </HoistedButton>
  </>
)
