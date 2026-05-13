/**
 * Type-level pin for `ExtractProps`. Tracks the contract:
 *
 *  - Components with N (≤4) callable overloads → union of all overload props.
 *  - Components with a single signature → that signature's props (today's
 *    behaviour, unchanged).
 *  - Plain object types → returned as-is (today's behaviour, unchanged).
 *
 * The contract matters because `RocketStyleComponent`'s `OA` generic is
 * `ExtractProps<C>` (rocketComponent.ts:14) — if this widens or narrows
 * unexpectedly, every wrapped component's JSX surface shifts.
 */
import type { ReactNode } from 'react'
import { expectTypeOf } from 'vitest'
import type { ExtractProps } from '~/types/utils'

// ─── Single-signature component (today's behaviour) ──────────────────
type Simple = (props: { foo: string }) => ReactNode

expectTypeOf<ExtractProps<Simple>>().toEqualTypeOf<{ foo: string }>()

// ─── Plain object (passes through) ───────────────────────────────────
type PlainObj = { bar: number }

expectTypeOf<ExtractProps<PlainObj>>().toEqualTypeOf<PlainObj>()

// ─── 2-overload component ────────────────────────────────────────────
interface TwoOverload {
  (props: { mode: 'a'; data: string }): ReactNode
  (props: { mode: 'b'; data: number }): ReactNode
}

type TwoExtracted = ExtractProps<TwoOverload>
// Union — both overload param types accessible.
expectTypeOf<{ mode: 'a'; data: string }>().toMatchTypeOf<TwoExtracted>()
expectTypeOf<{ mode: 'b'; data: number }>().toMatchTypeOf<TwoExtracted>()

// ─── 3-overload component (Iterator / List shape) ────────────────────
interface ThreeOverload {
  <T extends string | number>(props: { mode: 'simple'; data: T[] }): ReactNode
  <T extends object>(props: { mode: 'object'; data: T[] }): ReactNode
  (props: { mode: 'children'; children: ReactNode }): ReactNode
}

type ThreeExtracted = ExtractProps<ThreeOverload>
// All three branches must be assignable into the extracted union.
expectTypeOf<{
  mode: 'simple'
  data: (string | number)[]
}>().toMatchTypeOf<ThreeExtracted>()
expectTypeOf<{
  mode: 'object'
  data: object[]
}>().toMatchTypeOf<ThreeExtracted>()
expectTypeOf<{
  mode: 'children'
  children: ReactNode
}>().toMatchTypeOf<ThreeExtracted>()

// ─── Mixed: overloads + static properties (List's actual shape) ──────
interface OverloadedWithStatics {
  (props: { kind: 'a' }): ReactNode
  (props: { kind: 'b' }): ReactNode
  displayName?: string
  isMarker: true
}

type MixedExtracted = ExtractProps<OverloadedWithStatics>
// Statics don't show up — only the call signatures' params.
expectTypeOf<{ kind: 'a' }>().toMatchTypeOf<MixedExtracted>()
expectTypeOf<{ kind: 'b' }>().toMatchTypeOf<MixedExtracted>()
