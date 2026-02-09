import type { HTMLTags } from '@vitus-labs/core'
import type { ReactNode } from 'react'
import type {
  AlignX,
  AlignY,
  ContentAlignX,
  ContentAlignY,
  ContentBoolean,
  ContentDirection,
  ContentSimpleValue,
  Css,
  Direction,
  ExtendCss,
  Responsive,
  ResponsiveBoolType,
} from '~/types'

export interface Props {
  parentDirection: Direction
  gap: Responsive
  contentType: 'before' | 'content' | 'after'
  children: ReactNode
  tag: HTMLTags
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBoolType
  extendCss: ExtendCss
}

export interface StyledProps {
  $element: Pick<
    Props,
    | 'contentType'
    | 'parentDirection'
    | 'direction'
    | 'alignX'
    | 'alignY'
    | 'equalCols'
    | 'gap'
  > & {
    extraStyles: Props['extendCss']
  }
  $contentType: Props['contentType']
}

export type ThemeProps = Pick<Props, 'contentType'> & {
  parentDirection: ContentDirection
  direction: ContentDirection
  alignX: ContentAlignX
  alignY: ContentAlignY
  equalCols?: ContentBoolean
  gap?: ContentSimpleValue
  extraStyles?: Css
}
