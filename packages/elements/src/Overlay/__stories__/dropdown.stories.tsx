import React from 'react'
import { config } from '@vitus-labs/core'
import Element, { withEqualWidthBeforeAfter } from '../../Element'
import Overlay from '..'

const Button = ({ innerRef, children, ...props }: any) => (
  <button ref={innerRef} {...props}>
    {children || 'Click on me'}
  </button>
)

const Box = ({ innerRef, ...props }: any) => (
  <div ref={innerRef} {...props}>
    some content here
  </div>
)

const Menu = config.styled(Box)`
  width: 300px;
  height: 300px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #555555;
`

const Trigger = config.styled(Button)`
    background-color: #4CAF50;
    border: none;
    color: #FFFFFF;
    padding: 15px 32px;
    text-align: center;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
    margin: 16px 0 !important;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: #555555;
    }

    ${({ active }) =>
      active &&
      config.css`
        background-color: #555555;
      `}
`

const ScrollY = config.styled.div`
  width: 800px;
  height: 1000px;
  background-color: papayawhip;
`

const ScrollX = config.styled.div`
  width: 2000px;
  height: 200px;
  background-color: papayawhip;
`

const EqualElement = withEqualWidthBeforeAfter(Element)

export default {
  component: Overlay,
  title: 'ELEMENTS | Overlay',
}

export const exampleDropdown = () => {
  return (
    <Overlay refName="innerRef" alignX="right" trigger={Trigger}>
      <Menu />
    </Overlay>
  )
}

export const exampleDropdownOnHover = () => {
  return (
    <Overlay
      refName="innerRef"
      openOn="hover"
      closeOn="hover"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
  )
}

export const exampleDropdownOnTriggerClick = () => {
  return (
    <Overlay
      refName="innerRef"
      openOn="click"
      closeOn="triggerClick"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
  )
}

export const exampleDropdownManual = () => {
  const ManualTrigger = (props) => {
    return (
      <Trigger
        {...props}
        onClick={(e) => {
          if (e.detail === 2) props.showContent(e)
        }}
      >
        double click on me
      </Trigger>
    )
  }

  return (
    <Overlay
      refName="innerRef"
      openOn="manual"
      closeOn="click"
      trigger={(props) => <ManualTrigger {...props} />}
    >
      <Menu />
    </Overlay>
  )
}

export const DropdownTop = () => (
  <div style={{ position: 'absolute', left: 200, top: 301 }}>
    <Overlay refName="innerRef" alignX="left" align="top" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay refName="innerRef" alignX="center" align="top" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay refName="innerRef" alignX="right" align="top" trigger={Trigger}>
      <Menu />
    </Overlay>
    <ScrollY />
  </div>
)

export const DropdownBottom = () => (
  <div style={{ position: 'absolute', left: 200, top: 300 }}>
    <ScrollY />
    <Overlay refName="innerRef" alignX="left" align="bottom" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay
      refName="innerRef"
      alignX="center"
      align="bottom"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay refName="innerRef" alignX="right" align="bottom" trigger={Trigger}>
      <Menu />
    </Overlay>
    <ScrollY />
  </div>
)

export const DropdownLeft = () => (
  <>
    <ScrollY />
    <div
      style={{
        position: 'absolute',
        left: 200,
        top: 300,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ScrollX />
      <Overlay refName="innerRef" alignY="top" align="left" trigger={Trigger}>
        <Menu />
      </Overlay>
      <Overlay
        refName="innerRef"
        alignY="center"
        align="left"
        trigger={Trigger}
      >
        <Menu />
      </Overlay>
      <Overlay
        closeOn="hover"
        refName="innerRef"
        alignY="bottom"
        align="left"
        trigger={Trigger}
      >
        <Menu />
      </Overlay>
      <ScrollX />
    </div>
    <ScrollY />
  </>
)

export const DropdownRight = () => (
  <div
    style={{
      position: 'absolute',
      left: 200,
      top: 300,
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <ScrollX />
    <Overlay refName="innerRef" alignY="top" align="right" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay refName="innerRef" alignY="center" align="right" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay
      closeOn="hover"
      refName="innerRef"
      alignY="bottom"
      align="right"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <ScrollX />
  </div>
)

export const DropdownInsideElement = () => (
  <EqualElement
    block
    beforeContent={
      <Overlay refName="innerRef" alignX="left" trigger={Trigger}>
        <Menu />
      </Overlay>
    }
    afterContent={
      <Overlay refName="innerRef" alignX="right" trigger={Trigger}>
        <Menu />
      </Overlay>
    }
  >
    some content here
  </EqualElement>
)
