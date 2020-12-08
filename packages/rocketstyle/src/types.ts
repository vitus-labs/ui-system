import { ComponentType, ForwardRefExoticComponent } from 'react'
import { config } from '@vitus-labs/core'

// --------------------------------------------------------
// utility types
// --------------------------------------------------------
export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps

// --------------------------------------------------------
// primitive props
// --------------------------------------------------------
export type DisplayName = string
export type MouseAction = (e: MouseEvent) => void
export type FocusAction = (e: FocusEvent) => void

export type DimensionValue =
  | string
  | {
      propName: string
      multi?: boolean
    }

type Css = typeof config.css
export type Style = ReturnType<typeof config.css>
export type Dimensions = Record<string, DimensionValue>
export type ElementType = ComponentType

// --------------------------------------------------------
// rocketstyle data object
// --------------------------------------------------------
export type __ROCKETSTYLE__ = {
  dimensions: Record<string, string>
  reservedPropNames: Array<string>
  baseTheme: Record<string, any>
  themes: Record<string, any>
}

export type Styles = <T>({
  theme,
  rootSize,
  css,
}: {
  theme: T
  rootSize: number
  css: any
}) => typeof css

// --------------------------------------------------------
// ROCKET style chaining helpers
// --------------------------------------------------------
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

// ATTRS chaining types
// --------------------------------------------------------
export type AttrsCb<A> = (params: A) => Partial<A>
// export type AttrsCb<P, A> = P extends Record<string, unknown>
//   ? (params: A & P) => Partial<A & P>
//   : (params: A) => A

export type AttrsReturn<P, A> = P extends Record<string, unknown> ? A & P : A

// THEME chaining types
// --------------------------------------------------------
export type ThemeCb<T, CT> = (theme: T, css: Css) => Partial<CT>

// STYLE chaining types
// --------------------------------------------------------
export type StylesCb = (css: Css) => ReturnType<Css>

// DIMENSIONS chaining types
// --------------------------------------------------------
export type DimensionCb<T, CT> = (
  theme: T,
  css: Css
) => Record<string, Partial<CT>>

export type DimensionReturn<P, A> = P extends Record<string, unknown>
  ? A & P
  : A

type DKPTypesAsObj<P, DKP> = Record<keyof DKP | keyof P, boolean>

type DKPTypesAsCb<P extends (...args: any) => any, DKP> = Record<
  keyof ReturnType<P> | keyof DKP,
  boolean
>

type ExtendDimensionTypesAsObj<P, K, DKP, UB> = UB extends true
  ? Record<keyof P | keyof DKP, boolean> & Record<K, keyof DKP | keyof P>
  : Record<K, keyof DKP | keyof P>

type ExtendDimensionTypesAsCb<P, K, DKP, UB> = UB extends true
  ? Record<keyof ReturnType<P> | keyof DKP, boolean> &
      Record<K, keyof DKP | keyof ReturnType<P>>
  : Record<K, keyof DKP | keyof ReturnType<P>>

// type ExampleAttrs<P, A> = P extends unknown ? A : AttrsCb<P, A>

// --------------------------------------------------------
// THIS IS WHERE ALL MAGIC HAPPENS
// --------------------------------------------------------
/**
 * @param A    Generic _props_ param.
 * @param T    Theme passed via context.
 * @param CT   Custom theme accepted by styles.
 * @param D    Dimensions to be used for defining component states.
 * @param DKP  Dimensions key props.
 */
export type RocketComponent<
  // attrs
  A extends Record<string, unknown> | unknown,
  // theme
  T extends Record<string, unknown> | unknown,
  // custom theme properties
  CT extends Record<string, unknown> | unknown,
  // dimensions
  D extends Record<string, unknown>,
  // use booleans
  UB extends boolean,
  // CONFIG
  DKP extends Record<string, unknown> | unknown
> = ForwardRefExoticComponent<A> & {
  // attrs: <P extends Record<string, unknown>>(
  //   cb: AttrsCb<P, A>
  // ) => RocketComponent<AttrsReturn<P, A>, T, CT, D, DK, DKP>
  // theme: (param: ThemeCb<T, CT>) => RocketComponent<A, T, CT, D, DK, DKP>
  config: (
    params: Partial<ConfigAttrs>
  ) => RocketComponent<A, T, CT, D, UB, DKP>
  attrs: <P extends AttrsCb<A> | Partial<A>>(
    param: P
  ) => P extends Partial<A>
    ? RocketComponent<A & Partial<Omit<P, keyof A>>, T, CT, D, UB, DKP>
    : P extends AttrsCb<A>
    ? RocketComponent<
        A & Partial<Omit<ReturnType<P>, keyof A>>,
        T,
        CT,
        D,
        UB,
        DKP
      >
    : A
  theme: <P extends ThemeCb<T, CT> | Partial<CT>>(
    param: P
  ) => RocketComponent<A, T, CT, D, UB, DKP>
  styles: (param: StylesCb) => RocketComponent<A, T, CT, D, UB, DKP>

  // readonly IS_ROCKETSTYLE: true
} & Record<
    keyof D,
    <
      P extends DimensionCb<T, CT> | Record<string, Partial<CT>>,
      K extends D[keyof D]
    >(
      param: P
    ) => P extends Record<string, Partial<CT>>
      ? RocketComponent<
          Omit<A, keyof ExtendDimensionTypesAsObj<P, K, DKP, UB>> &
            ExtendDimensionTypesAsObj<P, K, DKP, UB>,
          T,
          CT,
          D,
          UB,
          DKPTypesAsObj<P, DKP>
        >
      : P extends DimensionCb<T, CT>
      ? RocketComponent<
          Omit<A, keyof ExtendDimensionTypesAsCb<P, K, DKP, UB>> &
            Partial<ExtendDimensionTypesAsCb<P, K, DKP, UB>>,
          T,
          CT,
          D,
          UB,
          DKPTypesAsCb<P, DKP>
        >
      : RocketComponent<A, T, CT, D, UB, DKP>
  > & {
    displayName: never
  }

// --------------------------------------------------------
// Default rocketstyle component props
// --------------------------------------------------------
type OnMountCB<T> = {
  onMount: (props: __ROCKETSTYLE__ & T) => void
}

type DefaultPseudoProps = Partial<{
  onMouseEnter: MouseAction
  onMouseLeave: MouseAction
  onMouseDown: MouseAction
  onMouseUp: MouseAction
  onFocus: FocusAction
  onBlur: FocusAction
}>

// --------------------------------------------------------
// STYLE COMPONENT data shape
// --------------------------------------------------------
export type Configuration<C, D extends Dimensions> = {
  component: C
  name: string
  attrs: any
  theme: any
  styles: any
  compose: any
  dimensions: D
  useBooleans: boolean
  provider: boolean
  consumer: any
  dimensionKeys: Array<keyof D>
  dimensionValues: Array<D[keyof D]>
  multiKeys: Record<string, boolean>
}

export type StyleComponent<
  C extends ElementType,
  T extends Record<string, unknown> | unknown,
  CT extends ReturnType<typeof config.css> | unknown,
  D extends Dimensions,
  UB extends boolean
> = (
  props: Pick<
    Configuration<C, D>,
    | 'name'
    | 'component'
    | 'useBooleans'
    | 'styles'
    | 'dimensions'
    | 'dimensionKeys'
    | 'dimensionValues'
    | 'multiKeys'
  >
) => RocketComponent<
  ExtractProps<C> &
    DefaultPseudoProps &
    OnMountCB<
      Pick<
        Configuration<C, D>,
        | 'name'
        | 'component'
        | 'useBooleans'
        | 'styles'
        | 'dimensions'
        | 'dimensionKeys'
        | 'dimensionValues'
        | 'multiKeys'
      >
    >,
  T,
  CT,
  D,
  UB,
  unknown
>

// type DimensionKeys<D extends Dimensions, K extends D[keyof D]> = Record<
//   K extends Record<string, unknown>
//     ? Pick<K, 'propName'>
//     : K extends string
//     ? K
//     : K,
//   boolean
// >
