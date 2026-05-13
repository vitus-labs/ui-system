import type { ComponentType, FC } from 'react'

export type TObj = Record<string, unknown>
export type TFn = (...args: any) => any
export type CallBackParam = TObj | TFn
export type DisplayName = string

export type ElementType<T extends TObj | unknown = any> = ComponentType<T> &
  Partial<{ [key: string]: any }>

export type ValueOf<T> = T[keyof T]

export type ArrayOfValues<T> = T[keyof T][]

export type ArrayOfKeys<T> = Array<keyof T>

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

// ─── MergeTypes ───────────────────────────────────────────────
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type IsAny<T> = 0 extends 1 & T ? true : false

type ExtractNullableKeys<T> = {
  [P in keyof T as IsAny<T[P]> extends true
    ? P
    : [T[P]] extends [never]
      ? never
      : [T[P]] extends [null | undefined]
        ? never
        : P]: T[P]
}

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

// ─── ExtractProps ─────────────────────────────────────────────
// Extracts the prop type from a component-or-type input. For components
// with multiple call overloads (e.g. `Iterator` / `List` from
// `@vitus-labs/elements` after PR #199), the union of every overload's
// first-param type is returned so the wrapper's JSX call site can match
// any of them — preserving the per-mode narrowing that #199 introduced
// (e.g. `valueName` forbidden on object arrays) instead of collapsing
// to the last overload alone.
//
// Inference order: 4-overload, 3-overload, 2-overload, single-callable
// fallback (ComponentType<TProps>). The fallback path matches today's
// behaviour for non-overloaded components — no behaviour change there.
// Trade-off: generic type parameters in overloads are substituted with
// their upper bound (so `<T extends ObjectValue>(props: ObjectProps<T>)`
// extracts as `ObjectProps<ObjectValue>`, not `ObjectProps<T>` — TS
// can't re-export the generic). Direct call sites against the original
// component keep per-T narrowing intact; only the wrapped surface loses
// it inside `itemProps` callbacks. Acceptable trade-off because per-mode
// rejection (the actually-load-bearing part of #199) still fires.
export type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends {
  (props: infer P1, ...args: any): any
  (props: infer P2, ...args: any): any
  (props: infer P3, ...args: any): any
  (props: infer P4, ...args: any): any
}
  ? P1 | P2 | P3 | P4
  : TComponentOrTProps extends {
        (props: infer P1, ...args: any): any
        (props: infer P2, ...args: any): any
        (props: infer P3, ...args: any): any
      }
    ? P1 | P2 | P3
    : TComponentOrTProps extends {
          (props: infer P1, ...args: any): any
          (props: infer P2, ...args: any): any
        }
      ? P1 | P2
      : TComponentOrTProps extends ComponentType<infer TProps>
        ? TProps
        : TComponentOrTProps
