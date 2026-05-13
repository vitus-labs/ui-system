---
'@vitus-labs/elements': minor
---

Relax `Iterator` / `List` iterator-prop types to support prop-forwarding patterns.

**What changed**

The per-mode discriminators on `SimpleProps` / `ObjectProps` / `ChildrenProps` previously used `?: never` markers to mutually exclude props across branches (PR #199). Those markers broke any pattern that derives a `Props` type from a wrapper and forwards back to JSX:

```ts
type Props = Partial<(typeof MyList)['$$types']>
const Component: FC<Props> = (props) => <MyList {...props} data={contacts} />
//                                              ^^^^^^^^^^
// TS errors: spread's `valueName: string | undefined` doesn't fit
// ObjectProps's `valueName?: never` slot, because `Partial<union>`
// merges branches' values and the `string` from SimpleProps leaks
// through into the spread.
```

The `?: never` markers are dropped. `valueName`, `children`, `data`, `component`, `itemKey`, `itemProps`, `wrapProps` now share compatible signatures across all three branches:

- `valueName?: string` on every branch (was: `?: never` on Object/Children).
- `children?: ReactNode` on Simple/Object (was: `?: never`).
- `data?: Array<…>`, `component?: ElementType` on Children (was: `?: never`).
- `itemKey` / `itemProps` / `wrapProps` unify on a loose `LooseItem = SimpleValue | ObjectValue | Record<string, SimpleValue>` callback param. Object branch keeps `keyof T` narrowing on `itemKey` for direct callers.

**Trade-off (what's lost)**

Direct call-site discrimination:

- `<List data={users} valueName="x" />` no longer errors (was: rejected because `valueName` is meaningless on object iteration). Runtime still ignores valueName for object arrays; the call is type-safe but semantically a no-op.
- `<List data={users}>{kids}</List>` no longer errors (was: rejected because data + children mode-mix). Runtime still picks data-iteration.
- Per-`T` narrowing inside `itemProps` / `wrapProps` callbacks goes away (item is `LooseItem`, not `User`). Direct callers add an explicit annotation if they need concrete-T access: `itemProps={(item: User) => …}`.

What's kept:

- Discrimination via `data`'s element type (Simple vs Object) still applies — overload resolution picks the right branch.
- ChildrenProps's `children: ReactNode` (required) still differentiates the children mode at call sites that provide it.
- `keyof T` narrowing on `itemKey` for the Object branch (direct callers benefit from key-completion against concrete T).

**Why**

The forwarding pattern is broadly used (every parent component that exposes a wrapped iterator's surface). The discrimination caught a small class of no-op mistakes (`valueName` on object arrays). The cost / benefit favors forwarding.
