import React from 'react'
import { config } from '@vitus-labs/core'
import Overlay from '..'

const Trigger = ({ innerRef, ...props }: any) => (
  <button ref={innerRef} {...props}>
    Click on me
  </button>
)
const Menu = ({ innerRef, ...props }: any) => (
  <button ref={innerRef} {...props}>
    some content here
  </button>
)

storiesOf('ELEMENTS | Overlay', module).add('Dropdown', () => {
  return (
    <>
      <Overlay refName="innerRef" trigger={(props) => <Trigger {...props} />}>
        <Menu />
      </Overlay>
      <Overlay refName="innerRef" trigger={(props) => <Trigger {...props} />}>
        <Menu />
      </Overlay>
      <Overlay refName="innerRef" trigger={(props) => <Trigger {...props} />}>
        <Menu />
      </Overlay>
      <div style={{ position: 'absolute', right: 40 }}>
        <Overlay refName="innerRef" trigger={(props) => <Trigger {...props} />}>
          <Menu />
        </Overlay>
      </div>
    </>
  )
})
