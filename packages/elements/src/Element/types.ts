import type { HTMLTags } from '@vitus-labs/core'
import type {
  AlignX,
  AlignY,
  Content,
  Direction,
  ResponsiveBooltype,
  Responsive,
  ExtendCss,
  InnerRef,
} from '~/types'

export type Props = Partial<{
  tag: HTMLTags
  innerRef: InnerRef
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
