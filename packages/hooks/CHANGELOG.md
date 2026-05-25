# @vitus-labs/hooks

## 2.6.2

### Patch Changes

- [#251](https://github.com/vitus-labs/ui-system/pull/251) [`4549648`](https://github.com/vitus-labs/ui-system/commit/4549648a5c3ff4f8e8691346ee6d75142401809c) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `useBreakpoint`: build the sorted `[name, min]` tuples via a for-in scan + push instead of `Object.entries(breakpoints).sort(...)`. Applied to both the web (`useBreakpoint.ts`) and React Native (`useBreakpoint.native.ts`) variants.

  **Why**

  The `Object.entries(...)` call allocated an intermediate tuple-array that the subsequent `.sort(...)` mutates in place anyway. for-in + push builds the array we actually want directly, while also picking up a `typeof value === 'number'` type-guard along the way (kept the runtime contract; satisfies `noUncheckedIndexedAccess` cleanly).

  Wrapped in `useMemo([breakpoints])` so this runs only when the breakpoints reference changes (typically once per Provider mount).

  **Measured delta**

  Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

  | Helper                                | Old ops/s | New ops/s | Δ          |
  | ------------------------------------- | --------- | --------- | ---------- |
  | `buildSortedBpTuples` (5 breakpoints) | 4.9M      | 8.8M      | **+80.3%** |

  The for-in + type-guard variant is materially faster than `Object.entries(...).sort(...)`. Useful even though useMemo caches the result — the cache miss happens at least once per Provider mount.

  **Verification**

  - 2688 monorepo tests pass
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
