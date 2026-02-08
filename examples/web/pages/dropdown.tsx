import React from 'react'
import { ThemeProvider } from 'styled-components'
import { config } from '@vitus-labs/core'
import rocketstyle from '@vitus-labs/rocketstyle'
import {
  Element,
  withEqualWidthBeforeAfter,
  Overlay,
} from '@vitus-labs/elements'
import theme from '../theme'

const component = ({ innerRef, children, ...props }: any) => (
  <button ref={innerRef} {...props}>
    {children || 'Click on me'}
  </button>
)

const box = ({ innerRef, ...props }: any) => (
  <div ref={innerRef} {...props}>
    some content here
  </div>
)

const Trigger = rocketstyle()()({ name: 'Button', component }).styles(
  (css) => css<any>`
    background-color: #4caf50;
    border: none;
    color: #ffffff;
    padding: 15px 32px;
    text-align: center;
    transition-duration: 0.2s;
    margin: 16px 0 !important;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #555555;
    }

    ${({ $active }) =>
      $active &&
      config.css`
        background-color: #555555;
      `}
  `,
)

const EqualElement = withEqualWidthBeforeAfter(Element)

const Menu = rocketstyle()()({ name: 'Button', component: box }).styles(
  (css) => css`
    width: 300px;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #555555;
  `,
)

export default () => (
  <ThemeProvider theme={theme}>
    <EqualElement
      block
      beforeContent={
        <Overlay refName="innerRef" alignX="center" trigger={Trigger}>
          <Menu />
        </Overlay>
      }
      afterContent={
        <>
          <Trigger />
          <Trigger />
          <Trigger />
          <Overlay refName="innerRef" alignX="right" trigger={Trigger}>
            <Menu />
          </Overlay>
          <Trigger />
        </>
      }
    >
      some content here
    </EqualElement>
  </ThemeProvider>
)
