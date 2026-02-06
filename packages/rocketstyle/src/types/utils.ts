import type { ComponentType, FC, ForwardRefExoticComponent } from 'react'

export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any
export type CallBackParam = TObj | TFn
export type DisplayName = string

export type ElementType<T extends TObj | unknown = any> =
  | (ComponentType<T> & Partial<{ [key: string]: any }>)
  | (ForwardRefExoticComponent<T> & { [key: string]: any })

export type ValueOf<T> = T[keyof T]

export type ArrayOfValues<T> = Array<T[keyof T]>

export type ArrayOfKeys<T> = Array<keyof T>

export type SimpleHoc<P extends Record<string, unknown> = {}> = <
  T extends ComponentType<any>,
>(
  WrappedComponent: T,
) => FC<MergeTypes<[P, ExtractProps<T>]>>

type IsFalseOrNullable<T> = T extends null | undefined | false ? never : true
export type NullableKeys<T> = { [K in keyof T]: IsFalseOrNullable<T[K]> }

type ExtractNullableKeys<T> = {
  [P in keyof T as T[P] extends null | never | undefined ? never : P]: T[P]
}

// merge types
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & R>

export type Spread<A extends readonly [...any]> = A extends [
  infer L,
  ...infer R,
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
