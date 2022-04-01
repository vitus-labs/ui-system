import type {
  ComponentType,
  VFC,
  ForwardedRef,
  PropsWithChildren,
  ReactElement,
} from 'react'
import { config, renderContent } from '@vitus-labs/core'

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
) => VFC<MergeTypes<[P, ExtractProps<T>]>>

/**
 * @hidden
 */
export type InnerRef = ForwardedRef<any>

/**
 * @hidden
 */
export type CssCallback = (css: typeof config.css) => ReturnType<typeof css>

/**
 * @hidden
 */
export type Css = CssCallback | string | ReturnType<typeof config.css>

/**
 * @hidden
 */
export type isEmpty = null | undefined

/**
 * @hidden
 */
export type Content = Parameters<typeof renderContent>['0']

/**
 * @hidden
 */
export type ContentAlignX =
  | 'left'
  | 'center'
  | 'right'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'
  | isEmpty

/**
 * @hidden
 */
export type ContentAlignY =
  | 'top'
  | 'center'
  | 'bottom'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'
  | isEmpty

/**
 * @hidden
 */
export type ContentDirection =
  | 'inline'
  | 'rows'
  | 'reverseInline'
  | 'reverseRows'
  | isEmpty

/**
 * @hidden
 */
export type Ref = HTMLElement

/**
 * @hidden
 */
export type AlignY =
  | ContentAlignY
  | ContentAlignY[]
  | Record<string, ContentAlignY>

/**
 * @hidden
 */
export type AlignX =
  | ContentAlignX
  | ContentAlignX[]
  | Record<string, ContentAlignX>

/**
 * @hidden
 */
export type Direction =
  | ContentDirection
  | ContentDirection[]
  | Record<string, ContentDirection>

/**
 * @hidden
 */
export type ResponsiveBooltype =
  | boolean
  | Record<string, boolean>
  | Array<boolean>

/**
 * @hidden
 */
export type Responsive =
  | number
  | Array<string | number>
  | Record<string, number | string>

/**
 * @hidden
 */
export type ExtendCss = Css | Array<Css> | Record<string, Css>

/**
 * @hidden
 */
export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

// export type HTMLTagProps<T extends HTMLTags> = JSX.IntrinsicElements[T];

export type VLForwardedComponent<P = Record<string, unknown>> =
  ForwardRefRenderFunction<any, P> & VLStatic

export type VLComponent<P = Record<string, unknown>> = VFC<P> & VLStatic

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
