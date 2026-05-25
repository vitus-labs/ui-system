# @vitus-labs/attrs

## 2.6.2

### Patch Changes

- [#246](https://github.com/vitus-labs/ui-system/pull/246) [`b003de4`](https://github.com/vitus-labs/ui-system/commit/b003de47b6648f49365f879caf544ef94b935e29) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `removeUndefinedProps`: switch from `Object.keys(props).reduce(...)` to a direct `for...in` loop.

  **Why**

  The function fires on every content-equal re-render via `attrsHoc`'s `useMemo` body. The prior `reduce` over `Object.keys(props)` allocated an intermediate keys array per call. The for-in loop iterates the same own enumerable keys (React props are always plain objects) without the array allocation.

  **Verification**

  - 83 attrs tests pass (existing suite exhaustively covers `removeUndefinedProps`: undefined-stripping, null/false/0/'' preservation, all-undefined, empty-object edge cases)
  - 2688 monorepo tests pass
  - `bun run lint`, `bun run typecheck` clean

  **Honest framing**

  Structural cleanup, **not a measurable headline perf win**. No microbench in-tree for attrs, so no claimed delta. The win is one fewer array allocation per `attrsHoc` render — it compounds across deep attrs-wrapped trees but is below single-component noise.

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
