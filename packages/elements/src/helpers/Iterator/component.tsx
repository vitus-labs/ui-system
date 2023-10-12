import React, {
  Children,
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { isFragment } from 'react-is'
import { render, isEmpty } from '@vitus-labs/core'
import type { Props, ObjectValue, ExtendedProps, SimpleValue } from './types'

const RESERVED_PROPS = [
  'children',
  'component',
  'wrapComponent',
  'data',
  'itemKey',
  'valueName',
  'itemProps',
  'wrapProps',
] as const

type AttachItemProps = ({
  i,
  length,
}: {
  i: number
  length: number
}) => ExtendedProps

const attachItemProps: AttachItemProps = ({
  i,
  length,
}: {
  i: number
  length: number
}) => {
  const position = i + 1

  return {
    index: i,
    first: position === 1,
    last: position === length,
    odd: position % 2 === 1,
    even: position % 2 === 0,
    position,
  }
}

type Static = {
  isIterator: true
  RESERVED_PROPS: typeof RESERVED_PROPS
}

const Component: FC<Props> & Static = (props) => {
  const {
    itemKey,
    valueName,
    children,
    component,
    data,
    wrapComponent: Wrapper,
    wrapProps,
    itemProps,
  } = props

  const injectItemProps = useMemo(
    () => (typeof itemProps === 'function' ? itemProps : () => itemProps),
    [itemProps],
  )

  const injectWrapItemProps = useMemo(
    () => (typeof wrapProps === 'function' ? wrapProps : () => wrapProps),
    [wrapProps],
  )

  const getKey = useCallback(
    (item: string | number, index: number) => {
      if (typeof itemKey === 'function') return itemKey(item, index)

      return index
    },
    [itemKey],
  )

  const renderChild = (child: ReactNode, total = 1, i = 0) => {
    if (!itemProps && !Wrapper) return child

    const extendedProps = attachItemProps({
      i,
      length: total,
    })

    const finalItemProps = itemProps ? injectItemProps({}, extendedProps) : {}

    // if no props extension is required, just return children

    if (Wrapper) {
      const finalWrapProps = wrapProps
        ? injectWrapItemProps({}, extendedProps)
        : {}

      return (
        <Wrapper key={i} {...finalWrapProps}>
          {render(child, finalItemProps)}
        </Wrapper>
      )
    }

    return render(child, {
      key: i,
      ...finalItemProps,
    })
  }

  // --------------------------------------------------------
  // render children
  // --------------------------------------------------------
  const renderChildren = () => {
    if (!children) return null

    // if children is Array
    if (Array.isArray(children)) {
      return Children.map(children, (item, i) =>
        renderChild(item, children.length, i),
      )
    }

    // if children is Fragment
    if (isFragment(children)) {
      const fragmentChildren = children?.props?.children as ReactNode[]
      const childrenLength = fragmentChildren.length

      return fragmentChildren.map((item, i) =>
        renderChild(item, childrenLength, i),
      )
    }

    // if single child
    return renderChild(children)
  }

  // --------------------------------------------------------
  // render array of strings or numbers
  // --------------------------------------------------------
  const renderSimpleArray = (data: SimpleValue[]) => {
    const { length } = data

    // if the data array is empty
    if (length === 0) return null

    return data.map((item, i) => {
      const key = getKey(item, i)
      const keyName = valueName ?? 'children'
      const extendedProps = attachItemProps({
        i,
        length,
      })

      const finalItemProps = {
        ...(itemProps
          ? injectItemProps({ [keyName]: item }, extendedProps)
          : {}),
        [keyName]: item,
      }

      if (Wrapper) {
        const finalWrapProps = wrapProps
          ? injectWrapItemProps({ [keyName]: item }, extendedProps)
          : {}

        return (
          <Wrapper key={key} {...finalWrapProps}>
            {render(component, finalItemProps)}
          </Wrapper>
        )
      }

      return render(component, { key, ...finalItemProps })
    })
  }

  // --------------------------------------------------------
  // render array of objects
  // --------------------------------------------------------
  const renderComplexArray = (data: ObjectValue[]) => {
    const renderData = data.filter((item) => !isEmpty(item)) // remove empty objects
    const { length } = renderData

    // if it's empty
    if (renderData.length === 0) return null

    const getKey = (item: ObjectValue, index: number) => {
      if (!itemKey) return item.key ?? item.id ?? item.itemId ?? index
      if (typeof itemKey === 'function') return itemKey(item, index)
      if (typeof itemKey === 'string') return item[itemKey]

      return index
    }

    return renderData.map((item, i) => {
      const { component: itemComponent, ...restItem } = item
      const renderItem = itemComponent ?? component
      const key = getKey(restItem, i)
      const extendedProps = attachItemProps({
        i,
        length,
      })

      const finalItemProps = {
        ...(itemProps ? injectItemProps(item, extendedProps) : {}),
        ...restItem,
      }

      if (Wrapper && !itemComponent) {
        const finalWrapProps = wrapProps
          ? injectWrapItemProps(item, extendedProps)
          : {}

        return (
          <Wrapper key={key} {...finalWrapProps}>
            {render(renderItem, finalItemProps)}
          </Wrapper>
        )
      }

      return render(renderItem, { key, ...finalItemProps })
    })
  }

  // --------------------------------------------------------
  // render list items
  // --------------------------------------------------------
  const renderItems = () => {
    // --------------------------------------------------------
    // children have priority over props component + data
    // --------------------------------------------------------
    if (children) return renderChildren()

    // --------------------------------------------------------
    // render props component + data
    // --------------------------------------------------------
    if (component && Array.isArray(data)) {
      const clearData = data.filter(
        (item) => item !== null && item !== undefined,
      )

      const isSimpleArray = clearData.every(
        (item) => typeof item === 'string' || typeof item === 'number',
      )

      if (isSimpleArray) return renderSimpleArray(clearData as SimpleValue[])

      const isComplexArray = clearData.every((item) => typeof item === 'object')

      if (isComplexArray) return renderComplexArray(clearData as ObjectValue[])

      return null
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

export default Component
