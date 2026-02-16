/**
 * Wrapper component that serves as the outermost styled container for Element.
 * Uses forwardRef for ref forwarding to the underlying DOM node. On web, it
 * detects button/fieldset/legend tags and applies a two-layer flex fix
 * (parent + child Styled) because these HTML elements do not natively
 * support `display: flex` consistently across browsers.
 */
import { forwardRef, useMemo } from 'react'
import { IS_DEVELOPMENT } from '~/utils'
import Styled from './styled'
import type { Props, Reference } from './types'
import { isWebFixNeeded } from './utils'

const DEV_PROPS: Record<string, string> = IS_DEVELOPMENT
  ? { 'data-vl-element': 'Element' }
  : {}

const Component = forwardRef<Reference, Partial<Props>>(
  (
    {
      children,
      tag,
      block,
      extendCss,
      direction,
      alignX,
      alignY,
      equalCols,
      isInline,
      ...props
    },
    ref,
  ) => {
    const COMMON_PROPS = {
      ...props,
      ...DEV_PROPS,
      ref,
      as: tag,
    }

    const needsFix = __WEB__
      ? !props.dangerouslySetInnerHTML && isWebFixNeeded(tag)
      : false

    const normalElement = useMemo(
      () => ({
        block,
        direction,
        alignX,
        alignY,
        equalCols,
        extraStyles: extendCss,
      }),
      [block, direction, alignX, alignY, equalCols, extendCss],
    )

    const parentFixElement = useMemo(
      () => ({ parentFix: true as const, block, extraStyles: extendCss }),
      [block, extendCss],
    )

    const childFixElement = useMemo(
      () => ({ childFix: true as const, direction, alignX, alignY, equalCols }),
      [direction, alignX, alignY, equalCols],
    )

    if (!needsFix || __NATIVE__) {
      return (
        <Styled {...COMMON_PROPS} $element={normalElement}>
          {children}
        </Styled>
      )
    }

    const asTag = __WEB__ ? (isInline ? 'span' : 'div') : undefined

    return (
      <Styled {...COMMON_PROPS} $element={parentFixElement}>
        <Styled as={asTag} $childFix $element={childFixElement}>
          {children}
        </Styled>
      </Styled>
    )
  },
)

export default Component
