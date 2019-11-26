import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import Element from '~/Element'

export const Inner = styled.span`
  display: block;
  min-width: 20px;
  max-width: 200px;
  height: 20px;
  background-color: palevioletred;
`

export const Wrapper = forwardRef((props, ref) => (
  <Element
    {...props}
    ref={ref}
    css={css`
      height: 60px;
      padding: 10px;
      background-color: papayawhip;
      margin: 10px;
    `}
    beforeContentCss={css`
      padding-right: 10px;
    `}
    afterContentCss={css`
      padding-left: 10px;
    `}
    {...props}
  />
))
