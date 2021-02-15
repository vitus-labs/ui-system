/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, ReactNode } from 'react'
import type { StyledComponentPropsWithRef } from 'styled-components'
import {
  Direction,
  AlignX,
  AlignY,
  ResponsiveBooltype,
  ExtendCss,
} from '~/types'
import { isWebFixNeeded } from './utils'
import Styled from './styled'

type Reference = unknown

type Props = {
  children: ReactNode
  tag: StyledComponentPropsWithRef<any>
  block: ResponsiveBooltype
  isInline: boolean
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBooltype
  extendCss: ExtendCss
  dangerouslySetInnerHTML: any
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
      isInline,
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
    const needsFix = __WEB__
      ? !props.dangerouslySetInnerHTML && tag && isWebFixNeeded(tag)
      : false

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
          as={isInline ? 'span' : 'div'}
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
