import type { ForwardRefExoticComponent } from 'react'
import { TObj, ElementType, MergeTypes, ExtractProps } from './utils'
import {
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DKPTypes,
} from './dimensions'
import { StylesCb } from './styles'
import { ConfigAttrs } from './config'
import { AttrsCb } from './attrs'
import { ThemeCb } from './theme'
import { GenericHoc } from './hoc'
import { DefaultProps } from './configuration'

// --------------------------------------------------------
// rocketstyle data object
// --------------------------------------------------------

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
  // eslint-disable-next-line @typescript-eslint/ban-types
  OA extends TObj = {},
  // extended component props
  // eslint-disable-next-line @typescript-eslint/ban-types
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
  $$rocketstyle: DKP

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
  }: ConfigAttrs<NC, DKP>) => NC extends ElementType
    ? RocketComponent<
        MergeTypes<
          [ExtractProps<NC>, DefaultProps, ExtractDimensionProps<D, DKP, UB>]
        >,
        ExtractProps<NC>,
        EA,
        T,
        CT,
        D,
        UB,
        DKP
      >
    : RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[A, P]>> | AttrsCb<MergeTypes<[A, P]>, T>
      : Partial<A> | AttrsCb<A, T>
  ) => P extends TObj
    ? RocketComponent<
        MergeTypes<[OA, EA, P, ExtractDimensionProps<D, DKP, UB>]>,
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
  theme: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[CT, P]>> | ThemeCb<MergeTypes<[CT, P]>, T>
      : Partial<CT> | ThemeCb<CT, T>
  ) => P extends TObj
    ? RocketComponent<A, OA, EA, T, MergeTypes<[CT, P]>, D, UB, DKP>
    : RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // STYLES chaining method
  // --------------------------------------------------------
  styles: (param: StylesCb) => RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // COMPOSE chaining method
  // --------------------------------------------------------
  compose: (
    param: Record<string, GenericHoc | null | undefined | false>
  ) => RocketComponent<A, OA, EA, T, CT, D, UB, DKP>

  // Dynamic dimensions chaining method (set dynamically from configuration)
  // --------------------------------------------------------
} & {
    [I in keyof D]: <
      K extends DimensionValue = D[I],
      P extends DimensionCallbackParam<T, CT> = DimensionCallbackParam<T, CT>
    >(
      param: P
    ) => P extends DimensionCallbackParam<T, CT>
      ? RocketComponent<
          MergeTypes<
            [OA, EA, ExtractDimensionProps<D, DKPTypes<K, D, P, DKP>, UB>]
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
