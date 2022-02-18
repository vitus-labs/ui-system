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
} from './dimensions'
import type { StylesCb, Styles } from './styles'
import type { ConfigAttrs } from './config'
import type { AttrsCb } from './attrs'
import type { Theme, ThemeCb, ThemeModeKeys } from './theme'
import type { GenericHoc } from './hoc'
import type { DefaultProps } from './configuration'

export type RocketComponent<
  // attrs
  A extends TObj = DefaultProps,
  // original component props
  OA extends TObj = {},
  // extended component props
  EA extends TObj = {},
  // theme
  T extends TObj = {},
  // custom theme properties
  CSS extends TObj = {},
  // dimensions
  D extends Dimensions = Dimensions,
  // use booleans
  UB extends boolean = boolean,
  // dimension key props
  DKP extends TDKP = TDKP
> = IRocketComponent<A, OA, EA, T, CSS, D, UB, DKP> & {
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
        MergeTypes<
          [OA, EA, ExtractDimensionProps<D, DimensionProps<K, D, P, DKP>, UB>]
        >,
        OA,
        EA,
        T,
        CSS,
        D,
        UB,
        DimensionProps<K, D, P, DKP>
      >
    : RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>
}

/**
 * @param A    Generic _props_ params.
 * @param OA   Origin component props params.
 * @param T    Theme passed via context.
 * @param CT   Custom theme accepted by styles.
 * @param D    Dimensions to be used for defining component states.
 * @param UB   Use booleans value
 * @param DKP  Dimensions key props.
 */
export interface IRocketComponent<
  // attrs
  A extends TObj = DefaultProps,
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
  // dimensions
  D extends Dimensions = Dimensions,
  // use booleans
  UB extends boolean = boolean,
  // dimension key props
  DKP extends TDKP = TDKP
> extends ForwardRefExoticComponent<
    MergeTypes<[OA, EA, DefaultProps, ExtractDimensionProps<D, DKP, UB>]>
  > {
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
    ? RocketComponent<
        MergeTypes<
          [ExtractProps<NC>, DefaultProps, ExtractDimensionProps<D, DKP, UB>]
        >,
        ExtractProps<NC>,
        EA,
        T,
        CSS,
        D,
        UB,
        DKP
      >
    : RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>

  // ATTRS chaining method
  // --------------------------------------------------------
  /**
   * @param A    Generic _props_ params.
   * @param OA   Origin component props params.
   * @param T    Theme passed via context.
   * @param CSS  Custom styles accepted by styles.
   * @param D    Dimensions to be used for defining component states.
   * @param UB   Use booleans value
   * @param DKP  Dimensions key props.
   */
  attrs: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[A, P]>> | AttrsCb<MergeTypes<[A, P]>, Theme<T>>
      : Partial<A> | AttrsCb<A, Theme<T>>
  ) => P extends TObj
    ? RocketComponent<
        MergeTypes<[OA, EA, P, ExtractDimensionProps<D, DKP, UB>]>,
        OA,
        MergeTypes<[EA, P]>,
        T,
        CSS,
        D,
        UB,
        DKP
      >
    : RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>

  // THEME chaining method
  // --------------------------------------------------------
  theme: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ?
          | Partial<MergeTypes<[Styles<CSS>, P]>>
          | ThemeCb<MergeTypes<[Styles<CSS>, P]>, Theme<T>>
      : Partial<Styles<CSS>> | ThemeCb<Styles<CSS>, Theme<T>>
  ) => P extends TObj
    ? RocketComponent<A, OA, EA, T, MergeTypes<[CSS, P]>, D, UB, DKP>
    : RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>

  // STYLES chaining method
  // --------------------------------------------------------
  styles: (param: StylesCb) => RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>

  // COMPOSE chaining method
  // --------------------------------------------------------
  compose: (
    param: Record<string, GenericHoc | null | undefined | false>
  ) => RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>

  // STATICS chaining method + its output + other statics
  // --------------------------------------------------------
  statics: (
    param: Record<string, any>
  ) => RocketComponent<A, OA, EA, T, CSS, D, UB, DKP>

  is: Record<string, any>

  getStaticDimensions: (theme: TObj) => {
    dimensions: TObj
    useBooleans: boolean
    multiKeys: TObj
  }

  getDefaultAttrs: (props: TObj, theme: TObj, mode: ThemeModeKeys) => TObj

  readonly $$rocketstyle: DKP
  readonly IS_ROCKETSTYLE: true
  readonly displayName: string
  // name: never
  // length: never
  // arguments: never
  // defaultProps: never
}
