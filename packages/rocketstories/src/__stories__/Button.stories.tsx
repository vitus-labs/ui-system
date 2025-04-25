import React from 'react'
import { init } from '~/init'
import Theme from '~/decorators/Theme'
import { Button, HoistedButton, ElementExample } from './Button'

const test = () => ({
  name: 'Hello',
  component: Button,
})

const storyOf = init({
  decorators: [Theme],
})

const stories = storyOf(Button)
  .config({
    name: 'A',
  })
  .controls({
    beforeContent: { type: 'text', description: 'something cool' },
  })
  .attrs({ centered: true })
  .attrs({ content: '' })

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

export default {
  name: 'Hello',
  component: Button,
}

// export default test()

export const Example = stories.main()

export const States = stories
  .storyOptions({ pseudo: true, direction: 'inline' })
  .dimension('state')

export const Sizes = stories
  .storyOptions({ direction: 'inline' })
  .dimension('size')

export const Multiple = stories.dimension('multiple')

export const Custom = stories.render((props) => (
  <Button {...props} label="Another" />
))

export const CustomList = stories.list({
  data: ['a', 'b', 'c', 'd'],
  valueName: 'label',
})

export const CustomListObjects = stories.list({
  data: [{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }],
})

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
