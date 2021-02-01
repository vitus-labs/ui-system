import React, { forwardRef, ReactNode } from 'react'
import {
  Direction,
  AlignX,
  AlignY,
  ResponsiveBooltype,
  ExtendCss,
} from '~/types'
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
  extendCss: ExtendCss
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
            'data-element': 'Element',
          }
        : {}

    const COMMON_PROPS = {
      ...props,
      ...debugProps,
      ref,
      as: tag,
    }

    const needsFix = __WEB__ ? isWebFixNeeded(tag) : false

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
