import { ComponentType, ForwardRefExoticComponent } from 'react'
import { config, renderContent } from '@vitus-labs/core'

// --------------------------------------------------------
// utility types
// --------------------------------------------------------
type ValueOf<T> = T[keyof T]

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps

type ExtractDimensionKey<T extends DimensionValue> = T extends DimensionValueObj
  ? T['propName']
  : T

type ExtractDimensionMulti<
  T extends DimensionValue
> = T extends DimensionValueObj ? true : false

// type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T]

// --------------------------------------------------------
// primitive props
// --------------------------------------------------------
export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any
export type DisplayName = string
export type MouseAction = (e: MouseEvent) => void
export type FocusAction = (e: FocusEvent) => void

export type DimensionValuePrimitive = string
export type DimensionValueObj = {
  propName: string
  multi?: boolean
}

export type TDKP = Record<
  ExtractDimensionKey<Dimensions[keyof Dimensions]>,
  Record<string, boolean | never>
>

export type DimensionValue = DimensionValuePrimitive | DimensionValueObj

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
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}

export type Styles = <T>({
  theme,
  rootSize,
  css,
}: {
  theme: T
  rootSize: number
  css: Css
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
export type AttrsCb<A, P, T> = (
  props: Partial<A>,
  theme: T,
  helpers: { createElement: typeof renderContent }
) => Partial<A & P>

export type AttrsParam<P, A, T> = P extends AttrsCb<A, unknown, T>
  ? AttrsCb<A, unknown, T>
  : P extends Partial<A>
  ? Partial<A>
  : P extends TObj
  ? AttrsCb<A, P, T> | Partial<A & P>
  : unknown

// THEME chaining types
// --------------------------------------------------------
export type ThemeParam<P, T, CT> = P extends ThemeCb<T, CT>
  ? ThemeCb<T, CT>
  : P extends Partial<CT>
  ? Partial<CT>
  : P extends TObj
  ? ThemeCb<T, CT & P> | Partial<CT & P>
  : unknown

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

export type DimensionReturn<P, A> = P extends TObj ? A & P : A

type ReturnParam<P extends TFn | TObj> = P extends TFn ? ReturnType<P> : P

type DKPTypes<
  K extends DimensionValue,
  D extends Dimensions,
  P extends TFn | TObj,
  DKP extends TDKP
> = {
  [I in ExtractDimensionKey<D[keyof D]>]: I extends ExtractDimensionKey<K>
    ? { [J in keyof DKP[I] | keyof ReturnParam<P>]: boolean }
    : { [J in keyof DKP[I]]: boolean }
}

type DimensionBoolProps<
  K extends DimensionValue,
  DKP extends TDKP
> = DKP[ExtractDimensionKey<K>]

type ExtractDimensionKeyValues<
  K extends DimensionValue,
  DKP extends TDKP
> = keyof DimensionBoolProps<K, DKP>

type DimensionKeyProps<K extends DimensionValue, DKP extends TDKP> = Record<
  ExtractDimensionKey<K>,
  ExtractDimensionMulti<K> extends true
    ? Array<ExtractDimensionKeyValues<K, DKP>>
    : ExtractDimensionKeyValues<K, DKP>
>

type ExtendDimensionTypes<
  K extends DimensionValue,
  DKP extends TDKP,
  UB extends boolean
> = UB extends true
  ? DimensionBoolProps<K, DKP> & DimensionKeyProps<K, DKP>
  : DimensionKeyProps<K, DKP>

// --------------------------------------------------------
// THIS IS WHERE ALL THE MAGIC HAPPENS
// --------------------------------------------------------
/**
 * @param A    Generic _props_ params.
 * @param OA   Origin component props params.
 * @param T    Theme passed via context.
 * @param CT   Custom theme accepted by styles.
 * @param D    Dimensions to be used for defining component states.
 * @param UB   Use booleans value
 * @param DKP  Dimensions key props.
 */
export type RocketComponent<
  // attrs
  A extends TObj | unknown,
  // original component props
  OA extends TObj | unknown,
  // theme
  T extends TObj | unknown,
  // custom theme properties
  CT extends TObj | unknown,
  // dimensions
  D extends Dimensions,
  // use booleans
  UB extends boolean,
  // CONFIG
  DKP extends TDKP | unknown
> = ForwardRefExoticComponent<A> & {
  // CONFIG chaining method
  // --------------------------------------------------------
  config: (
    params: Partial<ConfigAttrs>
  ) => RocketComponent<A, OA, T, CT, D, UB, DKP>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends AttrsCb<A, unknown, T> | Partial<A> | TObj>(
    param: AttrsParam<P, A, T>
  ) => P extends AttrsCb<A, unknown, T>
    ? RocketComponent<A, OA, T, CT, D, UB, DKP>
    : P extends Partial<A>
    ? RocketComponent<A, OA, T, CT, D, UB, DKP>
    : P extends TObj
    ? RocketComponent<A & P, OA & P, T, CT, D, UB, DKP>
    : RocketComponent<A, OA, T, CT, D, UB, DKP>

  // THEME chaining method
  // --------------------------------------------------------
  theme: <P extends ThemeCb<T, CT> | Partial<CT> | TObj>(
    param: ThemeParam<P, T, CT>
  ) => P extends ThemeCb<T, CT>
    ? RocketComponent<A, OA, T, CT, D, UB, DKP>
    : P extends Partial<CT>
    ? RocketComponent<A, OA, T, CT, D, UB, DKP>
    : P extends TObj
    ? RocketComponent<A, OA, T, CT & P, D, UB, DKP>
    : RocketComponent<A, OA, T, CT, D, UB, DKP>

  // STYLES chaining method
  // --------------------------------------------------------
  styles: (param: StylesCb) => RocketComponent<A, OA, T, CT, D, UB, DKP>

  // Dynamic dimensions chaining method (set dynamically from configuration)
  // --------------------------------------------------------
} & {
    [I in keyof D]: <
      P extends DimensionCb<T, CT> | Record<string, Partial<CT>>,
      K extends DimensionValue = D[I]
    >(
      param: P
    ) => P extends DimensionCb<T, CT>
      ? RocketComponent<
          Omit<A, keyof ExtendDimensionTypes<K, DKPTypes<K, D, P, DKP>, UB>> &
            Partial<ExtendDimensionTypes<K, DKPTypes<K, D, P, DKP>, UB>>,
          OA,
          T,
          CT,
          D,
          UB,
          DKPTypes<K, D, P, DKP>
        >
      : P extends Record<string, Partial<CT>>
      ? RocketComponent<
          Omit<A, keyof ExtendDimensionTypes<K, DKPTypes<K, D, P, DKP>, UB>> &
            Partial<ExtendDimensionTypes<K, DKPTypes<K, D, P, DKP>, UB>>,
          OA,
          T,
          CT,
          D,
          UB,
          DKPTypes<K, D, P, DKP>
        >
      : RocketComponent<A, OA, T, CT, D, UB, DKP>
  } & {
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
  attrs: unknown
  theme: unknown
  styles: unknown
  compose: unknown
  dimensions: D
  useBooleans: boolean
  provider: boolean
  consumer: unknown
  dimensionKeys: Array<keyof D>
  dimensionValues: Array<ValueOf<D>>
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
  DefaultProps<C, D>,
  DefaultProps<C, D>,
  T,
  CT,
  D,
  UB,
  unknown
>

type DefaultProps<C, D extends Dimensions> = ExtractProps<C> &
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
  >
