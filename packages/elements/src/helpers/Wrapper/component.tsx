import React, { forwardRef, type ReactNode } from 'react'
import type { HTMLTags } from '@vitus-labs/core'
import type {
  Direction,
  AlignX,
  AlignY,
  ResponsiveBooltype,
  ExtendCss,
} from '~/types'
import { isWebFixNeeded } from './utils'
import Styled from './styled'

type Reference = unknown

interface Props {
  children: ReactNode
  tag: HTMLTags
  block: ResponsiveBooltype
  isInline: boolean
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBooltype
  extendCss: ExtendCss
  dangerouslySetInnerHTML: any
}

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
    const debugProps =
      process.env.NODE_ENV !== 'production'
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
      ? !props.dangerouslySetInnerHTML && tag && isWebFixNeeded(tag)
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
