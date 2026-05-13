# @vitus-labs/rocketstyle

## 2.3.0

### Minor Changes

- [#222](https://github.com/vitus-labs/ui-system/pull/222) [`5ec636e`](https://github.com/vitus-labs/ui-system/commit/5ec636e0a10eff4c72e414fe22a4ceb8e7ae0e05) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Preserve per-mode narrowing on overloaded components through `rocketstyle()` wrapping.

  PR [#199](https://github.com/vitus-labs/ui-system/issues/199) made `Iterator` and `List` overloaded interfaces so direct call sites get strict per-mode discrimination (e.g. `<List data={users} valueName="x" />` is rejected because `valueName?: never` on the object-array branch). Wrapping with `rocketstyle()({ component: List })` lost that — `ExtractProps<C>` picked the last overload, so the wrapper exposed only `ChildrenProps` and every iterator-style call errored.

  The fix is two-layered:

  - `ExtractProps` now pattern-matches against 1–4 callable overloads and returns the union of every overload's first-param type. Single-callable and plain-object inputs fall through to the previous behaviour unchanged.
  - `IRocketStyleComponent`'s `DFP` distributes over `OA`'s union branches and intersects each branch raw (not via `MergeTypes`), so `valueName?: never` markers survive — `MergeTypes`' `ExtractNullableKeys` would otherwise strip them.

  Result on wrapped components like `rocketstyle()({ component: List })`:

  - `<StyledList data={users} component={Card} />` — compiles (object-array branch).
  - `<StyledList data={users} valueName="x" component={Card} />` — rejected.
  - `<StyledList data={strings} component={Item} valueName="x" />` — compiles (string-array branch).
  - `<StyledList>{children}</StyledList>` — compiles (children branch).
  - `<StyledList data={strings}>{children}</StyledList>` — rejected (mode mixing).

  Trade-off: per-`T` narrowing inside `itemProps` / `wrapProps` callbacks is lost through the wrap (the callback's `item` argument is the constraint's upper bound, not the consumer's concrete `T`). Direct `<List data={users} itemProps={(u) => …} />` keeps full per-`T` narrowing. Wrapped consumers who need the concrete type in callbacks can annotate explicitly: `itemProps={(item: User) => …}`.

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

## 2.2.0

### Patch Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Two correctness fixes uncovered by the docs audit. Fix `isDark`/`isLight` swap in `getDefaultAttrs` mode helpers (`rocketstyle.tsx:532-533`) — runtime renders were correct via `useTheme`, but the static introspection path used by rocketstories fed `.attrs()` callbacks inverted helpers, so any story whose attrs branched on `helpers.isDark`/`helpers.isLight` showed wrong-mode-sensitive defaults. Tighten `IRocketStories.init` interface from a method (`() => {...}`) to a property literal — the runtime is an object literal, so `stories.init()` typechecked but threw `init is not a function` at runtime; now the type matches runtime. Includes regression tests for both.

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix component-swap leak in `.config({ component })`. When `cloneAndEnhance` swaps the underlying component, the prior `attrs`, `priorityAttrs`, `compose`, and `filterAttrs` chain values were silently carried forward — they were tailored to the previous component's prop shape and could leak invalid props onto the rendered output. Now those chain values reset on component change. Style-side state (themes, dimensions, statics, pseudo) is preserved. Same-component swaps remain a no-op for attrs.

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
