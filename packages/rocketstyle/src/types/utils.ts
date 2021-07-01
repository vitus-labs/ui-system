/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ForwardRefExoticComponent, VFC } from 'react'

export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any
export type CallBackParam = TObj | TFn
export type DisplayName = string

export type ElementType<T extends TObj | unknown = any> =
  | ComponentType<T>
  | ForwardRefExoticComponent<T>

export type ValueOf<T> = T[keyof T]

export type ArrayOfValues<T> = Array<T[keyof T]>

export type ArrayOfKeys<T> = Array<keyof T>

// eslint-disable-next-line @typescript-eslint/ban-types
export type SimpleHoc<P extends Record<string, unknown> = {}> = <
  T extends ComponentType<any>
>(
  WrappedComponent: T
) => VFC<MergeTypes<[P, ExtractProps<T>]>>

type IsFalseOrNullable<T> = T extends null | undefined | false ? never : true
export type NullableKeys<T> = { [K in keyof T]: IsFalseOrNullable<T[K]> }

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

export type Spread<A extends readonly [...any]> = A extends [
  infer L,
  ...infer R
]
  ? SpreadTwo<L, Spread<R>>
  : unknown

export type MergeTypes<A extends readonly [...any]> = ExtractNullableKeys<
  Spread<A>
>

// extract props fron component
export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ElementType<infer TProps>
    ? TProps
    : TComponentOrTProps

export type ReturnCbParam<P extends TFn | TObj> = P extends TFn
  ? ReturnType<P>
  : P
