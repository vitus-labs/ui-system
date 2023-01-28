/* eslint-disable @typescript-eslint/ban-types */
import type { ReactElement, ForwardedRef } from 'react'
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
  VLStatic,
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
  dangerouslySetInnerHTML: { __html: string }
  css: ExtendCss
  contentCss: ExtendCss
  beforeContentCss: ExtendCss
  afterContentCss: ExtendCss
}>

export type VLElement<P extends Record<string, unknown> = {}> = {
  (props: Props & P & { ref?: ForwardedRef<any> }): ReactElement | null
} & VLStatic
