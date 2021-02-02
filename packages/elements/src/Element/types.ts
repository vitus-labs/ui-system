/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import type { StyledComponentPropsWithRef } from 'styled-components'
import type {
  AlignX,
  AlignY,
  Direction,
  ResponsiveBooltype,
  Responsive,
  ExtendCss,
} from '~/types'

export type Props = Partial<{
  tag: StyledComponentPropsWithRef<any>
  innerRef: any
  children: ReactNode
  content: ReactNode
  label: ReactNode
  beforeContent: ReactNode
  afterContent: ReactNode
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
