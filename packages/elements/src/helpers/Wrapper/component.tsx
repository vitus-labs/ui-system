/**
 * Wrapper component that serves as the outermost styled container for Element.
 * Uses forwardRef for ref forwarding to the underlying DOM node. On web, it
 * detects button/fieldset/legend tags and applies a two-layer flex fix
 * (parent + child Styled) because these HTML elements do not natively
 * support `display: flex` consistently across browsers.
 */
import { forwardRef } from 'react'
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

    if (!needsFix || __NATIVE__) {
      return (
        <Styled
          {...COMMON_PROPS}
          $element={{
            block,
            direction,
            alignX,
            alignY,
            equalCols,
            extraStyles: extendCss,
          }}
        >
          {children}
        </Styled>
      )
    }

    const asTag = __WEB__ ? (isInline ? 'span' : 'div') : undefined

    return (
      <Styled
        {...COMMON_PROPS}
        $element={{
          parentFix: true,
          block,
          extraStyles: extendCss,
        }}
      >
        <Styled
          as={asTag}
          $childFix
          $element={{
            childFix: true,
            direction,
            alignX,
            alignY,
            equalCols,
          }}
        >
          {children}
        </Styled>
      </Styled>
    )
  },
)

export default Component
