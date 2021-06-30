/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from 'react'
import { pick, omit } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import Element, { Props as ElementProps } from '~/Element'
import Iterator, { Props as IteratorProps } from '~/helpers/Iterator'

export type Props = Partial<
  IteratorProps &
    ElementProps & {
      rootElement?: boolean
      label: never
      content: never
    }
>

const Component = forwardRef<any, Props>(
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

const name = `${PKG_NAME}/List`

Component.displayName = name
// @ts-ignore
Component.pkgName = PKG_NAME
// @ts-ignore
Component.VITUS_LABS__COMPONENT = name

export default Component
