import { ReactNode } from 'react'
import { AlignX, AlignY, Direction, Booltype } from '~/types'

type ResponsiveBoolean = boolean | Array<Booltype> | Record<string, boolean>
type Responsive =
  | number
  | Array<string | number>
  | Record<string, number | string>

type BaseProps = Partial<{
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  innerRef: any
  beforeContent: ReactNode
  afterContent: ReactNode
  block: ResponsiveBoolean
  equalCols: ResponsiveBoolean
  gap: Responsive
  vertical: ResponsiveBoolean
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
