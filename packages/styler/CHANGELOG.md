# @vitus-labs/styler

## 2.6.1

### Patch Changes

- [#231](https://github.com/vitus-labs/ui-system/pull/231) [`75dc87f`](https://github.com/vitus-labs/ui-system/commit/75dc87f6fbc281676d5ed0791df9a08010e414cc) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Add a tracked CSS-in-JS perf benchmark at `packages/styler/benchmarks/`. Run with `bun run bench` from the styler package. Compares `@vitus-labs/styler` against `styled-components` 6 and `@emotion/styled` 11 on six scenarios: SSR (static / dynamic / themed) + CSR (mount / update / many distinct components).

  Documents the runtime perf landscape and serves as a regression check — a >10% drop on any styler row vs `results.md` should be investigated before merging.

  No runtime change; this only adds bench infra + devDependencies (`jsdom`, `tinybench`) to styler.

- [#233](https://github.com/vitus-labs/ui-system/pull/233) [`178cf8e`](https://github.com/vitus-labs/ui-system/commit/178cf8ede7fadb9749eacdace9886d9d77d13c16) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Cache the pre-built ReactElement for the no-extra-props case of static `styled` components.

  Most `<MyStyled />` call sites pass no props beyond `ref` — the destructure, `buildProps` iteration, and `createElement` calls produce the same element shape every render. Pre-build that element once at component creation and short-circuit in the render fn when `rawProps` is empty and `ref` is nullish.

  **Impact**: styler's overhead-over-bare-React for static SSR drops from ~0.065 μs/render to ~0.008 μs/render (~88% reduction). Net effect on full SSR throughput is +3–4% because React's `renderToString` itself dominates the remaining cost. Most-benefit consumers: pages that emit many static styled components with no extra props (typical layout/typography building blocks).

  ReactElement values are immutable so sharing the cached element across renders is safe; React still treats each render as a fresh tree by identity.

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
