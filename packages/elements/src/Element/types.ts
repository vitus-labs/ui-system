import { ReactNode } from 'react'
import {
  AlignX,
  AlignY,
  Direction,
  ResponsiveBooltype,
  Responsive,
} from '~/types'

export type Props = Partial<{
  tag: import('styled-components').StyledComponentPropsWithRef<any>
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
  alignX: AlignX
  contentAlignX: AlignX
  beforeContentAlignX: AlignX
  afterContentAlignX: AlignX
  alignY: AlignY
  contentAlignY: AlignY
  beforeContentAlignY: AlignY
  afterContentAlignY: AlignY
  direction: Direction
  contentDirection: Direction
  beforeContentDirection: Direction
  afterContentDirection: Direction
  dangerouslySetInnerHTML: any
  css: any
  contentCss: any
  beforeContentCss: any
  afterContentCss: any
}>
