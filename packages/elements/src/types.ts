import type {
  ComponentType,
  FC,
  ForwardedRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react'
import type { MakeItResponsive } from '@vitus-labs/unistyle'
import type { BreakpointKeys } from '@vitus-labs/core'
import { config, render } from '@vitus-labs/core'

export type ResponsiveStylesCallback = Parameters<MakeItResponsive>[0]['styles']

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

export type SimpleHoc<P extends Record<string, unknown> = {}> = (
  WrappedComponent: ComponentType<P>,
) => ComponentType<P>

export type InnerRef = ForwardedRef<any>

export type CssCallback = (css: typeof config.css) => ReturnType<typeof css>

export type Css = CssCallback | string

export type isEmpty = null | undefined

export type Content = Parameters<typeof render>['0']

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
  | Partial<Record<BreakpointKeys, ContentAlignY>>

export type AlignX =
  | ContentAlignX
  | ContentAlignX[]
  | Partial<Record<BreakpointKeys, ContentAlignX>>

export type Direction =
  | ContentDirection
  | ContentDirection[]
  | Partial<Record<BreakpointKeys, ContentDirection>>

export type ResponsiveBooltype =
  | boolean
  | boolean[]
  | Partial<Record<BreakpointKeys, boolean>>

export type Responsive =
  | number
  | (string | number)[]
  | Partial<Record<BreakpointKeys, number | string>>

export type ExtendCss = Css | Css[] | Partial<Record<BreakpointKeys, Css>>

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

// export type HTMLTagProps<T extends HTMLTags> = JSX.IntrinsicElements[T];

export type VLForwardedComponent<P extends Record<string, unknown> = {}> =
  ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<any>> & VLStatic

export type VLComponent<P extends Record<string, any> = {}> = FC<P> & VLStatic

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
