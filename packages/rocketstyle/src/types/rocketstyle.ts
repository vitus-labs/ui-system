/* eslint-disable @typescript-eslint/ban-types */
import type { ForwardRefExoticComponent } from 'react'
import type { TObj, ElementType, MergeTypes, ExtractProps } from './utils'
import type {
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DimensionProps,
  ExtractDimensions,
} from './dimensions'
import type { StylesCb, Styles } from './styles'
import type { ConfigAttrs } from './config'
import type { AttrsCb } from './attrs'
import type { Theme, ThemeCb, ThemeModeKeys } from './theme'
import type { ComposeParam } from './hoc'
import type { DefaultProps } from './configuration'

export type RocketComponent<
  OA extends TObj = {},
  EA extends TObj = {},
  T extends TObj = {},
  CSS extends TObj = {},
  S extends TObj = {},
  HOC extends TObj = {},
  D extends Dimensions = Dimensions,
  UB extends boolean = boolean,
  DKP extends TDKP = TDKP
> = IRocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP> & {
  [I in keyof D]: <
    K extends DimensionValue = D[I],
    P extends DimensionCallbackParam<
      Theme<T>,
      Styles<CSS>
    > = DimensionCallbackParam<Theme<T>, Styles<CSS>>
  >(
    param: P
  ) => P extends DimensionCallbackParam<Theme<T>, Styles<CSS>>
    ? RocketComponent<
        OA,
        EA,
        T,
        CSS,
        S,
        HOC,
        D,
        UB,
        DimensionProps<K, D, P, DKP>
      >
    : RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>
}

/**
 * @param OA   Origin component props params.
 * @param EA   Extended prop types
 * @param T    Theme passed via context.
 * @param CSS  Custom theme accepted by styles.
 * @param S    Defined statics
 * @param D    Dimensions to be used for defining component states.
 * @param UB   Use booleans value
 * @param DKP  Dimensions key props.
 * @param DFP  Calculated final component props
 */
export interface IRocketComponent<
  // original component props
  // eslint-disable-next-line @typescript-eslint/ban-types
  OA extends TObj = {},
  // extended component props
  // eslint-disable-next-line @typescript-eslint/ban-types
  EA extends TObj = {},
  // theme
  T extends TObj = {},
  // custom style properties
  CSS extends TObj = {},
  // statics
  S extends TObj = {},
  // hocs
  HOC extends TObj = {},
  // dimensions
  D extends Dimensions = Dimensions,
  // use booleans
  UB extends boolean = boolean,
  // dimension key props
  DKP extends TDKP = TDKP,
  // calculated final props
  DFP = MergeTypes<[OA, EA, DefaultProps, ExtractDimensionProps<D, DKP, UB>]>
> extends ForwardRefExoticComponent<DFP> {
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
  }: ConfigAttrs<NC, DKP, UB>) => NC extends ElementType
    ? RocketComponent<ExtractProps<NC>, EA, T, CSS, S, HOC, D, UB, DKP>
    : RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  // ATTRS chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define default component props
   * @param param  Can be either _object_ or a _callback_
   *
   * #### Examples
   *
   * ##### Object as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.attrs({
   *  propA: 'value',
   *  propB: 'value,
   * })
   * ```
   *
   * ##### Callback as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.attrs((props, theme, helpers) => ({
   * propA: props.disabled ? 'valueA' : 'valueB',
   * propB: 'value,
   *  }))
   *  ```
   */
  attrs: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[DFP, P]>> | AttrsCb<MergeTypes<[DFP, P]>, Theme<T>>
      : Partial<DFP> | AttrsCb<DFP, Theme<T>>
  ) => P extends TObj
    ? RocketComponent<OA, MergeTypes<[EA, P]>, T, CSS, S, HOC, D, UB, DKP>
    : RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  // THEME chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define default component theme
   * @param param  Can be either _object_ or a _callback_
   *
   * #### Examples
   *
   * ##### Object as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.attrs({
   *  backgroundColor: 'black',
   * })
   * ```
   *
   * ##### Callback as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.theme((theme, css) => ({
   * backgroundColor: t.color.black, // value from context
   *  }))
   *  ```
   */
  theme: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ?
          | Partial<MergeTypes<[Styles<CSS>, P]>>
          | ThemeCb<MergeTypes<[Styles<CSS>, P]>, Theme<T>>
      : Partial<Styles<CSS>> | ThemeCb<Styles<CSS>, Theme<T>>
  ) => P extends TObj
    ? RocketComponent<OA, EA, T, MergeTypes<[CSS, P]>, S, HOC, D, UB, DKP>
    : RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  // STYLES chaining method
  // --------------------------------------------------------
  styles: (
    param: StylesCb
  ) => RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  // COMPOSE chaining method
  // --------------------------------------------------------
  compose: <P extends ComposeParam>(
    param: P
  ) => P extends TObj
    ? RocketComponent<OA, EA, T, CSS, S, MergeTypes<[HOC, P]>, D, UB, DKP>
    : RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  // STATICS chaining method + its output + other statics
  // --------------------------------------------------------
  statics: <P extends TObj>(
    param: P
  ) => P extends TObj
    ? RocketComponent<OA, EA, T, CSS, MergeTypes<[S, P]>, HOC, D, UB, DKP>
    : RocketComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  is: S

  getStaticDimensions: (theme: TObj) => {
    dimensions: TObj
    useBooleans: UB
    multiKeys: TObj
  }

  getDefaultAttrs: (props: TObj, theme: TObj, mode: ThemeModeKeys) => TObj

  readonly $$rocketstyle: ExtractDimensions<D, DKP>
  readonly $$originProps: OA
  readonly $$extendedProps: EA
  readonly $$allProps: DFP
  readonly IS_ROCKETSTYLE: true
  readonly displayName: string
}
