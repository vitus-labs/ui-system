import React, { FC } from 'react'
import rocketstyle from '@vitus-labs/rocketstyle'
import { config } from '@vitus-labs/core'
import Element, { Props } from '~/Element'

const { css, styled } = config
const rs = rocketstyle()

export { css, styled, rs }

export const Inner: FC<Props> = (props) => (
  <Element
    {...props}
    css={[
      (css) => css`
        min-width: 20px;
        max-width: 200px;
        height: 20px;
        background-color: palevioletred;
      `,
    ]}
  />
)

export const Wrapper: FC<Props> = (props) => (
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
