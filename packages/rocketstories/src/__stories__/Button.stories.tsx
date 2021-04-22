import React from 'react'
import rocketstories from '~/rocketstories'
import { Button, HoistedButton, ElementExample } from './Button'

const stories = rocketstories(Button)

export default stories.config()

export const Example = stories.main()

export const States = stories.dimension('state')

export const Sizes = stories.dimension('size')

export const Multiple = stories.dimension('multiple')

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
