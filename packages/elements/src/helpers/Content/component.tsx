/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, VFC, ReactNode } from 'react'
import type { StyledComponentPropsWithRef } from 'styled-components'
import {
  Direction,
  AlignX,
  AlignY,
  ResponsiveBooltype,
  Responsive,
  ExtendCss,
} from '~/types'
import Styled from './styled'

type Props = {
  parentDirection: Direction
  gap: Responsive
  contentType: 'before' | 'content' | 'after'
  children: ReactNode
  tag: StyledComponentPropsWithRef<any>
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBooltype
  extendCss: ExtendCss
}

const component: VFC<Partial<Props>> = ({
  contentType,
  tag,
  parentDirection,
  direction,
  alignX,
  alignY,
  equalCols,
  gap,
  extendCss,
  ...props
}) => {
  const debugProps =
    process.env.NODE_ENV !== 'production'
      ? {
          'data-vl-element': contentType,
        }
      : {}

  return (
    <Styled
      as={tag}
      $contentType={contentType}
      $element={{
        parentDirection,
        direction,
        alignX,
        alignY,
        equalCols,
        gap,
        extraStyles: extendCss,
      }}
      {...debugProps}
      {...props}
    />
  )
}

export default memo(component)
