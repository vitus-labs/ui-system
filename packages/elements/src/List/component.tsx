// @ts-nocheck
import React from 'react'
import { pick, omit } from '@vitus-labs/core'
import Base from '~/Element'
import Iterator, { Props as IteratorProps } from '~/Iterator'

type Props = {
  rootElement?: boolean
  children?: React.ReactNode
  itemsProps?: object
} & IteratorProps

const Element = ({
  rootElement = true,
  children,
  itemProps = {},
  ...props
}: Props) => {
  const renderedList = (
    <Iterator
      itemProps={{ ...itemProps }}
      {...pick(props, Iterator.RESERVED_PROPS)}
    >
      {children}
    </Iterator>
  )

  if (!rootElement) return renderedList

  return (
    <Base {...omit(props, Iterator.RESERVED_PROPS)}>
      <Iterator
        itemProps={{ ...itemProps }}
        {...pick(props, Iterator.RESERVED_PROPS)}
      >
        {children}
      </Iterator>
    </Base>
  )
}

Element.displayName = 'vitus-labs/elements/List'

export default Element
