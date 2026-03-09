/**
 * Overlay dropdown examples.
 *
 * Demonstrates: Overlay with various alignments, open/close modes,
 * manual triggers, and nested overlays within Element.
 */
import { config } from '@vitus-labs/core'
import Element from '../../Element'
import Overlay from '..'

const { styled, css } = config

const MenuBox = styled.div`
  width: 300px;
  height: 300px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #555555;
`

const Menu = () => <MenuBox>some content here</MenuBox>

const TriggerButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: #ffffff;
  padding: 15px 32px;
  text-align: center;
  transition-duration: 0.4s;
  margin: 16px 0 !important;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #555555;
  }

  ${({ active }: any) =>
    active &&
    css`
      background-color: #555555;
    `}
`

const Trigger = (props: any) => (
  <TriggerButton type="button" {...props}>
    Click on me
  </TriggerButton>
)

const ScrollY = styled.div`
  width: 800px;
  height: 1000px;
  background-color: papayawhip;
`

const ScrollX = styled.div`
  width: 2000px;
  height: 200px;
  background-color: papayawhip;
`

export default {
  component: Overlay,
}

export const exampleDropdown = () => (
  <Overlay alignX="right" trigger={Trigger}>
    <Menu />
  </Overlay>
)

export const exampleDropdownOnHover = () => (
  <Overlay openOn="hover" closeOn="hover" trigger={Trigger}>
    <Menu />
  </Overlay>
)

export const exampleDropdownOnTriggerClick = () => (
  <Overlay openOn="click" closeOn="clickOnTrigger" trigger={Trigger}>
    <Menu />
  </Overlay>
)

export const exampleDropdownManual = () => {
  const ManualTrigger = ({ showContent, ...props }: any) => (
    <TriggerButton
      type="button"
      {...props}
      onClick={(e: any) => {
        if (e.detail === 2) showContent()
      }}
    >
      double click on me
    </TriggerButton>
  )

  return (
    <Overlay openOn="manual" closeOn="click" trigger={ManualTrigger}>
      <Menu />
    </Overlay>
  )
}

export const DropdownTop = () => (
  <div style={{ position: 'absolute', left: 200, top: 301 }}>
    <Overlay alignX="left" align="top" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay alignX="center" align="top" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay alignX="right" align="top" trigger={Trigger}>
      <Menu />
    </Overlay>
    <ScrollY />
  </div>
)

export const DropdownBottom = () => (
  <div style={{ position: 'absolute', left: 200, top: 300 }}>
    <ScrollY />
    <Overlay alignX="left" align="bottom" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay alignX="center" align="bottom" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay alignX="right" align="bottom" trigger={Trigger}>
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
      <Overlay alignY="top" align="left" trigger={Trigger}>
        <Menu />
      </Overlay>
      <Overlay alignY="center" align="left" trigger={Trigger}>
        <Menu />
      </Overlay>
      <Overlay alignY="bottom" align="left" trigger={Trigger}>
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
    <Overlay alignY="top" align="right" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay alignY="center" align="right" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay closeOn="hover" alignY="bottom" align="right" trigger={Trigger}>
      <Menu />
    </Overlay>
    <ScrollX />
  </div>
)

export const DropdownInsideElement = () => (
  <Element
    block
    equalBeforeAfter
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
  </Element>
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
    <Overlay alignY="top" align="bottom" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay alignY="center" align="right" trigger={Trigger}>
      <Menu />
    </Overlay>
    <Overlay closeOn="hover" alignY="bottom" align="right" trigger={Trigger}>
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
