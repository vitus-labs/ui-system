import type { HTMLTags } from '@vitus-labs/core'
import type { ReactNode } from 'react'
import type {
  AlignX,
  AlignY,
  ContentAlignX,
  ContentAlignY,
  ContentBoolean,
  ContentDirection,
  Css,
  Direction,
  ExtendCss,
  ResponsiveBoolType,
} from '~/types'

export type Reference = unknown

export interface Props {
  children: ReactNode
  tag: HTMLTags
  block: ResponsiveBoolType
  isInline: boolean
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBoolType
  extendCss: ExtendCss
  dangerouslySetInnerHTML: { __html: string | TrustedHTML }
}

export interface StyledProps {
  $element: {
    direction: Direction
    alignX: AlignX
    alignY: AlignY
    equalCols: ResponsiveBoolType
  } & Partial<{
    block: ResponsiveBoolType
    extraStyles: ExtendCss
    childFix: true
    parentFix: true
  }>
  $childFix?: true
}

export type ThemeProps = {
  direction: ContentDirection
  alignX: ContentAlignX
  alignY: ContentAlignY
  equalCols: ContentBoolean
} & Partial<{
  block: ContentBoolean
  extraStyles: Css
  childFix: true
  parentFix: true
}>
