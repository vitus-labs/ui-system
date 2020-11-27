import { ComponentType, ForwardRefExoticComponent } from 'react'
import { config } from '@vitus-labs/core'

type Css = typeof config.css

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps

export type DisplayName = string
export type MouseAction = (e: MouseEvent) => void
export type FocusAction = (e: FocusEvent) => void

export type DimensionConfiguration = {
  multi?: boolean
}

export type DimensionsValue = Array<
  | string
  | {
      propName?: string
      multi?: boolean
    }
>

export type Dimensions = Record<string, string | DimensionsValue>

export type __ROCKETSTYLE__ = {
  dimensions: Record<string, string>
  reservedPropNames: Array<string>
  baseTheme: Record<string, any>
  themes: Record<string, any>
}

export type Configuration<C = unknown, S = unknown, D = Dimensions> = Partial<{
  component: C | ComponentType
  name: string
  attrs: any
  theme: any
  styles: S
  compose: any
  dimensions: D
  useBooleans: boolean
  provider: boolean
  consumer: any
  dimensionKeys: Array<keyof D>
  dimensionValues: Array<string>
  multiKeys: Record<string, boolean>
}>

export type Styles = <T>({
  theme,
  rootSize,
  css,
}: {
  theme: T
  rootSize: number
  css: any
}) => typeof css

// CHAINING functions typings
export type PseudoState = {
  hover: boolean
  active: boolean
  pressed: boolean
}

export type ConsumerCb = ({
  hover,
  active,
  pressed,
}: PseudoState) => Record<string, string | boolean>

export type ConfigAttrs = {
  provider: boolean
  consumer: ConsumerCb
  DEBUG: boolean
  name: string
  component: ComponentType
}

export type ConfigCB = ({
  provider,
  consumer,
  DEBUG,
  name,
  component,
}: Partial<ConfigAttrs>) => Record<string, unknown>

export type AttrsCb<A> = (props: A) => Record<string, unknown>
export type ThemeCb<T> = (theme: T, css: Css) => Record<string, unknown>
export type StylesCb = (css: Css) => Record<string, unknown>

type ObjectOrCbAttrs<T, A> = T extends Record<string, unknown> ? T : AttrsCb<A>
type ObjectOrCbTheme<T, A> = T extends Record<string, unknown> ? T : ThemeCb<A>
type ObjectOrCbDimension<T, A> = T extends Record<string, unknown>
  ? T
  : ThemeCb<A>

export type RocketComponent<
  // attrs
  A,
  // theme
  T,
  // styles
  S,
  // dimensions
  D,
  // CONFIG
  C,
  // hoc composition
  H
> = ForwardRefExoticComponent<A & DefaultProps> & {
  config: (params: Partial<ConfigAttrs>) => RocketComponent<A, T, S, D, C, H>
  attrs: <P>(
    params: ObjectOrCbAttrs<P, A>
  ) => RocketComponent<A & P & ObjectOrCbAttrs<P, A>, T, S, D, C, H>
  theme: <P>(params: ObjectOrCbTheme<P, T>) => RocketComponent<A, T, S, D, C, H>
  styles: (cb: StylesCb) => RocketComponent<A, T, S, D, C, H>

  // readonly IS_ROCKETSTYLE: true
} & Record<
    keyof D,
    <P>(params: ObjectOrCbDimension<P, T>) => RocketComponent<A, T, S, D, C, H>
  > & {
    displayName: never
  }

// attrs: <P>(params: P) => RocketComponent<A & P, T, S, D, C, H>
// attrs: <P>(cb: AttrsCb<A>) => RocketComponent<A & P, T, S, D, C, H>

type DefaultProps = Partial<{
  onMount: (
    props: __ROCKETSTYLE__ &
      Pick<Configuration, 'dimensionKeys' | 'dimensionValues' | 'multiKeys'>
  ) => void
  onMouseEnter: MouseAction
  onMouseLeave: MouseAction
  onMouseDown: MouseAction
  onMouseUp: MouseAction
  onFocus: FocusAction
  onBlur: FocusAction
}>

export type StyleComponent<
  C,
  T = Record<string, unknown>,
  S = Record<string, unknown>,
  D = Dimensions
> = (
  props: Configuration<C, S, D>
) => RocketComponent<ExtractProps<C> & DefaultProps, T, S, D, unknown, unknown>
