import type {
  ComponentType,
  FC,
  ForwardedRef,
  PropsWithChildren,
  ReactElement,
} from 'react'
import { MakeItResponsive } from '@vitus-labs/unistyle'
import { config, render, BreakpointKeys } from '@vitus-labs/core'

export type ResponsiveStylesCallback = Parameters<MakeItResponsive>[0]['styles']

type ExtractNullableKeys<T> = {
  [P in keyof T as T[P] extends null | never | undefined ? never : P]: T[P]
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

export type SimpleHoc<P extends Record<string, unknown>> = <
  T extends ComponentType<any>
>(
  WrappedComponent: T
) => FC<MergeTypes<[P, ExtractProps<T>]>>

export type InnerRef = ForwardedRef<any>

export type CssCallback = (css: typeof config.css) => ReturnType<typeof css>

export type Css = CssCallback | string | ReturnType<typeof config.css>

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
  | Array<boolean>
  | Partial<Record<BreakpointKeys, boolean>>

export type Responsive =
  | number
  | Array<string | number>
  | Partial<Record<BreakpointKeys, number | string>>

export type ExtendCss = Css | Array<Css> | Partial<Record<BreakpointKeys, Css>>

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

// export type HTMLTagProps<T extends HTMLTags> = JSX.IntrinsicElements[T];

export type VLForwardedComponent<P = Record<string, unknown>> =
  ForwardRefRenderFunction<any, P> & VLStatic

export type VLComponent<P = Record<string, unknown>> = FC<P> & VLStatic

interface ForwardRefRenderFunction<T, P = Record<string, unknown>> {
  (
    props: PropsWithChildren<P & { ref?: ForwardedRef<T> }>,
    ref: ForwardedRef<T>
  ): ReactElement | null
}

export type VLStatic = {
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
