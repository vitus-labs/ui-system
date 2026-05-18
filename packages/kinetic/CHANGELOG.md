# @vitus-labs/kinetic

## 2.6.1

### Patch Changes

- [#239](https://github.com/vitus-labs/ui-system/pull/239) [`fafa465`](https://github.com/vitus-labs/ui-system/commit/fafa465fb6bc9dd1f511d33cab5107fc3d2577c8) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Perf + correctness micro-fixes from a `react-doctor` triage (valid findings only; tool false-positives documented, not actioned):

  - `nativeParsers`: hoist `easingNames` to a module-level `Set` — was an O(n) `.includes()` re-allocating a 5-element array per parsed transition token. Dropped a provably-dead `type &&` guard (the regex group `(\w+)` guarantees a non-empty match).
  - `nativeAnimations`: replace the O(n·m) `.find()`-in-loop with a pre-built type→value `Map`. `.find()`-first semantics are preserved exactly (the Map is built skip-if-present, so a repeated transform type keeps its FIRST value, not last).

  Behaviour is unchanged. New `nativeAnimations.test.ts` (20 cases) pins the transform-merge parity, identity fallbacks, the non-transform style path, `getPrimaryTransition`, and `mergeStyles` — net coverage rises.

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
