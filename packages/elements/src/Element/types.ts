import type { ReactNode } from 'react'
import type {
  AlignX,
  AlignY,
  Direction,
  ResponsiveBooltype,
  Responsive,
} from '~/types'

export type Props = {
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
  css: any
  contentCss: any
  beforeContentCss: any
  afterContentCss: any
}
