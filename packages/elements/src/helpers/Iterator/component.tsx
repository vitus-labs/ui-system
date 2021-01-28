import React, { Children, FC } from 'react'
import { renderContent, isEmpty } from '@vitus-labs/core'
import type { Props, DataArrayObject, ExtendedProps } from './types'

const RESERVED_PROPS = [
  'children',
  'component',
  'wrapComponent',
  'data',
  'itemKey',
  'valueName',
  'itemProps',
  'wrapProps',
  'extendProps',
]

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

const Component: FC<Props> & Static = (props: Props) => {
  const {
    // @ts-ignore
    itemKey,
    // @ts-ignore
    valueName,
    // @ts-ignore
    children,
    // @ts-ignore
    component,
    // @ts-ignore
    data,
    wrapComponent: Wrapper,
    // @ts-ignore
    wrapProps,
    extendProps,
    itemProps,
  } = props

  const renderedElement = (component, props) => renderContent(component, props)

  const injectItemProps =
    typeof itemProps === 'function'
      ? (props, extendedProps) => itemProps(props, extendedProps)
      : () => itemProps

  const injectWrapItemProps =
    typeof wrapProps === 'function'
      ? (props, extendedProps) => wrapProps(props, extendedProps)
      : () => itemProps

  // --------------------------------------------------------
  // render children
  // --------------------------------------------------------
  const renderChildren = () => {
    const { length } = children

    // if no props extension is required, just return children
    if (!extendProps && !itemProps && !Wrapper) return children

    return Children.map(children, (item, i) => {
      const key = i
      const extendedProps =
        extendProps || !isEmpty(itemProps)
          ? attachItemProps({
              i,
              length,
            })
          : {}

      const finalItemProps = {
        ...(extendProps ? extendedProps : {}),
        ...(itemProps ? injectItemProps({}, extendedProps) : {}),
      }

      const finalWrapProps = {
        ...(extendProps ? extendedProps : {}),
        ...(wrapProps ? injectWrapItemProps({}, extendedProps) : {}),
      }

      if (Wrapper) {
        return (
          <Wrapper key={key} {...finalWrapProps}>
            {renderedElement(item, finalItemProps)}
          </Wrapper>
        )
      }

      return renderContent(item, {
        key: i,
        ...finalItemProps,
      })
    })
  }

  // --------------------------------------------------------
  // render array of strings or numbers
  // --------------------------------------------------------
  const renderSimpleArray = (data) => {
    const renderData = data.filter(
      (item) => item !== null || item !== undefined // remove empty values
    )
    const { length } = renderData

    // if it's empty
    if (renderData.length === 0) return null

    const getKey = (item: string | number, index) => {
      if (typeof itemKey === 'function') return itemKey(item, index)

      return index
    }

    return renderData.map((item, i) => {
      const key = getKey(item, i)
      const keyName = valueName || 'children'
      const extendedProps =
        extendProps || !isEmpty(itemProps)
          ? attachItemProps({
              i,
              length,
            })
          : {}

      const finalItemProps = {
        ...(extendProps ? extendedProps : {}),
        ...(itemProps
          ? injectItemProps({ [valueName]: item }, extendedProps)
          : {}),
        [keyName]: item,
      }

      const finalWrapProps = {
        ...(extendProps ? extendedProps : {}),
        ...(wrapProps
          ? injectWrapItemProps({ [valueName]: item }, extendedProps)
          : {}),
      }

      if (Wrapper) {
        return (
          <Wrapper key={key} {...finalWrapProps}>
            {renderedElement(component, finalItemProps)}
          </Wrapper>
        )
      }

      return renderedElement(component, { key, ...finalItemProps })
    })
  }

  // --------------------------------------------------------
  // render array of strings or numbers
  // --------------------------------------------------------
  const renderComplexArray = (data) => {
    const renderData = data.filter((item) => !isEmpty(item)) // remove empty objects
    const { length } = renderData

    // if it's empty
    if (renderData.length === 0) return null

    const getKey = (item: DataArrayObject, index) => {
      if (!itemKey) return item.key || item.id || item.itemId || index
      if (typeof itemKey === 'function') return itemKey(item, index)
      if (typeof itemKey === 'string') return item[itemKey]

      return index
    }

    return renderData.map((item, i) => {
      const { component: itemComponent, ...restItem } = item as DataArrayObject
      const renderItem = itemComponent || component
      const key = getKey(restItem, i)
      const extendedProps =
        extendProps || !isEmpty(itemProps)
          ? attachItemProps({
              i,
              length,
            })
          : {}

      const finalItemProps = {
        ...(extendProps ? extendedProps : {}),
        ...(itemProps ? injectItemProps(item, extendedProps) : {}),
        ...restItem,
      }

      const finalWrapProps = {
        ...(extendProps ? extendedProps : {}),
        ...(wrapProps ? injectWrapItemProps(item, extendedProps) : {}),
      }

      if (Wrapper) {
        return (
          <Wrapper key={key} {...finalWrapProps}>
            {renderedElement(renderItem, finalItemProps)}
          </Wrapper>
        )
      }

      return renderedElement(renderItem, { key, ...finalItemProps })
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
        (item) => item !== null && item !== undefined
      )

      const isSimpleArray = clearData.every(
        (item) => typeof item === 'string' || typeof item === 'number'
      )

      if (isSimpleArray) return renderSimpleArray(clearData)

      const isComplexArray = clearData.every((item) => typeof item === 'object')

      if (isComplexArray) return renderComplexArray(clearData)

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
Component.displayName = 'vitus-labs/elements/Iterator'

export default Component
