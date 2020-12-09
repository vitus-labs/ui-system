import { ComponentType, ForwardRefExoticComponent } from 'react'
import { config, renderContent } from '@vitus-labs/core'

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: {
    propName: 'multiple',
    multi: true,
  },
} as const

const Test: ExtractDimensionMulti<typeof defaultDimensions['multiple']>

// --------------------------------------------------------
// utility types
// --------------------------------------------------------

export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any

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
export type DisplayName = string
export type MouseAction = (e: MouseEvent) => void
export type FocusAction = (e: FocusEvent) => void

export type DimensionValuePrimitive = string
export type DimensionValueObj = {
  propName: string
  multi?: boolean
}

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
export type AttrsCb<A, P, T> = (
  props: Partial<A>,
  theme: T,
  helpers: { createElement: typeof renderContent }
) => P extends unknown ? Partial<A> : Partial<A & P>

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

export type DimensionReturn<P, A> = P extends TObj ? A & P : A

type ExtractDimensionValues<DKP, P extends TFn | TObj> = P extends TFn
  ? keyof DKP | keyof ReturnType<P>
  : P extends TObj
  ? keyof DKP | keyof P
  : any

type DKPTypesAsObj<P extends TObj, DKP> = Record<
  ExtractDimensionValues<DKP, P>,
  boolean
>

type DKPTypesAsCb<P extends TFn, DKP> = Record<
  ExtractDimensionValues<DKP, P>,
  boolean
>

type KeyValueType<K, DKP, P> = K extends DimensionValueObj
  ? K['multi'] extends false
    ? Array<ExtractDimensionValues<DKP, P>>
    : ExtractDimensionValues<DKP, P>
  : ExtractDimensionValues<DKP, P>

type DimensionPropsObjBool<P, DKP> = Record<
  ExtractDimensionValues<DKP, P>,
  boolean
>
type DimensionPropsObjKeys<
  K extends DimensionValuePrimitive | DimensionValueObj,
  P,
  DKP
> = Record<ExtractDimensionKey<K>, KeyValueType<K, DKP, P>>

type DimensionPropsCbBool<P, DKP> = Record<
  ExtractDimensionValues<DKP, P>,
  boolean
>
type DimensionPropsCbKeys<
  P,
  DKP,
  K extends DimensionValuePrimitive | DimensionValueObj
> = Record<ExtractDimensionKey<K>, KeyValueType<K, DKP, P>>

type ExtendDimensionTypesAsObj<
  P,
  K extends DimensionValue,
  DKP,
  UB
> = UB extends true
  ? DimensionPropsObjBool<P, DKP> & DimensionPropsObjKeys<K, P, DKP>
  : DimensionPropsObjKeys<K, P, DKP>

type ExtendDimensionTypesAsCb<
  P,
  K extends DimensionValue,
  DKP,
  UB
> = UB extends true
  ? DimensionPropsCbBool<P, DKP> & DimensionPropsCbKeys<P, DKP, K>
  : DimensionPropsCbKeys<P, DKP, K>

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
  DKP extends TObj | unknown
> = ForwardRefExoticComponent<A> & {
  // CONFIG chaining method
  // --------------------------------------------------------
  config: (
    params: Partial<ConfigAttrs>
  ) => RocketComponent<A, OA, T, CT, D, UB, DKP>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends AttrsCb<A, unknown, T> | Partial<A> | TObj>(
    param: P extends AttrsCb<A, unknown, T>
      ? AttrsCb<A, unknown, T>
      : P extends Partial<A>
      ? Partial<A>
      : P extends TObj
      ? AttrsCb<A, P, T> | Partial<A & P>
      : any
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
    param: P extends ThemeCb<T, CT>
      ? ThemeCb<T, CT>
      : P extends Partial<CT>
      ? Partial<CT>
      : P extends TObj
      ? ThemeCb<T, CT & P> | Partial<CT & P>
      : any
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
          OA,
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
          OA,
          T,
          CT,
          D,
          UB,
          DKPTypesAsCb<P, DKP>
        >
      : RocketComponent<A, OA, T, CT, D, UB, DKP>
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
