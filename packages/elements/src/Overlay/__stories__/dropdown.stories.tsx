import React from 'react'
import { config } from '@vitus-labs/core'
import Element, { withEqualWidthBeforeAfter } from '../../Element'
import Overlay from '..'

const Box = config.styled.div`
  width: 100px;
  height: 300px;
  background-color: black;
`

const Scroll = config.styled.div`
  width: 100px;
  height: 2000px;
  background-color: papayawhip;
`

const ScrollX = config.styled.div`
  width: 2000px;
  height: 200px;
  background-color: papayawhip;
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
  .add('Dropdown Top', () => {
    return (
      <div style={{ position: 'absolute', left: 200, top: 301 }}>
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="left"
          align="top"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="center"
          align="top"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="right"
          align="top"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Scroll />
      </div>
    )
  })
  .add('Dropdown Bottom', () => {
    return (
      <div style={{ position: 'absolute', left: 200, top: 300 }}>
        <Scroll />
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="left"
          align="bottom"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="center"
          align="bottom"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          // type="popover"
          refName="innerRef"
          alignX="right"
          align="bottom"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Scroll />
      </div>
    )
  })
  .add('Dropdown Left', () => {
    return (
      <div style={{ position: 'absolute', left: 200, top: 300 }}>
        <ScrollX />
        <Overlay
          refName="innerRef"
          alignY="top"
          align="left"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          refName="innerRef"
          alignY="center"
          align="left"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <Overlay
          closeOn="hover"
          refName="innerRef"
          alignY="bottom"
          align="left"
          trigger={(props) => <Trigger {...props} />}
        >
          <Menu />
        </Overlay>
        <ScrollX />
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
