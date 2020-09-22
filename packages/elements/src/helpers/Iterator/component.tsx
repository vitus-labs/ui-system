import React, { Children } from 'react'
import { renderContent } from '@vitus-labs/core'

const RESERVED_PROPS = [
  'children',
  'component',
  'data',
  'itemKey',
  'itemProps',
  'extendProps',
]

const attachItemProps = ({ key, position, firstItem, lastItem }) => ({
  key,
  first: position === firstItem,
  last: position === lastItem,
  odd: position % 2 === 1,
  even: position % 2 === 0,
  position,
})

type DataArrayObject = Partial<{
  component: any
  id: string | number
  key: string | number
  itemId: string | number
}> &
  Record<string, any>

type Props = {
  children?: React.ReactNodeArray
  component?: React.ReactNode
  data?: Array<string | number | DataArrayObject>
  extendProps?: boolean
  itemKey?:
    | string
    | ((item: Record<string, any>, index: number) => string | number)
  itemProps?:
    | Record<string, any>
    | ((key: string | number) => Record<string, any>)
}

const Component = (props: Props) => {
  const {
    itemKey,
    children,
    component,
    data,
    extendProps,
    itemProps = {},
  } = props

  const getItemKey = (item, index) => {
    if (typeof itemKey === 'function') return itemKey(item, index)
    if (typeof itemKey === 'string') return itemKey
    return item.key || item.id || item.itemId || index
  }

  const renderItems = () => {
    const injectItemProps =
      typeof itemProps === 'function'
        ? (props) => itemProps(props)
        : () => itemProps

    // children have priority over props component + data
    if (children) {
      const firstItem = 0
      const lastItem = children.length - 1

      return Children.map(children, (item, i) => {
        const key = getItemKey(item, i)
        const extendedProps = attachItemProps({
          key,
          position: i,
          firstItem,
          lastItem,
        })

        return renderContent(item, {
          ...(extendProps ? extendedProps : {}),
          ...injectItemProps(extendedProps),
        })
      })
    }

    if (component && Array.isArray(data)) {
      const firstItem = 0
      const lastItem = data.length - 1

      return data.map((item, i) => {
        // if it's array of strings or numbers
        if (typeof item !== 'object') {
          const key = i
          const keyName = getItemKey(item, i) || 'children'
          const extendedProps = attachItemProps({
            key,
            position: i,
            firstItem,
            lastItem,
          })

          return renderContent(component, {
            key,
            ...(extendProps ? extendedProps : {}),
            ...injectItemProps(extendedProps),
            [keyName]: item,
          })
        }

        // if it's array of objects
        const { component: itemComponent, ...restItem } = item
        const renderItem = itemComponent || component
        const key = getItemKey(restItem, i)
        const extendedProps = attachItemProps({
          key,
          position: i,
          firstItem,
          lastItem,
        })

        return renderContent(renderItem, {
          key,
          ...(extendProps ? extendedProps : {}),
          ...injectItemProps(extendedProps),
          ...restItem,
        })
      })
    }

    // if there are no children or valid react component and data as an array,
    // return null to prevent error
    return null
  }

  return renderItems()
}

Component.isIterator = true
Component.RESERVED_PROPS = RESERVED_PROPS
Component.displayName = 'vitus-labs/elements/Iterator'

export default Component
