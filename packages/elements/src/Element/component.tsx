/**
 * Core building block of the elements package. Renders a three-section layout
 * (beforeContent / content / afterContent) inside a flex Wrapper. When only
 * content is present, the Wrapper inherits content-level alignment directly
 * to avoid an unnecessary nesting layer. Handles HTML-specific edge cases
 * like void elements (input, img) and inline elements (span, a) by
 * skipping children or switching sub-tags accordingly.
 */
import { render } from '@vitus-labs/core'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { PKG_NAME } from '~/constants'
import { Content, Wrapper } from '~/helpers'
import type { VLElement } from './types'
import { getShouldBeEmpty, isInlineElement } from './utils'

const equalize = (el: HTMLElement, direction: unknown) => {
  const beforeEl = el.firstElementChild as HTMLElement | null
  const afterEl = el.lastElementChild as HTMLElement | null

  if (beforeEl && afterEl && beforeEl !== afterEl) {
    const type: 'height' | 'width' = direction === 'rows' ? 'height' : 'width'
    const prop = type === 'height' ? 'offsetHeight' : 'offsetWidth'
    const beforeSize = beforeEl[prop]
    const afterSize = afterEl[prop]

    if (Number.isInteger(beforeSize) && Number.isInteger(afterSize)) {
      const maxSize = `${Math.max(beforeSize, afterSize)}px`
      beforeEl.style[type] = maxSize
      afterEl.style[type] = maxSize
    }
  }
}

const defaultDirection = 'inline'
const defaultContentDirection = 'rows'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const Component: VLElement = ({
  innerRef,
  ref,
  tag,
  label,
  content,
  children,
  beforeContent,
  afterContent,
  equalBeforeAfter,

  block,
  equalCols,
  gap,

  direction,
  alignX = defaultAlignX,
  alignY = defaultAlignY,

  css,
  contentCss,
  beforeContentCss,
  afterContentCss,

  contentDirection = defaultContentDirection,
  contentAlignX = defaultAlignX,
  contentAlignY = defaultAlignY,

  beforeContentDirection = defaultDirection,
  beforeContentAlignX = defaultAlignX,
  beforeContentAlignY = defaultAlignY,

  afterContentDirection = defaultDirection,
  afterContentAlignX = defaultAlignX,
  afterContentAlignY = defaultAlignY,

  ...props
}) => {
  // --------------------------------------------------------
  // check if should render only single element
  // --------------------------------------------------------
  const shouldBeEmpty = __WEB__
    ? !!props.dangerouslySetInnerHTML || getShouldBeEmpty(tag)
    : false

  // --------------------------------------------------------
  // if not single element, calculate values
  // --------------------------------------------------------
  const isSimpleElement = !beforeContent && !afterContent
  const CHILDREN = children ?? content ?? label

  const isInline = __WEB__ ? isInlineElement(tag) : false
  const SUB_TAG = __WEB__ && isInline ? 'span' : undefined

  // --------------------------------------------------------
  // direction & alignX & alignY calculations
  // --------------------------------------------------------
  const { wrapperDirection, wrapperAlignX, wrapperAlignY } = useMemo(() => {
    let wrapperDirection: typeof direction = direction
    let wrapperAlignX: typeof alignX = alignX
    let wrapperAlignY: typeof alignY = alignY

    if (isSimpleElement) {
      if (contentDirection) wrapperDirection = contentDirection
      if (contentAlignX) wrapperAlignX = contentAlignX
      if (contentAlignY) wrapperAlignY = contentAlignY
    } else if (direction) {
      wrapperDirection = direction
    } else {
      wrapperDirection = defaultDirection
    }

    return { wrapperDirection, wrapperAlignX, wrapperAlignY }
  }, [
    isSimpleElement,
    contentDirection,
    contentAlignX,
    contentAlignY,
    alignX,
    alignY,
    direction,
  ])

  // --------------------------------------------------------
  // equalBeforeAfter: measure & equalize slot dimensions
  // --------------------------------------------------------
  const equalizeRef = useRef<HTMLElement | null>(null)
  const externalRef = ref ?? innerRef

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      equalizeRef.current = node
      if (typeof externalRef === 'function') externalRef(node)
      else if (externalRef != null) {
        ;(externalRef as { current: HTMLElement | null }).current = node
      }
    },
    [externalRef],
  )

  useLayoutEffect(() => {
    if (!__WEB__) return
    if (!equalBeforeAfter || !beforeContent || !afterContent) return
    const node = equalizeRef.current
    if (!node) return

    // Run once for the current props, then keep slot widths balanced when the
    // element resizes (instead of forcing a layout flush on every re-render).
    equalize(node, direction)

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => equalize(node, direction))
    observer.observe(node)
    return () => observer.disconnect()
  }, [equalBeforeAfter, beforeContent, afterContent, direction])

  // --------------------------------------------------------
  // common wrapper props
  // --------------------------------------------------------
  const WRAPPER_PROPS = {
    ref: mergedRef,
    extendCss: css,
    tag,
    block,
    direction: wrapperDirection,
    alignX: wrapperAlignX,
    alignY: wrapperAlignY,
    as: undefined, // reset styled-components `as` prop
  }

  // --------------------------------------------------------
  // return simple/empty element like input or image etc.
  // --------------------------------------------------------
  if (shouldBeEmpty) {
    return <Wrapper {...props} {...WRAPPER_PROPS} />
  }

  return (
    <Wrapper {...props} {...WRAPPER_PROPS} isInline={isInline}>
      {beforeContent && (
        <Content
          tag={SUB_TAG}
          contentType="before"
          parentDirection={wrapperDirection}
          extendCss={beforeContentCss}
          direction={beforeContentDirection}
          alignX={beforeContentAlignX}
          alignY={beforeContentAlignY}
          equalCols={equalCols}
          gap={gap}
        >
          {beforeContent}
        </Content>
      )}

      {isSimpleElement ? (
        render(CHILDREN)
      ) : (
        <Content
          tag={SUB_TAG}
          contentType="content"
          parentDirection={wrapperDirection}
          extendCss={contentCss}
          direction={contentDirection}
          alignX={contentAlignX}
          alignY={contentAlignY}
          equalCols={equalCols}
        >
          {CHILDREN}
        </Content>
      )}

      {afterContent && (
        <Content
          tag={SUB_TAG}
          contentType="after"
          parentDirection={wrapperDirection}
          extendCss={afterContentCss}
          direction={afterContentDirection}
          alignX={afterContentAlignX}
          alignY={afterContentAlignY}
          equalCols={equalCols}
          gap={gap}
        >
          {afterContent}
        </Content>
      )}
    </Wrapper>
  )
}

const name = `${PKG_NAME}/Element` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
