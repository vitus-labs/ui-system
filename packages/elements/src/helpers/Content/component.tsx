import React, { memo, FC, ReactNode } from 'react'
import type { HTMLTags } from '@vitus-labs/core'
import type {
  Direction,
  AlignX,
  AlignY,
  ResponsiveBooltype,
  Responsive,
  ExtendCss,
} from '~/types'
import Styled from './styled'

export interface Props {
  parentDirection: Direction
  gap: Responsive
  contentType: 'before' | 'content' | 'after'
  children: ReactNode
  tag: HTMLTags
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBooltype
  extendCss: ExtendCss
}

const Component: FC<Partial<Props>> = ({
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

  const stylingProps = {
    contentType,
    parentDirection,
    direction,
    alignX,
    alignY,
    equalCols,
    gap,
    extraStyles: extendCss,
  }

  return (
    <Styled
      as={tag}
      $contentType={contentType}
      $element={stylingProps}
      {...debugProps}
      {...props}
    />
  )
}

export default memo(Component)
