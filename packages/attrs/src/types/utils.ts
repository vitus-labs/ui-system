import type { ComponentType, FC, ForwardRefExoticComponent } from 'react'

// ─── Base Types ───────────────────────────────────────────────

export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any
export type CallBackParam = TObj | TFn
export type DisplayName = string

/**
 * A React component type that accepts additional static properties.
 * Supports both class/function components and forwardRef components.
 */
export type ElementType<T extends TObj | unknown = any> =
  | (ComponentType<T> & Partial<Record<string, any>>)
  | (ForwardRefExoticComponent<T> & Partial<Record<string, any>>)

export type ValueOf<T> = T[keyof T]

export type ArrayOfValues<T> = T[keyof T]

export type ArrayOfKeys<T> = keyof T[]

/**
 * A HOC that wraps a component and merges additional props `P`
 * with the wrapped component's own props.
 */
export type SimpleHoc<P extends Record<string, unknown> = {}> = <
  T extends ComponentType<any>,
>(
  WrappedComponent: T,
) => FC<MergeTypes<[P, ExtractProps<T>]>>

/** Maps each key to `never` if the value is null, undefined, or false. */
type IsFalseOrNullable<T> = T extends null | undefined | false ? never : true
export type NullableKeys<T> = { [K in keyof T]: IsFalseOrNullable<T[K]> }

/** Unwraps a callback to its return type, or returns the object as-is. */
export type ReturnCbParam<P extends TFn | TObj> = P extends TFn
  ? ReturnType<P>
  : P

// ─── MergeTypes ───────────────────────────────────────────────
//
// Merges a tuple of object types left-to-right (like Object.assign),
// then strips keys whose values resolved to `never`, `null`, or `undefined`.
//
// Usage: MergeTypes<[BaseProps, ExtendedProps, OverrideProps]>
//
// This is the backbone of the chaining API — each `.attrs<P>()`
// call produces MergeTypes<[PreviousProps, P]> so later definitions
// override earlier ones while preserving the rest.
// ──────────────────────────────────────────────────────────────

/** Forces TypeScript to expand/flatten a type for better IDE display. */
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/**
 * Strips keys whose values are `never`, `null`, or `undefined`.
 * Uses tuple wrapping `[T[P]] extends [never]` to avoid distribution
 * over union types (a bare `T[P] extends never` would incorrectly
 * match union members).
 */
type ExtractNullableKeys<T> = {
  [P in keyof T as [T[P]] extends [never]
    ? never
    : [T[P]] extends [null | undefined]
      ? never
      : P]: T[P]
}

/** Merges two types: keeps all keys from L that don't exist in R, then adds all of R. */
type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & R>

/** Recursively spreads a tuple of types left-to-right. */
type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R]
  ? SpreadTwo<L, Spread<R>>
  : unknown

export type MergeTypes<A extends readonly [...any]> = ExtractNullableKeys<
  Spread<A>
>

// ─── ExtractProps ─────────────────────────────────────────────

/** Extracts the props type from a React component type (class, function, or forwardRef). */
export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps extends ForwardRefExoticComponent<infer TProps>
      ? TProps
      : TComponentOrTProps
