# @vitus-labs/coolgrid

## 2.6.2

### Patch Changes

- [#245](https://github.com/vitus-labs/ui-system/pull/245) [`5540257`](https://github.com/vitus-labs/ui-system/commit/5540257276936fc226be8ee28859d63d0d1f5737) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Two small structural cleanups in `useContext.tsx`. No public API or behavioural changes.

  **Changes**

  1. **Drop the `pickThemeProps` wrapper.** It was a one-line indirection around `pick(props, keywords)` used at a single call site. Inlined the `pick` call and removed the unused `PickThemeProps` exported type (no external consumers — `useContext.tsx` is not re-exported from `index.ts`).
  2. **`getGridContext`: direct property access on `props` for top-level keys.** Callers always pass a plain object (a `pick()` result or a user-supplied literal), so `(props as Obj).columns` is equivalent to `get(props, 'columns')` but skips `get`'s path-parsing + safety-guard loop. The nested theme lookups (`'grid.columns'` / `'coolgrid.columns'`) still go through `get` because they have real nested paths.

  **Verification**

  - 77 coolgrid tests pass (no new tests — the existing suite covers `getGridContext`, `useGridContext`, and the Container/Row/Col consumer paths)
  - 2688 monorepo tests pass
  - `bun run lint`, `bun run typecheck` clean

  **Honest framing**

  Structural cleanup, not a measurable headline perf win. Two `get` calls saved per `getGridContext` invocation (which fires once per Container/Row/Col render), plus one less function call per `useGridContext`. No microbench in-tree, so no claimed delta — the wins are theoretical and compound across deep grid trees but are not visible at single-component granularity.

## 2.6.1

## 2.6.0

## 2.5.0

## 2.4.0

## 2.3.0

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

## 2.2.0

### Patch Changes

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
