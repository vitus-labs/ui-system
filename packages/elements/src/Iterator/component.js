import { Component, Children } from 'react'
import { renderContent } from '@vitus-labs/core'

const RESERVED_PROPS = [
  'children',
  'itemKey',
  'injectProps',
  'component',
  'data',
  'itemProps',
  'itemKeyName'
]

const attachItemProps = ({ key, position, firstItem, lastItem }) => ({
  first: position === firstItem,
  last: position === lastItem,
  odd: position % 2 === 1,
  even: position % 2 === 0,
  position
})

export default class Element extends Component {
  static isIterator = true
  static RESERVED_PROPS = RESERVED_PROPS
  static displayName = 'vitus-labs/elements/Iterator'
  static defaultProps = {
    itemProps: {}
  }

  getItemKey = (item, index) => {
    const { itemKey } = this.props

    if (itemKey) return itemKey(item, index)
    return item.key || item.id || item.itemId || index
  }

  renderItems = () => {
    const {
      children,
      component,
      data,
      itemKeyName,
      injectProps,
      itemProps
    } = this.props

    const injectItemProps =
      typeof itemProps === 'function' ? key => itemProps(key) : () => itemProps

    // children have priority over props component + data
    if (children) {
      const firstItem = 0
      const lastItem = children.length - 1

      return Children.map(children, (child, i) => {
        const key = this.getItemKey(child, i)

        return renderContent(child, {
          ...(injectProps
            ? attachItemProps({ key, position: i, firstItem, lastItem })
            : {}),
          ...injectItemProps(key)
        })
      })
    }

    if (component && Array.isArray(data)) {
      const firstItem = 0
      const lastItem = data.length - 1
      const keyName = itemKeyName || 'children'

      return data.map((item, i) => {
        if (typeof item !== 'object') {
          const key = i
          return renderContent(component, {
            key,
            ...(injectProps
              ? attachItemProps({ key, position: i, firstItem, lastItem })
              : {}),
            ...injectItemProps(i),
            [keyName]: item
          })
        }

        const { component: itemComponent, ...restItem } = item
        const renderItem = itemComponent || component
        const key = this.getItemKey(restItem, i)

        return renderContent(renderItem, {
          key,
          ...(injectProps
            ? attachItemProps({ key, position: i, firstItem, lastItem })
            : {}),
          ...injectItemProps(key),
          ...restItem
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
