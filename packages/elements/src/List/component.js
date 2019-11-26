import React from 'react'
import { pick, omit } from '@vitus-labs/core'
import Base from '~/Element'
import Iterator from '~/Iterator'

const Element = ({ children, passProps = [], itemProps = {}, ...props }) => {
  const extendItemProps = pick(props, passProps)

  return (
    <Base {...omit(props, Iterator.RESERVED_PROPS)}>
      <Iterator
        itemProps={{ ...extendItemProps, ...itemProps }}
        {...pick(props, Iterator.RESERVED_PROPS)}
      >
        {children}
      </Iterator>
    </Base>
  )
}

Element.displayName = 'vitus-labs/elements/List'

export default Element
