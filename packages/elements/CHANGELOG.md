# @vitus-labs/elements

## 2.6.1

## 2.6.0

### Minor Changes

- [#229](https://github.com/vitus-labs/ui-system/pull/229) [`e2117c6`](https://github.com/vitus-labs/ui-system/commit/e2117c6fece6e0c70e1095c9b2c0897c0070343f) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Add a `LooseProps` fallback overload to `IteratorComponent` and `ListComponent`.

  **What changed**

  Iterator and List previously declared three call signatures (Simple, Object, Children). After 2.5.0 fixed the iterator-prop types for forwarding, one residual remained: `(typeof Wrapper)['$$types']['data']` — derived via rocketstyle's 4-overload-aware `ExtractProps` — is a wide union of every overload's `data`. Passing it back into `<List data={…}>` had no overload to bind to:

  - Simple wants `SimpleValue[]` — union too wide.
  - Object wants `ObjectValue[]` — union too wide.
  - Children doesn't take `data` and requires `children` — fails.

  A fourth `(props: LooseProps & extras) => ReactNode` overload gives the wide union a binding home. The narrow overloads still drive per-mode T-inference for direct callers; the loose fallback only matches when nothing narrower does.

  **Result**

  ```ts
  type Props = { list?: (typeof MyList)["$$types"]["data"] };
  const Component = ({ list }: Props) => <List data={list} component={Item} />;
  //                                            ^^^^^^^^^^
  // Pre-fix: no overload matches the wide union.
  // Post-fix: binds to LooseProps overload, compiles cleanly.
  ```

  **Trade-off**

  Heterogeneous arrays like `(string | User)[]` now compile (was rejected). Runtime handles per-item dispatch — the type-side fallback exists so forwarding round-trips work. If you want to reject mixed arrays, narrow your `data` type before passing it.

  **Why Option B (overload addition) over Option A (`children?` on ChildrenProps)**

  Option A would have made `<List />` (no data, no component, no children) type-allowed — that's a meaningful loss of "you must do something" enforcement. The added overload preserves Children's `children: ReactNode` requirement and only widens for legitimately-wide inputs.

## 2.5.0

### Minor Changes

- [#227](https://github.com/vitus-labs/ui-system/pull/227) [`4114383`](https://github.com/vitus-labs/ui-system/commit/4114383abde75ce242fe38e2f08a67f17e567733) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Relax `Iterator` / `List` iterator-prop types to support prop-forwarding patterns.

  **What changed**

  The per-mode discriminators on `SimpleProps` / `ObjectProps` / `ChildrenProps` previously used `?: never` markers to mutually exclude props across branches (PR [#199](https://github.com/vitus-labs/ui-system/issues/199)). Those markers broke any pattern that derives a `Props` type from a wrapper and forwards back to JSX:

  ```ts
  type Props = Partial<(typeof MyList)["$$types"]>;
  const Component: FC<Props> = (props) => <MyList {...props} data={contacts} />;
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

## 2.4.0

## 2.3.0

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

## 2.2.0

### Minor Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Generic `Props<T>` on `Iterator` and `List` with discriminated branches — `T` is inferred at the JSX call site from the `data` array. Primitive arrays get `SimpleProps<T>` (`valueName` required), object arrays get `ObjectProps<T>` (`valueName` forbidden, `itemKey` typed against `keyof T`), no-data calls get `ChildrenProps`, and unparameterized callers fall back to the previous loose shape (`LooseProps`) for back-compat. Existing code keeps type-checking; new code gains stricter inference automatically.

### Patch Changes

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
