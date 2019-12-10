import React, { forwardRef } from 'react'
import config from '@vitus-labs/core'
import Element from '~/Element'

export const Inner = config.styled('div')`
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
    css={config.css`
      height: 60px;
      padding: 10px;
      background-color: papayawhip;
      margin: 10px;
    `}
    beforeContentCss={config.css`
      padding-right: 10px;
    `}
    afterContentCss={config.css`
      padding-left: 10px;
    `}
    {...props}
  />
))
