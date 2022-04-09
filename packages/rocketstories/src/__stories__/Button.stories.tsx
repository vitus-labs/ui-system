import React from 'react'
import { init } from '~/rocketstories'
import { Button, HoistedButton, ElementExample } from './Button'

const stories = init({
  storyOptions: {
    direction: 'inline',
    alignX: 'right',
    alignY: 'center',
    gap: 16,
    pseudo: true,
  },
  decorators: [],
})(Button)
  .attrs({ centered: true })
  .attrs({ content: '' })

console.log(stories)

// const stories = rocketstories(Button)
//   .storyOptions({
//     direction: 'inline',
//     alignX: 'left',
//     alignY: 'center',
//     gap: 16,
//     pseudo: true,
//   })
//   .attrs({
//     tag: 'button',
//     label: 'This is a label',
//   })

export default stories.export()

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
