import type { ComponentType } from 'react'
import { config } from '@vitus-labs/core'

export type CssCallback = (css: typeof config.css) => ReturnType<typeof css>
export type Css = CssCallback | string | ReturnType<typeof config.css>

export type isEmpty = null | undefined
export type ContentAlignX =
  | 'left'
  | 'center'
  | 'right'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'
  | isEmpty

export type ContentAlignY =
  | 'top'
  | 'center'
  | 'bottom'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'
  | isEmpty

export type ContentDirection =
  | 'inline'
  | 'rows'
  | 'reverseInline'
  | 'reverseRows'
  | isEmpty

export type Ref = HTMLElement

export type AlignY =
  | ContentAlignY
  | ContentAlignY[]
  | Record<string, ContentAlignY>

export type AlignX =
  | ContentAlignX
  | ContentAlignX[]
  | Record<string, ContentAlignX>

export type Direction =
  | ContentDirection
  | ContentDirection[]
  | Record<string, ContentDirection>

export type ResponsiveBooltype =
  | boolean
  | Record<string, boolean>
  | Array<boolean>

export type Responsive =
  | number
  | Array<string | number>
  | Record<string, number | string>

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps
