import React from 'react'
import rocketstyle from '..'
import { Element, Overlay } from '@vitus-labs/elements'

const Wrapper = rocketstyle()()({ name: 'Wrapper', component: Element })
const Button = rocketstyle()()({ name: 'Button', component: Element }).config({
  provider: true,
})
const Icon = rocketstyle()()({ name: 'Icon', component: Element }).config({
  consumer: (props) => {
    console.log(props)
    return {}
  },
})
const Menu = rocketstyle()()({ name: 'Menu', component: Element })
const Box = rocketstyle()()({ name: 'Box', component: Element })

const Component = ({ openOn, closeOn, children, data, icon, ...props }) => {
  return (
    <Overlay
      refName="innerRef"
      alignX="right"
      type="dropdown"
      offsetY={8}
      openOn={openOn}
      closeOn={closeOn}
      trigger={(trigger) => (
        <Button
          label="clcok on me"
          large
          primary
          icon={icon}
          {...props}
          {...trigger}
          onClick={() => ({})}
        >
          <Icon>hello</Icon>
        </Button>
      )}
    >
      <Box>this is come content</Box>
    </Overlay>
  )
}

// console.log(Button)

storiesOf('ROCKETSTYLE | Element', module).add('Re-render', () => {
  return (
    <>
      <Wrapper beforeContent={Component}></Wrapper>
    </>
  )
})
