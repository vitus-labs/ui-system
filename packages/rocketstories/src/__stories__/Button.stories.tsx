import React from 'react'
import rocketstories from '~/makeStories'
import Button, { HoistedButton, ElementExample } from './Button'

const stories = rocketstories(Button).attrs({
  label: 'Hello',
  testPropsA: {
    type: 'select',
    defaultValue: 'yellow',
    data: {
      Red: 'red',
      Blue: 'blue',
      Yellow: 'yellow',
      Rainbow: ['red', 'orange', 'etc'],
      None: null,
    },
  },
  testProps: {
    type: 'select',
    defaultValue: 'yellow',
    data: {
      Red: 'red',
      Blue: 'blue',
      Yellow: 'yellow',
      Rainbow: ['red', 'orange', 'etc'],
      None: null,
    },
  },
  objectProp: {
    test: 'a',
    value: 0,
    b: null,
    c: undefined,
  },
  arrayProp: ['a', null, undefined, { a: 1 }],
})

export default stories.main()

export const Example = stories.mainStory()

export const States = stories.makeStories('state')

export const Sizes = stories.makeStories('size')

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
