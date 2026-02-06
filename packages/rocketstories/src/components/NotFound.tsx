import { config } from '@vitus-labs/core'
import type { FC } from 'react'

const Wrapper = config.styled.div`
  display: flex;
  font-size: 32px;
`

const component: FC = () => <Wrapper>Nothing here</Wrapper>

component.displayName = '@vitus-labs/rocketstories/Empty'

export default component
