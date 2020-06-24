import React from 'react'
import { config } from '@vitus-labs/core'
import Element, { withEqualWidthBeforeAfter } from '../../Element'
import Overlay from '..'

const Box = config.styled.div`
  width: 100px;
  height: 300px;
  background-color: black;
`

const EqualElement = withEqualWidthBeforeAfter(Element)

const Trigger = ({ innerRef, ...props }: any) => (
  <button ref={innerRef} {...props}>
    Click on me
  </button>
)

const Menu = ({ innerRef, ...props }: any) => (
  <Box ref={innerRef} {...props}>
    some content here
  </Box>
)

storiesOf('ELEMENTS | Overlay', module)
  .add('Dropdown', () => {
    return (
      <div style={{ position: 'absolute', left: 200 }}>
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="right"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          refName="innerRef"
          alignX="center"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          refName="innerRef"
          alignX="left"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <div style={{ position: 'absolute', right: 40 }}>
          <Overlay
            refName="innerRef"
            alignX="right"
            trigger={(props) => <Trigger {...props} />}
          >
            <Menu />
          </Overlay>
        </div>
      </div>
    )
  })
  .add('Dropdown inside Element', () => {
    return (
      <EqualElement
        afterContent={
          <Overlay
            refName="innerRef"
            alignX="right"
            trigger={(props) => <Trigger {...props} />}
          >
            <Menu />
          </Overlay>
        }
      >
        some content here
      </EqualElement>
    )
  })
