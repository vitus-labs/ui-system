/**
 * HOC that equalizes the dimensions of beforeContent and afterContent areas.
 * After render, it measures both DOM nodes via useLayoutEffect and sets the
 * larger dimension on both so they match. Uses width for inline direction
 * and height for rows direction. This is useful for centering the main
 * content when before/after slots have different intrinsic sizes.
 */
import { useLayoutEffect, useRef } from 'react'
import type { SimpleHoc } from '~/types'
import type { Props as ElementProps } from './types'

const types = {
  height: 'offsetHeight',
  width: 'offsetWidth',
} as const

type DimensionType = keyof typeof types

const equalize = (
  beforeEl: HTMLElement,
  afterEl: HTMLElement,
  type: DimensionType,
) => {
  const prop = types[type]
  const beforeSize = beforeEl[prop]
  const afterSize = afterEl[prop]

  if (Number.isInteger(beforeSize) && Number.isInteger(afterSize)) {
    const maxSize = `${Math.max(beforeSize, afterSize)}px`
    beforeEl.style[type] = maxSize
    afterEl.style[type] = maxSize
  }
}

type Props = ElementProps &
  Partial<{
    equalBeforeAfter: boolean
  }>

const withEqualBeforeAfter: SimpleHoc<Props> = (WrappedComponent) => {
  const displayName =
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'

  const Enhanced = (props: Props) => {
    const {
      equalBeforeAfter,
      direction,
      afterContent,
      beforeContent,
      ...rest
    } = props
    const elementRef = useRef<HTMLElement>(null)

    useLayoutEffect(() => {
      if (!equalBeforeAfter || !elementRef.current) return

      const { children } = elementRef.current
      const beforeEl = children[0] as HTMLElement | undefined
      const afterEl = children[2] as HTMLElement | undefined

      if (beforeEl && afterEl) {
        equalize(beforeEl, afterEl, direction === 'rows' ? 'height' : 'width')
      }
    })

    return (
      <WrappedComponent
        {...rest}
        afterContent={afterContent}
        beforeContent={beforeContent}
        // @ts-expect-error
        ref={elementRef}
      />
    )
  }

  Enhanced.displayName = `withEqualSizeBeforeAfter(${displayName})`

  return Enhanced
}

export default withEqualBeforeAfter
