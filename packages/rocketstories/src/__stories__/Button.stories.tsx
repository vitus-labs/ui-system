// @ts-nocheck
import React from 'react'
import rocketstories from '~/makeStories'
import Button, { HoistedButton, ElementExample } from './Button'

const test = rocketstories(Button).attrs({
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

export default test.main()

export const Example = test.mainStory()

export const States = test.makeStories('state', true)

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
