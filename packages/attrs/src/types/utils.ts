import type { ComponentType, ForwardRefExoticComponent, FC } from 'react'
import type { ExtractProps, MergeTypes } from '@vitus-labs/tools-types'

export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any
export type CallBackParam = TObj | TFn
export type DisplayName = string

export type ElementType<T extends TObj | unknown = any> =
  | (ComponentType<T> & Partial<Record<string, any>>)
  | (ForwardRefExoticComponent<T> & Partial<Record<string, any>>)

export type ValueOf<T> = T[keyof T]

export type ArrayOfValues<T> = T[keyof T]

export type ArrayOfKeys<T> = keyof T[]

export type SimpleHoc<P extends Record<string, unknown> = {}> = <
  T extends ComponentType<any>,
>(
  WrappedComponent: T,
) => FC<MergeTypes<[P, ExtractProps<T>]>>

type IsFalseOrNullable<T> = T extends null | undefined | false ? never : true
export type NullableKeys<T> = { [K in keyof T]: IsFalseOrNullable<T[K]> }

export type ReturnCbParam<P extends TFn | TObj> = P extends TFn
  ? ReturnType<P>
  : P
