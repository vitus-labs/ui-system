import React, { forwardRef } from 'react'
import { pick, omit } from '@vitus-labs/core'
import Element, { Props as ElementProps } from '~/Element'
import Iterator, { Props as IteratorProps } from '~/helpers/Iterator'

type Props = Partial<
  IteratorProps &
    ElementProps & {
      rootElement?: boolean
      label: never
      content: never
    }
>

const Component = forwardRef<unknown, Props>(
  ({ rootElement = false, ...props }, ref) => {
    const renderedList = <Iterator {...pick(props, Iterator.RESERVED_PROPS)} />

    if (!rootElement) return renderedList

    return (
      <Element ref={ref} {...omit(props, Iterator.RESERVED_PROPS)}>
        {renderedList}
      </Element>
    )
  }
)

Component.displayName = 'vitus-labs/elements/List'

export default Component
