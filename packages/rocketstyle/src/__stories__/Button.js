import React from 'react'
import { config } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import rocketstyle from '../index'

const LeftContent = config.styled.span`
  margin-right: 10px;
  padding: 5px;
  border-radius: 4px;
  background-color: black;
`

const RightContent = config.styled.span`
  margin-left: 10px;
  padding: 2px;
  border-radius: 4px;
  background-color: #0069d9;
  line-height: 1;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

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
    tag: 'button',
    label: 'This is a label',
    beforeContent: () => <LeftContent>ico</LeftContent>,
    afterContent: () => <RightContent>✕</RightContent>,
  })
  .theme({
    bgColor: '#007bff',
    color: '#fff',
  })
  .styles(
    (css) => css`
      border: 1px solid transparent;
      padding: 0 0.75rem;
      height: 80px;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      cursor: pointer;

      &::before,
      &::after {
        content: '';
        flex: 1 0 auto;
      }

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

const ExtendedButtonA = (props) => <Button {...props} />

export const HoistedButton = Button.config({
  component: ExtendedButtonA,
}).theme({ bgColor: 'papayawhip' })

export default Button
