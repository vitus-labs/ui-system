# @vitus-labs/connector-native

## 2.6.2

### Patch Changes

- [#250](https://github.com/vitus-labs/ui-system/pull/250) [`c7c097b`](https://github.com/vitus-labs/ui-system/commit/c7c097bfe54540055c718582092dfa54c4ee6410) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Three structural cleanups in the React Native CSS connector. No public API or behavioural changes.

  **Changes**

  1. **`styled.ts` prop filter loop** — `for (const key of Object.keys(props))` → `for (const key in props)`. Saves the keys array allocation on every native styled render.
  2. **`createMediaQueries.ts`** — `Object.keys.reduce` → for-in + direct mutation. Mirrors the same change in `@vitus-labs/unistyle`'s `createMediaQueries`.
  3. **`css.ts` `styleObjectToString`** — extracted the `Object.entries(o).map(([k,v]) => …).join('; ')` pattern (two arrays + a join) used in `resolveInterpolation` into a dedicated single-pass for-in concat helper. Saves the entries-tuple array + transformed array + the implicit array `.join()` consumes — three allocations skipped per nested-style stringification.

  **Measured deltas**

  Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

  | Helper                                     | Old ops/s | New ops/s | Δ           |
  | ------------------------------------------ | --------- | --------- | ----------- |
  | `filterForwardedProps` (12-key props)      | 5.1M      | 5.4M      | **+6.2%**   |
  | `createMediaQueries` (5 breakpoints)       | 19.4M     | 23.3M     | **+19.9%**  |
  | `styleObjectToString` (5-key style object) | 3.3M      | 21.5M     | **+553.5%** |

  `styleObjectToString` is the biggest single win — the prior `entries.map.join` chain allocated three intermediate arrays per call; the for-in concat skips all of them.

  **Verification**

  - All connector-native tests pass via the monorepo suite (135 files, 2688 tests pass)
  - `bun run lint`, `bun run typecheck` clean

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
