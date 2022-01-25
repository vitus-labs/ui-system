/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { config } from '@vitus-labs/core'
import Element, { withEqualSizeBeforeAfter } from '../../Element'
import Overlay from '..'

export default {
  component: Overlay,
  title: Overlay.displayName,
}

const Button = ({ innerRef, children, ...props }) => (
  <button type="button" ref={innerRef} {...props}>
    {children || 'Click on me'}
  </button>
)

const Box = ({ innerRef, ...props }) => (
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

const EqualElement = withEqualSizeBeforeAfter(Element)

export const exampleDropdown = () => (
  <Overlay
    triggerRefName="innerRef"
    contentRefName="innerRef"
    alignX="right"
    trigger={Trigger}
  >
    <Menu />
  </Overlay>
)

export const exampleDropdownOnHover = () => (
  <Overlay
    triggerRefName="innerRef"
    contentRefName="innerRef"
    openOn="hover"
    closeOn="hover"
    trigger={Trigger}
  >
    <Menu />
  </Overlay>
)

export const exampleDropdownOnTriggerClick = () => (
  <Overlay
    triggerRefName="innerRef"
    contentRefName="innerRef"
    openOn="click"
    closeOn="clickOnTrigger"
    trigger={Trigger}
  >
    <Menu />
  </Overlay>
)

export const exampleDropdownManual = () => {
  const ManualTrigger = ({ showContent, ...props }) => (
    <Trigger
      {...props}
      onClick={(e) => {
        if (e.detail === 2) showContent(e)
      }}
    >
      double click on me
    </Trigger>
  )

  return (
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
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
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignX="left"
      align="top"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignX="center"
      align="top"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignX="right"
      align="top"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <ScrollY />
  </div>
)

export const DropdownBottom = () => (
  <div style={{ position: 'absolute', left: 200, top: 300 }}>
    <ScrollY />
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignX="left"
      align="bottom"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignX="center"
      align="bottom"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignX="right"
      align="bottom"
      trigger={Trigger}
    >
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
        top: 800,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ScrollX />
      <Overlay
        triggerRefName="innerRef"
        contentRefName="innerRef"
        alignY="top"
        align="left"
        trigger={Trigger}
      >
        <Menu />
      </Overlay>
      <Overlay
        triggerRefName="innerRef"
        contentRefName="innerRef"
        alignY="center"
        align="left"
        trigger={Trigger}
      >
        <Menu />
      </Overlay>
      <Overlay
        triggerRefName="innerRef"
        contentRefName="innerRef"
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
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignY="top"
      align="right"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignY="center"
      align="right"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      closeOn="hover"
      triggerRefName="innerRef"
      contentRefName="innerRef"
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
      <Overlay
        triggerRefName="innerRef"
        contentRefName="innerRef"
        alignX="left"
        trigger={Trigger}
      >
        <Menu />
      </Overlay>
    }
    afterContent={
      <Overlay
        triggerRefName="innerRef"
        contentRefName="innerRef"
        alignX="right"
        trigger={Trigger}
      >
        <Menu />
      </Overlay>
    }
  >
    some content here
  </EqualElement>
)

export const DropdownEdgePositions = () => (
  <div
    style={{
      position: 'absolute',
      left: 200,
      top: 500,
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <ScrollX />
    <ScrollX />
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignY="top"
      align="bottom"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignY="center"
      align="right"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <Overlay
      closeOn="hover"
      triggerRefName="innerRef"
      contentRefName="innerRef"
      alignY="bottom"
      align="right"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <ScrollX />
    <ScrollX />
  </div>
)

export const DropdownHandleHover = () => (
  <>
    <ScrollY />
    <ScrollY />
    <ScrollX />
    <ScrollX />
    <Overlay
      triggerRefName="innerRef"
      contentRefName="innerRef"
      openOn="hover"
      closeOn="hover"
      alignY="top"
      align="bottom"
      trigger={Trigger}
    >
      <Menu />
    </Overlay>
    <ScrollX />
    <ScrollX />
    <ScrollY />
    <ScrollY />
  </>
)
