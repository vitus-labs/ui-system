import React, { forwardRef } from 'react'
import { pick, omit } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Element, { Props as ElementProps } from '~/Element'
import Iterator, { Props as IteratorProps } from '~/helpers/Iterator'
import type { MergeTypes, VLForwardedComponent } from '~/types'

export type Props = MergeTypes<
  [
    ElementProps,
    IteratorProps,
    {
      rootElement?: boolean
      label: never
      content: never
    }
  ]
>

const component: VLForwardedComponent<Props> = forwardRef(
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

const name = `${PKG_NAME}/List` as const

component.displayName = name
component.pkgName = PKG_NAME
component.VITUS_LABS__COMPONENT = name

export default component
