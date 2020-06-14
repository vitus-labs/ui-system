import React, { useState, useEffect } from 'react'

const RESERVED_KEYS = ['type', 'activeItems', 'itemProps', 'activeItemRequired']

type Key = string | number

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
  itemProps?: Record<string, any> | (() => Record<string, any>)
}

const component = (WrappedComponent) => {
  const Enhanced = ({
    type = 'single',
    activeItemRequired,
    activeItems,
    itemProps,
    ...props
  }) => {
    const initActiveItems = () => {
      if (type === 'single') {
        if (Array.isArray(activeItems)) {
          console.warn(
            'Iterator is type of single. activeItems cannot be an array.'
          )
        } else return activeItems
      } else if (type === 'multi') {
        const activeItemsHelper = Array.isArray(activeItems)
          ? activeItems
          : [activeItems]

        return new Map(activeItemsHelper.map((id) => [id, true]))
      }
    }

    const [innerActiveItems, setActiveItems] = useState(initActiveItems())

    const countActiveItems = (data) => {
      let result = 0

      console.log(data)

      data.forEach((value, key) => {
        if (value) result = result + 1
      })

      console.log(result)

      return result
    }

    const updateItemState = (key: Key, status?: boolean, toggle?: boolean) => {
      if (type === 'single') {
        setActiveItems((prevState) =>
          activeItemRequired ? key : prevState === key ? undefined : key
        )
      } else if (type === 'multi') {
        setActiveItems((prevState) => {
          const activeItems = new Map(prevState)

          if (
            activeItemRequired &&
            activeItems.get(key) &&
            countActiveItems(activeItems) === 1
          ) {
            return activeItems
          } else {
            activeItems.set(key, !activeItems.get(key))
          }

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
      updateItemState(key, true)
    }

    const unsetItemActive = (key: Key) => {
      updateItemState(key, false)
    }

    const toggleItemActive = (key: Key) => {
      updateItemState(key, false, true)
    }

    const setAllItemsActive = () => {
      updateAllItemsState(true)
    }

    const unsetAllItemsActive = () => {
      updateAllItemsState(false)
    }

    const isItemActive = (key: Key): boolean => {
      if (type === 'single') return innerActiveItems === key
      else if (type === 'multi') return innerActiveItems.get(key)
      else return false
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
        console.error(
          'When type=`single` activeItems must be a single value, not an array'
        )
      }
    }, [type, activeItems])

    return <WrappedComponent {...props} itemProps={attachItemProps} />
  }
  Enhanced.RESERVED_KEYS = RESERVED_KEYS

  return Enhanced
}

component.displayName = 'vitus-labs/elements/Iterator/withActiveState'

export default component
