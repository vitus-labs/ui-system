// @ts-nocheck
import { Component, Children } from 'react'
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

export type Props = {
  children?: React.ReactNode
  component?: React.ComponentType
  data?: Array<string | number | object>
  itemKey?: string
  itemProps?: Record<string, any> | (() => Record<string, any>)
  extendProps?: boolean
}

export default class Element extends Component<Props> {
  static isIterator = true
  static RESERVED_PROPS = RESERVED_PROPS
  static displayName = 'vitus-labs/elements/Iterator'
  static defaultProps = {
    itemProps: {},
  }

  getItemKey = (item, index) => {
    const { itemKey } = this.props

    if (typeof itemKey === 'function') return itemKey(item, index)
    if (typeof itemKey === 'string') return itemKey
    return item.key || item.id || item.itemId || index
  }

  renderItems = () => {
    const { children, component, data, extendProps, itemProps } = this.props

    const injectItemProps =
      typeof itemProps === 'function'
        ? (key) => itemProps(key)
        : () => itemProps

    // children have priority over props component + data
    if (children) {
      const firstItem = 0
      const lastItem = children.length - 1

      return Children.map(children, (item, i) => {
        const key = this.getItemKey(item, i)
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
        if (typeof item !== 'object') {
          const key = i
          const keyName = this.getItemKey(item, i) || 'children'
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

        const { component: itemComponent, ...restItem } = item
        const renderItem = itemComponent || component
        const key = this.getItemKey(restItem, i)
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

  render() {
    return this.renderItems()
  }
}
