import React, { type FC } from 'react'
import Item from './Item'

const pseudo = ['base', 'hover', 'pressed', 'active'] as const

type Props = {
  itemProps: Record<string, any>
}

const component: FC<Props> = ({ itemProps }) => (
  <>
    {pseudo.map((item) => {
      const pseudoProps = { [item]: true }

      return <Item key={item} title={item} {...itemProps} {...pseudoProps} />
    })}
  </>
)

export default component
