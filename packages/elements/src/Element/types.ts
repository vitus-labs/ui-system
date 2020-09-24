import { ReactNode } from 'react'
import {
  AlignX,
  AlignY,
  Direction,
  ResponsiveBooltype,
  Responsive,
} from '~/types'

type BaseProps = Partial<{
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  innerRef: any
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

type ChildrenProps = BaseProps & {
  children: ReactNode
}

type LabelProps = BaseProps & {
  label: ReactNode
}

type ContentProps = BaseProps & {
  content: ReactNode
}

export type Props = ChildrenProps | LabelProps | ContentProps
