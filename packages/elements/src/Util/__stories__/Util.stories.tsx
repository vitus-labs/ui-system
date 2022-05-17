import React from 'react'
import { config } from '@vitus-labs/core'
import Element from '~/Element'
import Util from '~/Util'

export default {
  component: Util,
}

const Wrapper = config.styled(Util)`
  color: red;
`

const Item = (props) => (
  <Element
    {...props}
    css={`
      font-size: 36px;
      color: ${({ primary }) => (primary ? 'blue' : 'black')};
    `}
  />
)

export const base = () => (
  <Util>
    <Item>this is an item</Item>
  </Util>
)

export const styles = () => (
  <Wrapper>
    <Item>this is an item</Item>
  </Wrapper>
)
