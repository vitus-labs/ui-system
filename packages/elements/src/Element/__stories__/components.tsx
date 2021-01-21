import React from 'react'
import Element from '~/Element'

export const Inner = (props) => (
  <Element
    {...props}
    css={(css) => css`
      min-width: 20px;
      max-width: 200px;
      height: 20px;
      background-color: palevioletred;
    `}
  />
)

export const Wrapper = (props) => (
  <Element
    gap={10}
    css={(css) => css`
      min-height: 180px;
      padding: 10px;
      background-color: papayawhip;
      margin: 10px;
    `}
    {...props}
  />
)
