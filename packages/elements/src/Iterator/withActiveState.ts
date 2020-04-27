// @ts-nocheck
import { Component, createElement } from 'react'
import { omit, renderContent } from '@vitus-labs/core'

const RESERVED_KEYS = ['type', 'activeItems', 'itemProps']

export default (WrappedComponent) =>
  class Element extends Component {
    static RESERVED_KEYS = RESERVED_KEYS
    static displayName = 'vitus-labs/elements/Iterator/withActiveState'
    static defaultProps = {
      type: 'single',
      itemProps: {},
    }

    constructor(props) {
      super(props)
      this.initActiveItems()
    }

    initActiveItems = () => {
      const { type, activeItems } = this.props

      if (type === 'single') {
        if (Array.isArray(activeItems)) {
          console.warn(
            'Iterator is type of single. activeItems cannot be an array.'
          )
        } else {
          this.state = { activeItems }
        }
      } else if (type === 'multi') {
        const activeItemsHelper = Array.isArray(activeItems)
          ? activeItems
          : [activeItems]
        this.state = {
          activeItems: new Map(activeItemsHelper.map((id) => [id, true])),
        }
      }
    }

    updateItemState = (key, status, toggle) => {
      const { type } = this.props

      if (type === 'single') {
        this.setState((prevState) => ({
          activeItems: prevState.activeItems === key ? undefined : key,
        }))
      } else if (type === 'multi') {
        this.setState((prevState) => {
          const activeItems = new Map(prevState.activeItems)
          activeItems.set(key, toggle ? !activeItems.get(key) : status)
          return { activeItems }
        })
      } else {
        this.setState({ activeItems: undefined })
      }
    }

    // available for type multiple only
    updateAllItemsState = (status) => {
      if (!status) {
        this.setState({ activeItems: new Map() })
      }
    }

    setItemActive = (key) => {
      this.updateItemState(key, true)
    }

    unsetItemActive = (key) => {
      this.updateItemState(key, false)
    }

    toggleItemActive = (key) => {
      this.updateItemState(key, false, true)
    }

    setAllItemsActive = () => {
      this.updateAllItemsState(true)
    }

    unsetAllItemsActive = () => {
      this.updateAllItemsState(false)
    }

    isItemActive = (key) => {
      const { type } = this.props
      const { activeItems } = this.state

      if (type === 'single') return activeItems === key
      else if (type === 'multi') return activeItems.get(key)
      else return false
    }

    attachItemProps = (key) => {
      const { type, itemProps } = this.props
      const result = {
        ...itemProps,
        active: this.isItemActive(key),
      }

      if (type === 'single' || type === 'multi') {
        result.setItemActive = () => this.setItemActive(key)
        result.unsetItemActive = () => this.unsetItemActive(key)
        result.toggleItemActive = () => this.toggleItemActive(key)
      }

      return Object.assign({}, result, this.attachMultipleProps())
    }

    attachMultipleProps = () => {
      const { type } = this.props

      if (type !== 'multi') {
        return {}
      }

      return {
        unsetAllItemsActive: () => this.unsetAllItemsActive(),
      }
    }

    render() {
      return renderContent(WrappedComponent, {
        itemProps: this.attachItemProps,
        ...this.attachMultipleProps(),
        ...omit(this.props, RESERVED_KEYS),
      })
    }
  }
