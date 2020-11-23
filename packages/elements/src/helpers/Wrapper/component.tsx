import React, { forwardRef, ReactNode } from 'react'
import { Direction, AlignX, AlignY, ResponsiveBooltype } from '~/types'
import { isWebFixNeeded } from './utils'
import Styled from './styled'

type Reference = any

type Props = {
  children: ReactNode
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  block: ResponsiveBooltype
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBooltype
  extendCss: any
}

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
      ...props
    },
    ref
  ) => {
    const debugProps =
      process.env.NODE_ENV !== 'production'
        ? {
            'data-vb-element': 'Element',
          }
        : {}

    const COMMON_PROPS = {
      ...props,
      ...debugProps,
      ref,
      as: tag,
    }

    let needsFix = false
    if (__WEB__) {
      needsFix = isWebFixNeeded(tag)
    }

    if (!needsFix || __NATIVE__) {
      return (
        <Styled
          {...COMMON_PROPS}
          $element={{
            block,
            extendCss,
            direction,
            alignX,
            alignY,
            equalCols,
          }}
        >
          {children}
        </Styled>
      )
    }

    return (
      <Styled
        {...COMMON_PROPS}
        $needsFix
        $element={{
          block,
          extendCss,
        }}
      >
        <Styled
          as="span"
          $isInner
          $element={{
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
  }
)

export default Component
