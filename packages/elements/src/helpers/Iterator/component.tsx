import React, { Children } from 'react'
import { renderContent, isEmpty } from '@vitus-labs/core'
import type { Props, DataArrayObject } from './types'

const RESERVED_PROPS = [
  'children',
  'component',
  'data',
  'itemKey',
  'itemProps',
  'extendProps',
]

const attachItemProps = ({
  position,
  firstItem,
  lastItem,
}: {
  position: number
  firstItem: number
  lastItem: number
}) => ({
  first: position === firstItem,
  last: position === lastItem,
  odd: position % 2 === 1,
  even: position % 2 === 0,
  position,
})

type Static = {
  isIterator: true
  RESERVED_PROPS: typeof RESERVED_PROPS
}

// @ts-ignore
const Component: React.FC<Props> & Static = (props: Props) => {
  const {
    itemKey,
    children,
    component,
    data,
    extendProps,
    itemProps = {},
  } = props

  const renderItems = () => {
    const injectItemProps =
      typeof itemProps === 'function'
        ? (props) => itemProps(props)
        : () => itemProps

    // --------------------------------------------------------
    // children have priority over props component + data
    // --------------------------------------------------------
    if (children) {
      const firstItem = 0
      const lastItem = children.length - 1

      return Children.map(children, (item, i) => {
        if (!extendProps && !itemProps) return item

        const extendedProps = extendProps
          ? attachItemProps({
              position: i,
              firstItem,
              lastItem,
            })
          : {}

        return renderContent(item, {
          key: i,
          ...extendedProps,
          ...injectItemProps(extendedProps),
        })
      })
    }

    // --------------------------------------------------------
    // render props component + data
    // --------------------------------------------------------
    if (component && Array.isArray(data)) {
      const firstItem = 0
      const lastItem = data.length - 1

      return data.map((item, i) => {
        // --------------------------------------------------------
        // if it's empty object, just return
        // --------------------------------------------------------
        if (typeof item === 'object' && isEmpty(item)) {
          return null
        }

        // --------------------------------------------------------
        // if it's array of strings or numbers
        // --------------------------------------------------------
        if (typeof item !== 'object') {
          const key = i
          const keyName = itemKey || 'children'
          const extendedProps = extendProps
            ? attachItemProps({
                position: i,
                firstItem,
                lastItem,
              })
            : {}

          return renderContent(component, {
            key,
            ...extendedProps,
            ...injectItemProps(extendedProps),
            [keyName]: item,
          })
        }

        // --------------------------------------------------------
        // if it's array of objects
        // --------------------------------------------------------
        if (typeof item === 'object' && !isEmpty(item)) {
          const getKey = (item: DataArrayObject, index) => {
            if (typeof itemKey === 'function')
              return itemKey<typeof item>(item, index)
            if (typeof itemKey === 'string') return itemKey

            return item.key || item.id || item.itemId || index
          }

          const {
            component: itemComponent,
            ...restItem
          } = item as DataArrayObject
          const renderItem = itemComponent || component
          const key = getKey(restItem, i)
          const extendedProps = extendProps
            ? attachItemProps({
                position: i,
                firstItem,
                lastItem,
              })
            : {}

          return renderContent(renderItem, {
            key,
            ...extendedProps,
            ...injectItemProps(extendedProps),
            ...restItem,
          })
        }

        return null
      })
    }

    // --------------------------------------------------------
    // if there are no children or valid react component and data as an array,
    // return null to prevent error
    // --------------------------------------------------------
    return null
  }

  return renderItems()
}

Component.isIterator = true
Component.RESERVED_PROPS = RESERVED_PROPS
Component.displayName = 'vitus-labs/elements/Iterator'

export default Component
