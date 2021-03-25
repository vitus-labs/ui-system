import {
  CallBackParam,
  Spread,
  TObj,
  NullableKeys,
  ValueOf,
  ReturnCbParam,
} from './utils'
import { ThemeMode } from './theme'
import { Css } from './styles'

export type ExtractNullableDimensionKeys<T> = {
  [P in keyof T as T[P] extends false ? never : P]: T[P]
}

export type ExtractDimensionKey<
  T extends DimensionValue
> = T extends DimensionValueObj ? T['propName'] : T

export type ExtractDimensionMulti<
  T extends DimensionValue
> = T extends DimensionValueObj ? true : false

export type ExtractDimensionAttrsKeys<D extends Dimensions> = {
  [I in keyof D]: ExtractDimensionKey<D[I]>
}[keyof D]

export type DimensionValuePrimitive = string
export type DimensionValueObj = {
  propName: string
  multi?: boolean
}

export type DimensionValue = DimensionValuePrimitive | DimensionValueObj
export type Dimensions = Record<string, DimensionValue>

export type MultiKeys<T extends Dimensions = Dimensions> = Partial<
  Record<ExtractDimensionKey<T[keyof T]>, true>
>

export type DimensionResult<CT> = Record<string, boolean | null | Partial<CT>>
export type DimensionObj<CT> = DimensionResult<CT>

export type DimensionCb<T, CT> = (
  theme: T,
  mode: ThemeMode,
  css: Css
) => DimensionResult<CT>

export type DimensionCallbackParam<T, CT> =
  | DimensionObj<CT>
  | DimensionCb<T, CT>

export type DimensionReturn<P, A> = P extends TObj ? A & P : A

export type TDKP = Record<
  ExtractDimensionKey<Dimensions[keyof Dimensions]>,
  Record<string, boolean | never | Record<string, boolean>> | unknown
>

export type DimensionProps<
  K extends DimensionValue,
  D extends Dimensions,
  P extends CallBackParam,
  DKP extends TDKP
> = {
  [I in ExtractDimensionKey<D[keyof D]>]: I extends ExtractDimensionKey<K>
    ? ExtractNullableDimensionKeys<
        Spread<[DKP[I], NullableKeys<ReturnCbParam<P>>]>
      >
    : DKP[I]
}

type DimensionTypesHelper<DKP extends TDKP> = {
  [I in keyof DKP]: keyof DKP[I]
}

export type DimensionObjAttrs<D extends Dimensions, DKP extends TDKP> = {
  [I in keyof DKP]: ExtractDimensionMulti<D[I]> extends true
    ? Array<keyof DKP[I]>
    : keyof DKP[I]
}

export type DimensionBooleanAttrs<DKP extends TDKP> = Partial<
  Record<ValueOf<DimensionTypesHelper<DKP>>, boolean>
>

export type ExtractDimensionProps<
  D extends Dimensions,
  DKP extends TDKP,
  UB extends boolean
> = UB extends true
  ? Partial<
      ExtractNullableDimensionKeys<
        DimensionObjAttrs<D, DKP> & DimensionBooleanAttrs<DKP>
      >
    >
  : Partial<ExtractNullableDimensionKeys<DimensionObjAttrs<D, DKP>>>
