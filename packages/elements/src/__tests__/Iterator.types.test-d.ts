/**
 * Type-level smoke tests for Iterator/List generic Props<T> inference.
 *
 * These don't run at test time — `expectTypeOf` resolves at compile time,
 * so the act of `bun run typecheck` succeeding IS the test passing. A
 * regression in the inference shape would fail the gate.
 */
import { expectTypeOf } from 'vitest'
import type {
  ChildrenProps,
  LooseProps,
  ObjectProps,
  Props,
  SimpleProps,
} from '~/helpers/Iterator'
import type { Props as ListProps } from '~/List'

type User = { id: number; name: string }

// ---------------------------------------------------------------------------
// Branch resolution: Props<T> picks the right shape per T
// ---------------------------------------------------------------------------

// Primitive arrays → SimpleProps
expectTypeOf<Props<string>>().toEqualTypeOf<SimpleProps<string>>()
expectTypeOf<Props<number>>().toEqualTypeOf<SimpleProps<number>>()

// Object arrays → ObjectProps
expectTypeOf<Props<User>>().toEqualTypeOf<ObjectProps<User>>()

// No T (or unknown) → LooseProps (back-compat surface)
expectTypeOf<Props>().toEqualTypeOf<LooseProps>()
expectTypeOf<Props<unknown>>().toEqualTypeOf<LooseProps>()

// ---------------------------------------------------------------------------
// Simple branch
// ---------------------------------------------------------------------------

type Simple = Props<string>
expectTypeOf<Simple['valueName']>().toEqualTypeOf<string | undefined>()
expectTypeOf<Simple['data']>().toEqualTypeOf<Array<string | undefined | null>>()

// ---------------------------------------------------------------------------
// Object branch
//
// After dropping `?: never` markers for forwarding compatibility:
//   - valueName is accepted as `string | undefined` even on object branch
//     (was: `undefined` only). Runtime ignores it but TS no longer rejects.
//   - itemKey still narrows to `keyof T | (item, idx) => SimpleValue` on
//     direct callers — wrappers (via ExtractProps) substitute T with its
//     upper bound and lose this narrowing.
// ---------------------------------------------------------------------------

type Obj = Props<User>
expectTypeOf<Obj['valueName']>().toEqualTypeOf<string | undefined>()

type ObjKey = NonNullable<Obj['itemKey']>
expectTypeOf<keyof User>().toMatchTypeOf<ObjKey>()

// ---------------------------------------------------------------------------
// Children branch
//
// Only `children` is required on this branch. Other props (data,
// component, valueName, itemKey) are optional and accepted at the type
// level for forwarding compatibility — the runtime ignores them when
// children is the active discriminator.
// ---------------------------------------------------------------------------

expectTypeOf<ChildrenProps['children']>().not.toBeNever()

// ---------------------------------------------------------------------------
// List propagates T identically to Iterator + adds Element prop surface
// ---------------------------------------------------------------------------

// List<string> mirrors Iterator's SimpleProps shape (with extras)
type ListSimple = ListProps<string>
expectTypeOf<ListSimple['valueName']>().toEqualTypeOf<string | undefined>()
expectTypeOf<ListSimple['data']>().toEqualTypeOf<
  Array<string | undefined | null>
>()
// Element-prop surface is forwarded — `tag` / `direction` accepted
expectTypeOf<ListSimple['tag']>().not.toBeNever()
expectTypeOf<ListSimple['direction']>().not.toBeNever()
// List-only toggle
expectTypeOf<ListSimple['rootElement']>().toEqualTypeOf<boolean | undefined>()

// List<User> mirrors Iterator's ObjectProps — itemKey accepts `keyof T`,
// valueName is `string | undefined` (no longer rejected via `?: never`).
type ListObj = ListProps<User>
expectTypeOf<ListObj['valueName']>().toEqualTypeOf<string | undefined>()

type ListObjKey = NonNullable<ListObj['itemKey']>
expectTypeOf<keyof User>().toMatchTypeOf<ListObjKey>()

// List with no T defaults to the loose surface (today's behavior — non-breaking).
// tag from Element-prop surface and rootElement remain accessible.
type ListLoose = ListProps
expectTypeOf<ListLoose['tag']>().not.toBeNever()
expectTypeOf<ListLoose['rootElement']>().toEqualTypeOf<boolean | undefined>()
