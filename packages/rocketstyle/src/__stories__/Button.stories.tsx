import Button, { HoistedButton, ElementExample } from './Button'
import React from 'react'

// console.log(Button)

  storiesOf('ROCKETSTYLE | Element', module).add('Button', () => {
    return (
      <>
        <Button active   />
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
  })
