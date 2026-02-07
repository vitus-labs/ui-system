/**
 * HOC that equalizes the dimensions of beforeContent and afterContent areas.
 * After render, it measures both DOM nodes via useLayoutEffect and sets the
 * larger dimension on both so they match. Uses width for inline direction
 * and height for rows direction. This is useful for centering the main
 * content when before/after slots have different intrinsic sizes.
 */
import { type Ref, useImperativeHandle, useLayoutEffect, useRef } from 'react'
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
    ref: Ref<HTMLElement>
  }>

const withEqualBeforeAfter = (WrappedComponent: any) => {
  const displayName =
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'

  const Enhanced = ({
    equalBeforeAfter,
    direction,
    afterContent,
    beforeContent,
    ref,
    ...rest
  }: Props) => {
    const internalRef = useRef<HTMLElement>(null)

    useImperativeHandle(ref, () => internalRef.current as HTMLElement)

    useLayoutEffect(() => {
      if (!equalBeforeAfter || !beforeContent || !afterContent) return
      if (!internalRef.current) return

      const el = internalRef.current
      const beforeEl = el.firstElementChild as HTMLElement | null
      const afterEl = el.lastElementChild as HTMLElement | null

      if (beforeEl && afterEl && beforeEl !== afterEl) {
        equalize(beforeEl, afterEl, direction === 'rows' ? 'height' : 'width')
      }
    })

    return (
      <WrappedComponent
        {...rest}
        afterContent={afterContent}
        beforeContent={beforeContent}
        ref={internalRef}
      />
    )
  }

  Enhanced.displayName = `withEqualSizeBeforeAfter(${displayName})`

  return Enhanced
}

export default withEqualBeforeAfter
