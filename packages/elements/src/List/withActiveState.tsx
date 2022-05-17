// @ts-nocheck
import React, { useState, useEffect } from 'react'
import type { SimpleHoc } from '~/types'

const RESERVED_KEYS = [
  'type',
  'activeItems',
  'itemProps',
  'activeItemRequired',
] as const

type Key = string | number
type MultipleMap = Map<Key, boolean>

type ItemPropsData = {
  key: Key
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  position: number
}

type Props = {
  type?: 'single' | 'multi'
  activeItemRequired?: boolean
  activeItems?: Key | Array<string | number>
  itemProps?:
    | Record<string, unknown>
    | ((props: Record<string, unknown>) => Record<string, unknown>)
}

const component: SimpleHoc<Props> = (WrappedComponent) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const Enhanced = (props: Props) => {
    const {
      type = 'single',
      activeItemRequired,
      activeItems,
      itemProps = {},
      ...rest
    } = props

    type InitActiveItems = () => Key | MultipleMap | undefined
    const initActiveItems: InitActiveItems = () => {
      if (type === 'single') {
        if (Array.isArray(activeItems)) {
          // eslint-disable-next-line no-console
          console.warn(
            'Iterator is type of single. activeItems cannot be an array.'
          )
        } else {
          return activeItems
        }
      } else if (type === 'multi') {
        const activeItemsHelper = Array.isArray(activeItems)
          ? activeItems
          : [activeItems]

        return new Map(activeItemsHelper.map((id) => [id, true]))
      }

      return undefined
    }

    const [innerActiveItems, setActiveItems] = useState(initActiveItems())

    const countActiveItems = (data) => {
      let result = 0

      data.forEach((value) => {
        if (value) result += 1
      })

      return result
    }

    const updateItemState = (key: Key) => {
      if (type === 'single') {
        setActiveItems((prevState) => {
          if (activeItemRequired) return key
          if (prevState === key) return undefined

          return key
        })
      } else if (type === 'multi') {
        setActiveItems((prevState: MultipleMap) => {
          // TODO: add conditional type to fix this
          const activeItems = new Map(prevState)

          if (
            activeItemRequired &&
            activeItems.get(key) &&
            countActiveItems(activeItems) === 1
          ) {
            return activeItems
          }

          activeItems.set(key, !activeItems.get(key))
          return activeItems
        })
      } else {
        setActiveItems(undefined)
      }
    }

    const handleItemActive = (key: Key) => {
      updateItemState(key)
    }

    const updateAllItemsState = (status) => {
      if (!status) {
        setActiveItems(new Map())
      }
    }

    const setItemActive = (key: Key) => {
      updateItemState(key)
    }

    const unsetItemActive = (key: Key) => {
      updateItemState(key)
    }

    const toggleItemActive = (key: Key) => {
      updateItemState(key)
    }

    // const setAllItemsActive = () => {
    //   updateAllItemsState(true)
    // }

    const unsetAllItemsActive = () => {
      updateAllItemsState(false)
    }

    const isItemActive = (key: Key): boolean => {
      if (!innerActiveItems) return false
      if (type === 'single') return innerActiveItems === key
      if (type === 'multi' && innerActiveItems instanceof Map) {
        return !!innerActiveItems.get(key)
      }
      return false
    }

    const attachMultipleProps = {
      unsetAllItemsActive,
    }

    const attachItemProps = (props: ItemPropsData) => {
      const { key } = props

      const defaultItemProps =
        typeof itemProps === 'object' ? itemProps : itemProps(props)

      const result = {
        ...defaultItemProps,
        active: isItemActive(key),
        handleItemActive: () => handleItemActive(key),
        setItemActive,
        unsetItemActive,
        toggleItemActive,
        ...(type === 'multi' ? attachMultipleProps : {}),
      }

      return result
    }

    useEffect(() => {
      if (type === 'single' && Array.isArray(activeItems)) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error(
            'When type=`single` activeItems must be a single value, not an array'
          )
        }
      }
    }, [type, activeItems])

    return <WrappedComponent {...rest} itemProps={attachItemProps} />
  }
  Enhanced.RESERVED_KEYS = RESERVED_KEYS
  Enhanced.displayName = `@vitus-labs/elements/List/withActiveState(${displayName})`

  return Enhanced
}

export default component
