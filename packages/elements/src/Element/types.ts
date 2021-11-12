/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import type { HTMLTags, renderContent } from '@vitus-labs/core'
import type {
  AlignX,
  AlignY,
  Direction,
  ResponsiveBooltype,
  Responsive,
  ExtendCss,
} from '~/types'

type Content = Parameters<typeof renderContent>['0']

export type Props = Partial<{
  tag: HTMLTags
  innerRef: any
  children: Content
  content: Content
  label: Content
  beforeContent: Content
  afterContent: Content
  block: ResponsiveBooltype
  equalCols: ResponsiveBooltype
  gap: Responsive
  vertical: ResponsiveBooltype
  direction: Direction
  contentDirection: Direction
  beforeContentDirection: Direction
  afterContentDirection: Direction
  alignX: AlignX
  contentAlignX: AlignX
  beforeContentAlignX: AlignX
  afterContentAlignX: AlignX
  alignY: AlignY
  contentAlignY: AlignY
  beforeContentAlignY: AlignY
  afterContentAlignY: AlignY
  dangerouslySetInnerHTML: any
  css: ExtendCss
  contentCss: ExtendCss
  beforeContentCss: ExtendCss
  afterContentCss: ExtendCss
}>
