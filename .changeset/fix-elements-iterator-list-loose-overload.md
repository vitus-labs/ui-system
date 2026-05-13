---
'@vitus-labs/elements': minor
---

Add a `LooseProps` fallback overload to `IteratorComponent` and `ListComponent`.

**What changed**

Iterator and List previously declared three call signatures (Simple, Object, Children). After 2.5.0 fixed the iterator-prop types for forwarding, one residual remained: `(typeof Wrapper)['$$types']['data']` — derived via rocketstyle's 4-overload-aware `ExtractProps` — is a wide union of every overload's `data`. Passing it back into `<List data={…}>` had no overload to bind to:

- Simple wants `SimpleValue[]` — union too wide.
- Object wants `ObjectValue[]` — union too wide.
- Children doesn't take `data` and requires `children` — fails.

A fourth `(props: LooseProps & extras) => ReactNode` overload gives the wide union a binding home. The narrow overloads still drive per-mode T-inference for direct callers; the loose fallback only matches when nothing narrower does.

**Result**

```ts
type Props = { list?: (typeof MyList)['$$types']['data'] }
const Component = ({ list }: Props) => <List data={list} component={Item} />
//                                            ^^^^^^^^^^
// Pre-fix: no overload matches the wide union.
// Post-fix: binds to LooseProps overload, compiles cleanly.
```

**Trade-off**

Heterogeneous arrays like `(string | User)[]` now compile (was rejected). Runtime handles per-item dispatch — the type-side fallback exists so forwarding round-trips work. If you want to reject mixed arrays, narrow your `data` type before passing it.

**Why Option B (overload addition) over Option A (`children?` on ChildrenProps)**

Option A would have made `<List />` (no data, no component, no children) type-allowed — that's a meaningful loss of "you must do something" enforcement. The added overload preserves Children's `children: ReactNode` requirement and only widens for legitimately-wide inputs.
