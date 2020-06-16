import React, { useEffect, createRef, ReactNode } from 'react'
import { get } from '@vitus-labs/core'
import { ExtractProps } from '~/types'

const isNumber = (a: any, b: any) => Number.isInteger(a) && Number.isInteger(b)

const types = {
  height: 'offsetHeight',
  width: 'offsetWidth',
}

const calculate = ({ beforeContent, afterContent }) => (
  type: keyof typeof types
) => {
  const beforeContentSize = get(beforeContent, types[type])
  const afterContentSize = get(afterContent, types[type])

  if (isNumber(beforeContentSize, afterContentSize)) {
    if (beforeContentSize > afterContentSize) {
      beforeContent.style[type] = `${beforeContentSize}px`
      afterContent.style[type] = `${beforeContentSize}px`
    } else {
      beforeContent.style[type] = `${afterContentSize}px`
      afterContent.style[type] = `${afterContentSize}px`
    }
  }
}

type Props = Partial<{
  equalBeforeAfter: boolean
  vertical?: boolean
  afterContent?: React.ReactNode
  beforeContent?: React.ReactNode
}>

const withEqualBeforeAfter = <T extends {}>(
  WrappedComponent: React.ComponentType<T>
): {
  (props: T & Props & ExtractProps<typeof WrappedComponent>): JSX.Element
  displayName?: string
} => {
  type EnhancedProps = T & Props & ExtractProps<typeof WrappedComponent>

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const Enhanced = (props: EnhancedProps) => {
    const {
      equalBeforeAfter,
      vertical,
      afterContent,
      beforeContent,
      ...rest
    } = props
    const elementRef = createRef<HTMLElement>()

    const calculateSize = () => {
      const beforeContent = get(elementRef, 'current.children[0]')
      const afterContent = get(elementRef, 'current.children[2]')
      const updateElement = calculate({ beforeContent, afterContent })

      if (vertical) updateElement('height')
      else updateElement('width')
    }

    useEffect(() => {
      calculateSize()
    }, [equalBeforeAfter, beforeContent, afterContent])

    return (
      <WrappedComponent
        {...(rest as EnhancedProps)}
        afterContent={afterContent}
        beforeContent={beforeContent}
        ref={elementRef}
      />
    )
  }

  Enhanced.displayName = displayName

  return Enhanced
}

export default withEqualBeforeAfter
