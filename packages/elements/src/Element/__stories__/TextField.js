import React from 'react'
import { CONFIG } from '@vitus-labs/core'
import { Icon } from 'react-icons-kit'
import { home } from 'react-icons-kit/icomoon/home'
import WithState from '~/WithState'
import Element from '~/Element'

const extendCss = CONFIG().css`
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  font-weight: 400;
  color: #d3d3d3;
  white-space: nowrap;
  user-select: none;
  font-size: 1rem;
  line-height: 1.5;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;

  ${({ hover }) =>
    hover &&
    CONFIG().css`
      &:hover {
        border-color: #007bff;
      }
    `};

  ${({ focus }) =>
    focus &&
    CONFIG().css`
      border-color: #007bff;
    `};
`

const Label = CONFIG().styled.label`
  display: inline-block;
  margin-bottom: 0.5rem;
`

const Input = CONFIG().styled.input`
  border: none;
  outline: none;
  align-self: stretch;
  background-color: transparent;
`

const Ico = () => <Icon icon={home} />

const LeftContent = CONFIG().styled.span`
  padding: 5px;
  background-color: transparent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  ${({ hover, focus }) =>
    (hover || focus) &&
    CONFIG().css`
      color: #fff;
      background-color: #007bff;
    `};
`

const RightContent = CONFIG().styled.span`
  padding: 5px;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 4px;
  color: #d3d3d3;
  line-height: 1;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: #fff;
    background-color: #d3d3d3;
  }
`

const TextField = ({ label, placeholder, ...props }) => {
  return (
    <WithState>
      {({ state, setFocus, unsetFocus, setHover, unsetHover }) => (
        <Element
          contentDirection="rows"
          alignX="left"
          onMouseEnter={setHover}
          onMouseLeave={unsetHover}
        >
          <Label>{label}</Label>

          <Element
            css={extendCss}
            {...state}
            beforeContent={
              <LeftContent {...state}>
                <Ico />
              </LeftContent>
            }
            afterContent={<RightContent>✕</RightContent>}
          >
            <Input
              type="text"
              placeholder={placeholder}
              onFocus={setFocus}
              onBlur={unsetFocus}
            />
          </Element>
        </Element>
      )}
    </WithState>
  )
}

export default TextField
