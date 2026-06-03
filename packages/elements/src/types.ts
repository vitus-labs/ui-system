/**
 * Shared type definitions for the elements package. Provides responsive
 * value types (single | array | breakpoint-map) for layout props like
 * alignment and direction, plus utility types for merging prop objects
 * and defining VL component signatures with static metadata.
 */
import type { BreakpointKeys, config, render } from '@vitus-labs/core'
import type { MakeItResponsiveStyles } from '@vitus-labs/unistyle'
import type { ForwardedRef, ReactElement } from 'react'

export type ResponsiveStylesCallback = MakeItResponsiveStyles

type ExtractNullableKeys<T> = {
  [P in keyof T as T[P] extends null | undefined ? never : P]: T[P]
}

// merge types
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & R>

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R]
  ? SpreadTwo<L, Spread<R>>
  : unknown

export type MergeTypes<A extends readonly [...any]> = ExtractNullableKeys<
  Spread<A>
>

export type InnerRef = ForwardedRef<any>

export type Css =
  | ((css: typeof config.css) => ReturnType<typeof css>)
  | ReturnType<typeof config.css>
  | string

export type Content = Parameters<typeof render>['0']

export type ContentAlignX =
  | 'left'
  | 'center'
  | 'right'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'

export type ContentAlignY =
  | 'top'
  | 'center'
  | 'bottom'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'

export type ContentDirection =
  | 'inline'
  | 'rows'
  | 'reverseInline'
  | 'reverseRows'

export type ContentBoolean = boolean
export type ContentSimpleValue = string | number

export type AlignY =
  | ContentAlignY
  | ContentAlignY[]
  | Partial<Record<BreakpointKeys, ContentAlignY>>

export type AlignX =
  | ContentAlignX
  | ContentAlignX[]
  | Partial<Record<BreakpointKeys, ContentAlignX>>

export type Direction =
  | ContentDirection
  | ContentDirection[]
  | Partial<Record<BreakpointKeys, ContentDirection>>

export type ResponsiveBoolType =
  | ContentBoolean
  | ContentBoolean[]
  | Partial<Record<BreakpointKeys, ContentBoolean>>

export type Responsive =
  | ContentSimpleValue
  | ContentSimpleValue[]
  | Partial<Record<BreakpointKeys, number | string>>

export type ExtendCss = Css | Css[] | Partial<Record<BreakpointKeys, Css>>

export type VLComponent<P extends Record<string, any> = {}> = ((
  props: P & { ref?: any },
) => ReactElement | null) &
  VLStatic

export interface VLStatic {
  /**
   * React displayName
   */
  displayName?: string | undefined
  /**
   * package name
   */
  pkgName?: string
  /**
   * component name
   */
  VITUS_LABS__COMPONENT?: `@vitus-labs/${string}`
}
