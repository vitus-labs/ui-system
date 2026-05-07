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
// Simple branch: valueName is OPTIONAL (defaults to 'children' at runtime)
// ---------------------------------------------------------------------------

type Simple = Props<string>
expectTypeOf<Simple['valueName']>().toEqualTypeOf<string | undefined>()
expectTypeOf<Simple['data']>().toEqualTypeOf<Array<string | undefined | null>>()

// itemProps callback arg is { [valueName]: T }
type SimpleItemProps = NonNullable<SimpleProps<string>['itemProps']>
type SimpleItemPropsFn = Extract<SimpleItemProps, (...a: any[]) => any>
expectTypeOf<Parameters<SimpleItemPropsFn>[0]>().toEqualTypeOf<{
  [k: string]: string
}>()

// ---------------------------------------------------------------------------
// Object branch: valueName forbidden, itemKey accepts `keyof T`
// ---------------------------------------------------------------------------

type Obj = Props<User>
expectTypeOf<Obj['valueName']>().toEqualTypeOf<undefined>()

type ObjKey = NonNullable<Obj['itemKey']>
expectTypeOf<keyof User>().toMatchTypeOf<ObjKey>()

// itemProps callback arg is the full T
type ObjItemProps = NonNullable<ObjectProps<User>['itemProps']>
type ObjItemPropsFn = Extract<ObjItemProps, (...a: any[]) => any>
expectTypeOf<Parameters<ObjItemPropsFn>[0]>().toEqualTypeOf<User>()

// ---------------------------------------------------------------------------
// Children branch: data/component/valueName/itemKey are all forbidden
// ---------------------------------------------------------------------------

expectTypeOf<ChildrenProps['data']>().toEqualTypeOf<undefined>()
expectTypeOf<ChildrenProps['component']>().toEqualTypeOf<undefined>()
expectTypeOf<ChildrenProps['valueName']>().toEqualTypeOf<undefined>()
expectTypeOf<ChildrenProps['itemKey']>().toEqualTypeOf<undefined>()

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

// List<User> mirrors Iterator's ObjectProps — valueName forbidden, itemKey
// accepts `keyof T`, itemProps callback receives the full T.
// (`MergeTypes` strips never-typed keys, so we check via `keyof` rather
// than indexed access for the forbidden case.)
type ListObj = ListProps<User>
type ListObjHasValueName = 'valueName' extends keyof ListObj ? true : false
expectTypeOf<ListObjHasValueName>().toEqualTypeOf<false>()

type ListObjKey = NonNullable<ListObj['itemKey']>
expectTypeOf<keyof User>().toMatchTypeOf<ListObjKey>()

type ListObjItemProps = NonNullable<ListObj['itemProps']>
type ListObjItemPropsFn = Extract<ListObjItemProps, (...a: any[]) => any>
expectTypeOf<Parameters<ListObjItemPropsFn>[0]>().toEqualTypeOf<User>()

// List with no T defaults to the loose surface (today's behavior — non-breaking).
// tag from Element-prop surface and rootElement remain accessible.
type ListLoose = ListProps
expectTypeOf<ListLoose['tag']>().not.toBeNever()
expectTypeOf<ListLoose['rootElement']>().toEqualTypeOf<boolean | undefined>()
