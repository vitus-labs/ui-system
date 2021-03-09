/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ForwardRefExoticComponent } from 'react'
import { config, renderContent } from '@vitus-labs/core'

// --------------------------------------------------------
// utility types
// --------------------------------------------------------
type ValueOf<T> = T[keyof T]

type IsFalseOrNullable<T> = T extends null | undefined | false ? never : true
type NullableKeys<T> = { [K in keyof T]: IsFalseOrNullable<T[K]> }

type ExtractNullableDimensionKeys<T> = {
  [P in keyof T as T[P] extends false ? never : P]: T[P]
}

type ExtractNullableKeys<T> = {
  [P in keyof T as T[P] extends null | never | undefined ? never : P]: T[P]
}

// merge types
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> & R
  // Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
  // Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
  // SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R]
  ? SpreadTwo<L, Spread<R>>
  : unknown

type MergeTypes<A extends readonly [...any]> = ExtractNullableKeys<Spread<A>>

// extract props fron component
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

export type ExtractDimensionAttrsKeys<D extends Dimensions> = {
  [I in keyof D]: ExtractDimensionKey<D[I]>
}[keyof D]

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
  Record<string, boolean | never | Record<string, boolean>> | unknown
>

export type DimensionValue = DimensionValuePrimitive | DimensionValueObj

export type Css = typeof config.css
export type Style = ReturnType<Css>
export type OptionStyles = Array<(css: Css) => ReturnType<typeof css>>
export type Dimensions = Record<string, DimensionValue>
export type ElementType<T extends TObj | unknown = any> = (
  | ComponentType<T>
  | ForwardRefExoticComponent<T>
) &
  Partial<{ [x: string]: any }>

// --------------------------------------------------------
// rocketstyle data object
// --------------------------------------------------------
export type __ROCKETSTYLE__ = {
  dimensions: Record<string, string>
  reservedPropNames: Record<string, true>
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

type ConsumerCtxCBValue<T extends RocketComponentType, DKP> = (
  props: RocketProviderState<T>
) => DKP extends TDKP
  ? Partial<
      {
        [J in keyof DKP]: keyof DKP[J] | undefined
      } &
        PseudoState & { pseudo: Partial<PseudoState> }
    >
  : TObj

type ConsumerCtxCb<DKP> = <T extends RocketComponentType>(
  attrs: ConsumerCtxCBValue<T, DKP>
) => ReturnType<ConsumerCtxCBValue<T, DKP>>

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
  inversed: boolean
  passProps: Array<string>
}>

// ATTRS chaining types
// --------------------------------------------------------
export type AttrsCb<A, T> = (
  props: A,
  theme: T,
  helpers: {
    variant?: 'light' | 'dark'
    isDark?: boolean
    isLight?: boolean
    createElement: typeof renderContent
  }
) => { [I in keyof A]?: A[I] }

// THEME chaining types
// --------------------------------------------------------
export type ThemeVariant = <A, B>(light: A, dark: B) => A | B

export type ThemeCb<T, CT> = (
  theme: T,
  mode: ThemeVariant,
  css: Css
) => Partial<CT>

// STYLE chaining types
// --------------------------------------------------------
export type StylesCb = (css: Css) => ReturnType<Css>

// DIMENSIONS chaining types
// --------------------------------------------------------
export type DimensionResult<CT> = Record<string, boolean | null | Partial<CT>>
export type DimensionObj<CT> = DimensionResult<CT>

export type DimensionCb<T, CT> = (
  theme: T,
  mode: ThemeVariant,
  css: Css
) => DimensionResult<CT>

export type DimensionReturn<P, A> = P extends TObj ? A & P : A

type ReturnParam<P extends TFn | TObj> = P extends TFn ? ReturnType<P> : P

type DKPTypes<
  K extends DimensionValue,
  D extends Dimensions,
  P extends ReturnParam<TFn | TObj>,
  DKP extends TDKP
> = {
  [I in ExtractDimensionKey<D[keyof D]>]: I extends ExtractDimensionKey<K>
    ? ExtractNullableDimensionKeys<Spread<[DKP[I], NullableKeys<P>]>>
    : DKP[I]
}

type RocketstyleDimensionTypesHelper<DKP extends TDKP> = {
  [I in keyof DKP]: keyof DKP[I]
}

type RocketstyleDimensionTypesObj<D extends Dimensions, DKP extends TDKP> = {
  [I in keyof DKP]: ExtractDimensionMulti<D[I]> extends true
    ? Array<keyof DKP[I]>
    : keyof DKP[I]
}

type RocketstyleDimensionTypesBool<DKP extends TDKP> = Partial<
  Record<ValueOf<RocketstyleDimensionTypesHelper<DKP>>, boolean>
>

type RocketstyleDimensionTypes<
  D extends Dimensions,
  DKP extends TDKP,
  UB extends boolean
> = UB extends true
  ? Partial<
      RocketstyleDimensionTypesObj<D, DKP> & RocketstyleDimensionTypesBool<DKP>
    >
  : Partial<RocketstyleDimensionTypesObj<D, DKP>>

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
  OA extends TObj = {},
  // extended component props
  EA extends TObj = {},
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
    inversed,
    passProps,
  }: ConfigAttrs<NC, DKP>) => RocketComponent<
    NC extends ElementType
      ? Spread<[OA, EA]> & RocketstyleDimensionTypes<D, DKP, UB>
      : A,
    NC extends ElementType
      ? Omit<ExtractProps<NC>, ExtractDimensionAttrsKeys<D>>
      : OA,
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
  attrs: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[A, P]>> | AttrsCb<MergeTypes<[A, P]>, T>
      : Partial<A> | AttrsCb<A, T>
  ) => P extends TObj
    ? RocketComponent<
        MergeTypes<[A, P, RocketstyleDimensionTypes<D, DKP, UB>]>,
        OA,
        MergeTypes<[EA, P]>,
        T,
        CT,
        D,
        UB,
        DKP
      >
    : RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // THEME chaining method
  // --------------------------------------------------------
  theme: <P extends TObj = {}>(
    param: P extends TObj
      ? Partial<Spread<[CT, P]>> | ThemeCb<Spread<[T, P]>, CT>
      : Partial<CT> | ThemeCb<T, CT>
  ) => P extends TObj
    ? RocketComponent<A, OA, EA, T, Spread<[CT, P]>, D, UB, DKP>
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
      K extends DimensionValue = D[I],
      P extends DimensionCb<T, CT> | DimensionObj<CT> =
        | DimensionCb<T, CT>
        | DimensionObj<CT>,
      RT = ReturnParam<P>
    >(
      param: P
    ) => P extends DimensionCb<T, CT> | DimensionObj<CT>
      ? RocketComponent<
          Spread<
            [A, RocketstyleDimensionTypes<D, DKPTypes<K, D, RT, DKP>, UB>]
          >,
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
    inversed: boolean
    passProps: Array<string>

    // array chaining options
    attrs: Array<OptionFunc>
    theme: Array<OptionFunc>
    styles: OptionStyles
    compose: Record<string, TFn>
  } & Record<ExtractDimensionKey<D[keyof D]>, any>
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
  Spread<[ExtractProps<C>, DefaultProps<C, D>]>,
  // keep original component props + extract dimension props
  Omit<ExtractProps<C>, ExtractDimensionAttrsKeys<D>>,
  // set default extending props
  DefaultProps<C, D>,
  T,
  CT,
  D,
  UB,
  {}
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
