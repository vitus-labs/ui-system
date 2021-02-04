import { ComponentType, ForwardRefExoticComponent, VFC } from 'react'
import { config, renderContent } from '@vitus-labs/core'

// --------------------------------------------------------
// utility types
// --------------------------------------------------------
type ValueOf<T> = T[keyof T]

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends ElementType<infer TProps>
  ? TProps
  : TComponentOrTProps

export type ExtractDimensionKey<
  T extends DimensionValue
> = T extends DimensionValueObj ? T['propName'] : T

export type ExtractDimensionMulti<
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

export type MultiKeys<T extends Dimensions = Dimensions> = Partial<
  Record<ExtractDimensionKey<T[keyof T]>, true>
>
export type TDKP = Record<
  ExtractDimensionKey<Dimensions[keyof Dimensions]>,
  Record<string, boolean | never> | unknown
>

export type DimensionValue = DimensionValuePrimitive | DimensionValueObj

export type Css = typeof config.css
export type Style = ReturnType<Css>
export type OptionStyles = Array<(css: Css) => ReturnType<typeof css>>
export type Dimensions = Record<string, DimensionValue>
export type ElementType<T extends TObj | unknown = unknown> = (
  | ComponentType<T>
  | ForwardRefExoticComponent<T>
  | VFC<T>
) & { IS_ROCKETSTYLE?: true }

// --------------------------------------------------------
// rocketstyle data object
// --------------------------------------------------------
export type __ROCKETSTYLE__ = {
  dimensions: Record<string, string>
  reservedPropNames: Array<string>
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}

export type RocketComponentType = ElementType & {
  IS_ROCKETSTYLE: true
  $$rocketstyle: Record<string, unknown>
}

export type RocketProviderState<
  T extends RocketComponentType | TObj
> = T extends RocketComponentType
  ? {
      [J in keyof T['$$rocketstyle']]: keyof T['$$rocketstyle'][J]
    } & { pseudo: PseudoState }
  : T

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
  focus: boolean
  pressed: boolean
}

type RESULT<T extends RocketComponentType, DKP> = (
  props: RocketProviderState<T>
) => DKP extends TDKP
  ? Partial<
      {
        [J in keyof DKP]: keyof DKP[J]
      } &
        PseudoState & { pseudo: Partial<PseudoState> }
    >
  : TObj

type ConsumerCtxCb<DKP> = <T extends RocketComponentType>(
  attrs: RESULT<T, DKP>
) => ReturnType<RESULT<T, DKP>>

export type ConsumerCb<DKP = TDKP> = (
  ctx: ConsumerCtxCb<DKP>
) => ReturnType<ConsumerCtxCb<DKP>>

export type ConfigComponentAttrs<
  C extends ElementType,
  A extends TObj = DefaultProps
> = C extends ElementType ? ExtractProps<C> : A

export type ConfigAttrs<C, DKP> = Partial<{
  name: string
  component: C
  provider: boolean
  consumer: ConsumerCb<DKP>
  DEBUG: boolean
}>

// ATTRS chaining types
// --------------------------------------------------------
export type AttrsCb<A, T> = (
  props: Partial<A>,
  theme: T,
  helpers: { createElement: typeof renderContent }
) => { [I in keyof typeof props]: typeof props[I] }

export type AttrsParam<P, A, T> = P extends AttrsCb<A, T>
  ? AttrsCb<A, T>
  : P extends Partial<A>
  ? Partial<A>
  : P extends TObj
  ? Partial<A & P> | AttrsCb<A & P, T>
  : Partial<A>

// THEME chaining types
// --------------------------------------------------------
export type ThemeParam<P, T, CT> = P extends ThemeCb<T, CT>
  ? ThemeCb<T, CT>
  : P extends Partial<CT>
  ? Partial<CT>
  : P extends TObj
  ? ThemeCb<T, CT & P> | Partial<CT & P>
  : Partial<CT>

export type ThemeCb<T, CT> = (theme: T, css: Css) => Partial<CT>

// STYLE chaining types
// --------------------------------------------------------
export type StylesCb = (css: Css) => ReturnType<Css>

// DIMENSIONS chaining types
// --------------------------------------------------------
export type DimensionObj<CT> = Record<
  string,
  Partial<CT> | boolean | null | undefined
>

export type DimensionCb<T, CT> = (
  theme: T,
  css: Css
) => Record<string, Partial<CT> | boolean | undefined | null>

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

type RocketstyleDimensionTypesHelper<DKP extends TDKP> = Partial<
  {
    [I in keyof DKP]: keyof DKP[I]
  }
>

type RocketstyleDimensionTypesObj<
  D extends Dimensions,
  DKP extends TDKP
> = Partial<
  {
    [I in keyof DKP]: ExtractDimensionMulti<D[I]> extends true
      ? Array<keyof DKP[I]>
      : keyof DKP[I]
  }
>

type RocketstyleDimensionTypesBool<DKP extends TDKP> = Partial<
  Record<
    RocketstyleDimensionTypesHelper<DKP>[keyof RocketstyleDimensionTypesHelper<DKP>],
    boolean
  >
>

type RocketstyleDimensionTypes<
  D extends Dimensions,
  DKP extends TDKP,
  UB extends boolean
> = UB extends true
  ? RocketstyleDimensionTypesObj<D, DKP> & RocketstyleDimensionTypesBool<DKP>
  : RocketstyleDimensionTypesObj<D, DKP>

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
  A extends TObj = DefaultProps,
  // original component props
  OA extends TObj | unknown = Record<string, never>,
  // original component props
  EA extends TObj = Record<string, never>,
  // theme
  T extends TObj | unknown = unknown,
  // custom theme properties
  CT extends TObj | unknown = unknown,
  // dimensions
  D extends Dimensions = Dimensions,
  // use booleans
  UB extends boolean = boolean,
  // dimension key props
  DKP extends TDKP = TDKP
> = ForwardRefExoticComponent<A> & {
  IS_ROCKETSTYLE: true
  displayName: string
} & {
  // CONFIG chaining method
  // --------------------------------------------------------
  // {
  //   provider: true,
  //   consumer: () => {},
  //   component: Eement,
  //   DEBUG: true,
  //   name: 'aaaa'
  // }
  config: <NC extends ElementType | unknown = unknown>({
    name,
    component: NC,
    provider,
    consumer,
    DEBUG,
  }: ConfigAttrs<NC, DKP>) => RocketComponent<
    NC extends ElementType
      ? DefaultProps<NC, D> & RocketstyleDimensionTypes<D, DKP, UB>
      : A,
    NC extends ElementType ? DefaultProps<NC, D> : OA,
    EA,
    T,
    CT,
    D,
    UB,
    DKP
  >

  $$rocketstyle: DKP

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends AttrsCb<A, T> | TObj>(
    param: AttrsParam<P, A, T>
  ) => P extends AttrsCb<A, T> | Partial<A>
    ? RocketComponent<A, OA, EA, T, CT, D, UB, DKP>
    : P extends TObj
    ? RocketComponent<A & P, OA, EA & P, T, CT, D, UB, DKP>
    : RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // THEME chaining method
  // --------------------------------------------------------
  theme: <P extends ThemeCb<T, CT> | TObj>(
    param: ThemeParam<P, T, CT>
  ) => P extends ThemeCb<T, CT> | Partial<CT>
    ? RocketComponent<A, OA, EA, T, CT, D, UB, DKP>
    : P extends TObj
    ? RocketComponent<A, OA, EA, T, CT & P, D, UB, DKP>
    : RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // STYLES chaining method
  // --------------------------------------------------------
  styles: (param: StylesCb) => RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // COMPOSE chaining method
  // --------------------------------------------------------
  compose: (
    param: Record<string, unknown>
  ) => RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // Dynamic dimensions chaining method (set dynamically from configuration)
  // --------------------------------------------------------
} & {
    [I in keyof D]: <
      P extends DimensionCb<T, CT> | DimensionObj<CT>,
      K extends DimensionValue = D[I]
    >(
      param: P
    ) => P extends DimensionCb<T, CT> | DimensionObj<CT>
      ? RocketComponent<
          OA &
            EA &
            Partial<RocketstyleDimensionTypes<D, DKPTypes<K, D, P, DKP>, UB>>,
          OA,
          EA,
          T,
          CT,
          D,
          UB,
          DKPTypes<K, D, P, DKP>
        >
      : RocketComponent<A, OA, EA, T, CT, D, UB, DKP>
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
type OptionFunc = (...arg: Array<unknown>) => Record<string, unknown>

export type Configuration<
  C = ElementType,
  D extends Dimensions = Dimensions
> = Partial<
  {
    // read only / not mutated anymore
    useBooleans: boolean
    dimensions: D
    dimensionKeys: Array<keyof D>
    dimensionValues: Array<ValueOf<D>>
    multiKeys: MultiKeys

    // or Options
    component: C
    name: string
    provider: boolean
    consumer: ConsumerCb
    DEBUG: boolean

    // array chaining options
    attrs: Array<OptionFunc>
    theme: Array<OptionFunc>
    styles: OptionStyles
    compose: Record<string, TFn>
  } & Record<ExtractDimensionKey<D[keyof D]>, unknown>
>

export type StyleComponent<
  C extends ElementType = ElementType,
  T extends Record<string, unknown> | unknown = unknown,
  CT extends ReturnType<typeof config.css> | unknown = unknown,
  D extends Dimensions = Dimensions,
  UB extends boolean = boolean
> = (
  props: Configuration<C, D>
) => RocketComponent<
  // extract component props + add default rocketstyle props
  ExtractProps<C> & DefaultProps<C, D>,
  // keep original component props
  ExtractProps<C>,
  // set default extending props
  DefaultProps<C, D>,
  T,
  CT,
  D,
  UB,
  Record<string, unknown>
>

type DefaultProps<
  C extends ElementType = ElementType,
  D extends Dimensions = Dimensions
> = Partial<
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
>
