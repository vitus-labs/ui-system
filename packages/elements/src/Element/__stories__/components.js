import React, { forwardRef } from 'react'
import { config } from '@vitus-labs/core'
import Element from '~/Element'

export const Inner = config.styled('div')`
  display: flex;
  min-width: 20px;
  max-width: 200px;
  height: 20px;
  background-color: palevioletred;
`

export const Wrapper = forwardRef((props, ref) => (
  <Element
    {...props}
    gap={10}
    ref={ref}
    css={config.css`
      min-height: 80px;
      padding: 10px;
      background-color: papayawhip;
      margin: 10px;
    `}
    {...props}
  />
))
