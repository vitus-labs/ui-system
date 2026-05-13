import type { HTMLTags } from '@vitus-labs/core'
import type { ComponentType, ForwardRefExoticComponent, ReactNode } from 'react'

export type MaybeNull = undefined | null
export type TObj = Record<string, unknown>
export type SimpleValue = string | number
export type ObjectValue = Partial<{
  id: SimpleValue
  key: SimpleValue
  itemId: SimpleValue
  component: ElementType
}> &
  Record<string, unknown>

export type ElementType<T extends Record<string, unknown> = any> =
  | ComponentType<T>
  | ForwardRefExoticComponent<T>
  | HTMLTags

export type ExtendedProps = {
  index: number
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  position: number
}

// ---------------------------------------------------------------------------
// Per-mode prop shapes — narrowed via the `T` data-element type
//
// Discriminated by `data`'s element type only — Simple's `T extends
// SimpleValue` vs Object's `T extends ObjectValue`. The remaining slots
// (valueName, itemKey, itemProps, wrapProps, children) share the SAME
// loose signature across all three branches so the branches stay
// structurally compatible — this matters for prop-forwarding patterns
// like `<Wrapper {...props} data={users} />` where `props` comes from a
// derived `Partial<$$types>`. Previously these used `?: never`
// discriminators which broke forwarding (a union of `?: string` and `?:
// never` merges to `string | undefined`, which doesn't fit a `?: never`
// slot on the target branch). The runtime semantics still differ per
// branch (valueName is meaningless on objects, children is ignored when
// data is present), but TS no longer enforces those constraints.
// ---------------------------------------------------------------------------

/** Loose item-callback param — uniformly typed across branches. */
type LooseItem = SimpleValue | ObjectValue | Record<string, SimpleValue>

/**
 * Iterator over an array of strings/numbers. Each item is wrapped in
 * `{ [valueName]: item }` and that object is what callbacks see + what's
 * spread onto the rendered component.
 */
export type SimpleProps<T extends SimpleValue> = {
  data: Array<T | MaybeNull>
  /** A React component to be rendered per item. */
  component: ElementType
  /**
   * Key under which each primitive value is exposed to `component` and
   * callbacks. Defaults to `'children'` at runtime — i.e. the value is
   * passed to the component as its children.
   */
  valueName?: string
  /** Optional wrapper around each item. */
  wrapComponent?: ElementType
  /** Stable key per item — pick a key, or compute it. */
  itemKey?:
    | keyof ObjectValue
    | ((item: LooseItem, index: number) => SimpleValue)
  /** Extra props merged onto the rendered component, optionally per-item. */
  itemProps?: TObj | ((item: LooseItem, ext: ExtendedProps) => TObj)
  /** Extra props merged onto the wrapper, optionally per-item. */
  wrapProps?: TObj | ((item: LooseItem, ext: ExtendedProps) => TObj)
  /** Children are ignored at runtime when `data` is present. */
  children?: ReactNode
}

/**
 * Iterator over an array of objects. Each item is spread onto the rendered
 * component as props. Per-item `component` overrides also work — when an
 * item carries its own `component` field, the wrapper is bypassed.
 *
 * `itemKey` keeps the per-`T` narrowing (`keyof T`) so direct callers
 * benefit from key-completion against the concrete `T`. itemProps /
 * wrapProps share the loose signature for forwarding compatibility.
 */
export type ObjectProps<T extends ObjectValue> = {
  data: Array<T | MaybeNull>
  /** Default React component to be rendered per item (item-level `component` overrides). */
  component: ElementType
  /** `valueName` is meaningless when iterating objects (runtime ignores it). */
  valueName?: string
  /** Optional wrapper around each item. */
  wrapComponent?: ElementType
  /** Stable key per item — pick a key from the item, or compute it. */
  itemKey?: keyof T | ((item: LooseItem, index: number) => SimpleValue)
  /** Extra props merged onto the rendered component, optionally per-item. */
  itemProps?: TObj | ((item: LooseItem, ext: ExtendedProps) => TObj)
  /** Extra props merged onto the wrapper, optionally per-item. */
  wrapProps?: TObj | ((item: LooseItem, ext: ExtendedProps) => TObj)
  /** Children are ignored at runtime when `data` is present. */
  children?: ReactNode
}

/**
 * Iterator over `children` — no `data`/`component` at runtime. Each
 * child gets positional metadata via `itemProps` and an optional
 * `wrapComponent`. data/component/valueName/itemKey are accepted at the
 * type level for forwarding compatibility but ignored at runtime when
 * `children` is the active discriminator.
 */
export type ChildrenProps = {
  children: ReactNode
  data?: Array<SimpleValue | ObjectValue | MaybeNull>
  component?: ElementType
  valueName?: string
  itemKey?:
    | keyof ObjectValue
    | ((item: LooseItem, index: number) => SimpleValue)
  wrapComponent?: ElementType
  itemProps?: TObj | ((item: LooseItem, ext: ExtendedProps) => TObj)
  wrapProps?: TObj | ((item: LooseItem, ext: ExtendedProps) => TObj)
}

// ---------------------------------------------------------------------------
// Loose backward-compatible fallback shape (today's behavior)
//
// Used when callers don't (or can't) parameterize `Props<T>` — keeps the
// existing call surface intact so this refactor lands non-breaking.
// ---------------------------------------------------------------------------

export type PropsCallback =
  | TObj
  | ((
      itemProps:
        | Record<string, never>
        | Record<string, SimpleValue>
        | ObjectValue,
      extendedProps: ExtendedProps,
    ) => TObj)

export type LooseProps = Partial<{
  children: ReactNode
  data: Array<SimpleValue | ObjectValue | MaybeNull>
  component: ElementType
  valueName: string
  wrapComponent: ElementType
  itemProps: PropsCallback
  wrapProps: PropsCallback
  itemKey:
    | keyof ObjectValue
    | ((
        item: SimpleValue | Omit<ObjectValue, 'component'>,
        index: number,
      ) => SimpleValue)
}>

// ---------------------------------------------------------------------------
// Public, generic-aware Props<T>
//
//   Props<string>          → SimpleProps<string>     (valueName REQUIRED)
//   Props<{ id; name }>    → ObjectProps<{...}>      (valueName FORBIDDEN)
//   Props<unknown> / Props → LooseProps              (today's behavior)
//
// `unknown extends T` is the canonical "did the caller actually narrow T?"
// check — true only when T is left as `unknown`, false for any concrete
// narrowing. Fallback to LooseProps preserves existing call sites.
// ---------------------------------------------------------------------------

export type Props<T = unknown> = unknown extends T
  ? LooseProps
  : T extends SimpleValue
    ? SimpleProps<T>
    : T extends ObjectValue
      ? ObjectProps<T>
      : ChildrenProps
