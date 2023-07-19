import React from 'react'
import Element from '~/Element'
import { rs, styled, css } from './base'

const meta = {
  component: Element,
}

export default meta

const LeftContent = styled.span`
  padding: 5px;
  border-radius: 4px;
  background-color: black;
`

const RightContent = styled.span`
  padding: 2px;
  border-radius: 4px;
  background-color: #0069d9;
  line-height: 1;
  transition: all 0.15s ease-in-out;

  ${({ hover }: any) =>
    hover &&
    css`
      &:hover {
        background-color: black;
      }
    `};
`

const Button = rs({
  name: 'Button',
  component: Element,
})
  .attrs({
    tag: 'button',
    label: 'This is a label',
    beforeContent: () => <LeftContent>ico</LeftContent>,
    afterContent: () => <RightContent>✕</RightContent>,
  })
  .states({
    primary: {
      bgColor: '#007bff',
      color: '#fff',
    },
  })
  .styles(
    (css) => css`
      border: 1px solid transparent;
      padding: 0.75rem;
      min-height: 80px;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition: all 0.15s ease-in-out;
      cursor: pointer;

      ${({ $rocketstyle: t }: any) => css`
        color: ${t.color};
        background-color: ${t.bgColor};
        border-color: ${t.bgColor};

        &:hover {
          color: ${t.color};
          background-color: #0069d9;
          border-color: #0062cc;
        }
      `};
    `,
  )

export const button = {
  render: () => (
    <>
      <Button gap={10} />
      <Button gap={[10, 20]} block />
    </>
  ),
}

export const Stacking = {
  render: () => (
    <Element contentDirection="rows" contentAlignX="left" contentAlignY="top">
      <Button tag="div" gap={10} />
      <Button tag="div" block gap={10} />
      <Button tag="div" gap={10} />
      <Button tag="div" gap={10} />
      <Button tag="div" gap={10} />
    </Element>
  ),
}
