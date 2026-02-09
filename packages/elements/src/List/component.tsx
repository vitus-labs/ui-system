/**
 * List component that combines Iterator (data-driven rendering) with an
 * optional Element root wrapper. When `rootElement` is false (default),
 * it renders a bare Iterator as a fragment. When true, the Iterator output
 * is wrapped in an Element that receives all non-iterator props (e.g.,
 * layout, alignment, css), allowing the list to be styled as a single block.
 */
import { omit, pick } from '@vitus-labs/core'
import { forwardRef } from 'react'
import { PKG_NAME } from '~/constants'
import type { VLElement } from '~/Element'
import Element from '~/Element'
import type { Props as IteratorProps } from '~/helpers/Iterator'
import Iterator from '~/helpers/Iterator'
import type { MergeTypes } from '~/types'

type ListProps = {
  /**
   * A boolean value. When set to `false`, component returns `React.Fragment`
   * When set to `true`, component returns as the **root** element `Element`
   * component.
   */
  rootElement?: boolean
  /**
   * Label prop from `Element` component is being ignored.
   */
  label: never
  /**
   * Content prop from `Element` component is being ignored.
   */
  content: never
}

export type Props = MergeTypes<[IteratorProps, ListProps]>

const Component: VLElement<Props> = forwardRef(
  ({ rootElement = false, ...props }, ref) => {
    const renderedList = <Iterator {...pick(props, Iterator.RESERVED_PROPS)} />

    if (!rootElement) return renderedList

    return (
      <Element ref={ref} {...omit(props, Iterator.RESERVED_PROPS)}>
        {renderedList}
      </Element>
    )
  },
)

const name = `${PKG_NAME}/List` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
