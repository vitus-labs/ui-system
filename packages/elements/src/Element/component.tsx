/**
 * Core building block of the elements package. Renders a three-section layout
 * (beforeContent / content / afterContent) inside a flex Wrapper. When only
 * content is present, the Wrapper inherits content-level alignment directly
 * to avoid an unnecessary nesting layer. Handles HTML-specific edge cases
 * like void elements (input, img) and inline elements (span, a) by
 * skipping children or switching sub-tags accordingly.
 *
 * Slot elements (before/content/after) use `useCSS` for direct className
 * injection — no styled component wrapper overhead per slot.
 */
import { config, render } from '@vitus-labs/core'
import { createElement, forwardRef, useMemo } from 'react'
import { PKG_NAME } from '~/constants'
import { Wrapper } from '~/helpers'
import { getSlotTemplate } from './slotStyles'
import type { VLElement } from './types'
import { getShouldBeEmpty, isInlineElement } from './utils'

const { useCSS } = config

const defaultDirection = 'inline'
const defaultContentDirection = 'rows'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const Component: VLElement = forwardRef(
  (
    {
      innerRef,
      tag,
      label,
      content,
      children,
      beforeContent,
      afterContent,

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
    },
    ref,
  ) => {
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
    const SUB_TAG = (__WEB__ && isInline ? 'span' : 'div') as 'div' | 'span'

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
    // slot CSS via useCSS — always call all 3 (rules of hooks)
    // --------------------------------------------------------
    const slotTemplate = getSlotTemplate()

    const beforeClass = useCSS(slotTemplate, {
      $element: {
        contentType: 'before',
        parentDirection: wrapperDirection,
        direction: beforeContentDirection,
        alignX: beforeContentAlignX,
        alignY: beforeContentAlignY,
        equalCols,
        gap,
        extraStyles: beforeContentCss,
      },
      $contentType: 'before',
    })

    const contentClass = useCSS(slotTemplate, {
      $element: {
        contentType: 'content',
        parentDirection: wrapperDirection,
        direction: contentDirection,
        alignX: contentAlignX,
        alignY: contentAlignY,
        equalCols,
        extraStyles: contentCss,
      },
      $contentType: 'content',
    })

    const afterClass = useCSS(slotTemplate, {
      $element: {
        contentType: 'after',
        parentDirection: wrapperDirection,
        direction: afterContentDirection,
        alignX: afterContentAlignX,
        alignY: afterContentAlignY,
        equalCols,
        gap,
        extraStyles: afterContentCss,
      },
      $contentType: 'after',
    })

    // --------------------------------------------------------
    // common wrapper props
    // --------------------------------------------------------
    const WRAPPER_PROPS = {
      ref: ref ?? innerRef,
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

    const contentRenderOutput = render(CHILDREN)

    return (
      <Wrapper {...props} {...WRAPPER_PROPS} isInline={isInline}>
        {beforeContent &&
          createElement(
            SUB_TAG,
            { className: beforeClass, 'data-vl-slot': 'before' },
            render(beforeContent),
          )}

        {isSimpleElement
          ? contentRenderOutput
          : createElement(
              SUB_TAG,
              { className: contentClass, 'data-vl-slot': 'content' },
              contentRenderOutput,
            )}

        {afterContent &&
          createElement(
            SUB_TAG,
            { className: afterClass, 'data-vl-slot': 'after' },
            render(afterContent),
          )}
      </Wrapper>
    )
  },
)

const name = `${PKG_NAME}/Element` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

export default Component
