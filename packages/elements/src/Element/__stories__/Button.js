import React from 'react'
import { config } from '@vitus-labs/core'
import rocketstyle from '@vitus-labs/rocketstyle'
import Element from '~/Element'

const LeftContent = config.styled.span`
  padding: 5px;
  border-radius: 4px;
  background-color: black;
`

const RightContent = config.styled.span`
  padding: 2px;
  border-radius: 4px;
  background-color: #0069d9;
  line-height: 1;
  transition: all 0.15s ease-in-out;

  ${({ hover }) => {
    return (
      hover &&
      config.css`
        &:hover {
          background-color: black;
        };
      `
    )
  }};
`

export const Button = rocketstyle()({ name: 'Button', component: Element })
  .attrs({
    primary: true,
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

      ${({ rocketstyle: t }) => css`
        color: ${t.color};
        background-color: ${t.bgColor};
        border-color: ${t.bgColor};

        &:hover {
          color: ${t.color};
          background-color: #0069d9;
          border-color: #0062cc;
        }
      `};
    `
  )

export default Button
