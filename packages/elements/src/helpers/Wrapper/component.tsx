import React, { forwardRef } from 'react'
import { IS_DEVELOPMENT } from '~/utils'
import { isWebFixNeeded } from './utils'
import type { Props, Reference } from './types'
import Styled from './styled'

// eslint-disable-next-line react/display-name
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
    const debugProps = IS_DEVELOPMENT
      ? {
          'data-vl-element': 'Element',
        }
      : {}

    const COMMON_PROPS = {
      ...props,
      ...debugProps,
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

    // eslint-disable-next-line no-nested-ternary
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
