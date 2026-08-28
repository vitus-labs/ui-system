# @vitus-labs/kinetic-presets

## 2.7.4

### Patch Changes

- [#348](https://github.com/vitus-labs/ui-system/pull/348) [`5129bb8`](https://github.com/vitus-labs/ui-system/commit/5129bb8d88d7404b52d1b55c9cee7e492aa10649) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Rebuild on `@vitus-labs/tools-*` 2.7.1.
  
  Patch bump of the build toolchain — rolldown and rolldown-plugin-dts are
  unchanged from 2.7.0, so the emitted bundles are equivalent and every
  size budget still passes. No source or public API changes.

- [#348](https://github.com/vitus-labs/ui-system/pull/348) [`5129bb8`](https://github.com/vitus-labs/ui-system/commit/5129bb8d88d7404b52d1b55c9cee7e492aa10649) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Rebuild on `@vitus-labs/tools-*` 2.7.0.
  
  The build toolchain moves to rolldown 1.2.6 and rolldown-plugin-dts
  0.28.2, so the published bundles are regenerated. No source or public
  API changes — bundle sizes shift by tens of bytes and all size budgets
  still pass.
  
  2.7.0 also drops `rollup-plugin-filesize` from `tools-rolldown`, which
  removes the `pacote` -> `cacache`/`sigstore`/`node-gyp` subtree from the
  install graph: 157 fewer packages and 5 fewer security advisories.

## 2.7.3

## 2.7.2

## 2.7.1

## 2.7.0

## 2.6.2

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
