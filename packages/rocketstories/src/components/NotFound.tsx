import React, { VFC } from 'react'
import { config } from '@vitus-labs/core'

const Wrapper = config.styled.div`
  display: flex;
  font-size: 32px;
`

const component: VFC = () => <Wrapper>Nothing here</Wrapper>

component.displayName = '@vitus-labs/rocketstories/Empty'

export default component
