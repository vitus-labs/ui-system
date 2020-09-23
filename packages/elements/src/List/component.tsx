import React, { forwardRef } from 'react'
import { pick, omit } from '@vitus-labs/core'
import Element from '~/Element'
import Iterator from '~/helpers/Iterator'
import { ExtractProps } from '~/types'

type DefaultProps = ExtractProps<typeof Iterator> & ExtractProps<typeof Element>

type WithoutRoot = ExtractProps<typeof Iterator> & {
  rootElement?: false
}

type WithRoot = DefaultProps & {
  rootElement?: true
}

type Props = DefaultProps | WithRoot | WithoutRoot

const Component = forwardRef<any, Props>(
  ({ rootElement = true, ...props }, ref) => {
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
