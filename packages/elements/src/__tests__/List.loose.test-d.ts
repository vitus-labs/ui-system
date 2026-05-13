/**
 * Type-level smoke tests for the dual-export pattern that lets List/Iterator
 * be:
 *  1. Strict-narrowing at direct JSX call sites (the #199 design).
 *  2. Wrappable by HOC machinery like rocketstyle (the 2.1.0 back-compat).
 *
 * The two requirements can't coexist in one callable — TS's call-site
 * overload resolution and `infer P` extraction both read from the same
 * callable signature, so a loose fallback that satisfies (2) bleeds into (1)
 * and defeats the narrowing. Solving it requires two type identities over
 * the same runtime component: `List` (strict) and `LooseList` (loose). This
 * file pins the contract for both.
 */
import type { ComponentType } from 'react'
import { expectTypeOf } from 'vitest'
import type { LooseProps as IteratorLooseProps } from '~/helpers/Iterator'
import type ListDefault from '~/List'
import type { LooseList } from '~/List'

// rocketstyle's ExtractProps (verbatim from packages/rocketstyle/src/types/utils.ts)
type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

// ---------------------------------------------------------------------------
// Direct surface (`List`) — strict narrowing preserved
// ---------------------------------------------------------------------------

// The strict default extracts to the last (narrowest) overload — that's the
// existing behaviour we're explicitly NOT changing. The Iterator.jsx-inference
// test-d file pins the call-site narrowing (`<List data={users}
// valueName="x" />` rejected, etc.); this assertion just records that the
// default extraction is still narrow, so callers know they need `LooseList`
// for HOC composition.
type DirectExtract = ExtractProps<typeof ListDefault>

// `LooseProps` (everything optional) is NOT assignable to `DirectExtract`
// because the narrowest overload requires `children`. If this assertion
// flips, something widened the default surface — likely accidental.
type DirectIsLoose = IteratorLooseProps extends DirectExtract ? true : false
expectTypeOf<DirectIsLoose>().toEqualTypeOf<false>()

// ---------------------------------------------------------------------------
// Loose surface (`LooseList`) — wrappable
// ---------------------------------------------------------------------------

type LooseExtract = ExtractProps<typeof LooseList>

// 1. `LooseProps` is assignable to `LooseExtract` (LooseList accepts loose
//    props — the wrapping back-compat path).
const _looseAccepted: LooseExtract = {} as IteratorLooseProps
void _looseAccepted

// 2. `LooseExtract` is assignable to `LooseProps` (LooseList's surface
//    doesn't add hidden required fields beyond the loose set + Element +
//    ref slot).
declare const looseValue: LooseExtract
const _: IteratorLooseProps = looseValue
void _
