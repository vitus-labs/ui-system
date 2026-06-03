# @vitus-labs/unistyle

## 2.7.0

### Minor Changes

- [#274](https://github.com/vitus-labs/ui-system/pull/274) [`b4bba44`](https://github.com/vitus-labs/ui-system/commit/b4bba443b1cfb24dc350f99bba4fd2b2ca1818cd) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements`: `Overlay` (modal) auto-traps focus and locks page scroll while open. Focus selector widened to include `contenteditable`, `video[controls]`, `audio[controls]`, `summary`. Hooks inlined — no `@vitus-labs/hooks` peer.
  - `hooks`: add `useLocalStorage`, `useEventListener`, `useCopyToClipboard`, `useResizeObserver`.
  - `unistyle`: add `between(breakpoints, minKey, maxKey)` for closed-range media queries; dev warning for unknown theme keys; CI-enforced `ITheme` ↔ `propertyMap` parity test.
  - `styler`: hash-collision dev warning in `sheet`.
  - `kinetic`: fix `Stagger.native` dropping per-child `delay`; `Transition.native` honors `useReducedMotion`.
  - `connector-emotion` + `connector-styled-components`: per-connector smoke tests; broken `useCSS` shims removed (now styler-only).

### Patch Changes

- [#270](https://github.com/vitus-labs/ui-system/pull/270) [`41772d9`](https://github.com/vitus-labs/ui-system/commit/41772d95bf281cb00b61ec34d813def70a6ce1dc) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix `borderCollapse`: it was declared in the `ITheme` prop type but had no `propertyMap` descriptor, so passing it type-checked yet emitted no CSS. Added the missing `simple` descriptor so `borderCollapse: 'collapse' | 'separate'` now produces `border-collapse: …`. Verified by diffing all 305 typed `ITheme` keys against the property map — this was the only typed-but-unmapped key (the other, `keyframe`, is intentionally consumed by the `animation` special handler).

## 2.6.2

### Patch Changes

- [#249](https://github.com/vitus-labs/ui-system/pull/249) [`e573e6c`](https://github.com/vitus-labs/ui-system/commit/e573e6c411ae195efe17b9d0c9dda2b218165037) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Five structural cleanups across the responsive engine. No public API or behavioural changes.

  **Changes**

  1. **`createMediaQueries`** (`responsive/createMediaQueries.ts`) — `Object.keys.reduce` → for-in + direct mutation. Avoids the keys array allocation + reduce callback overhead per breakpoint setup.
  2. **`shouldNormalize`** (`responsive/normalizeTheme.ts`) — `Object.values(props).some(...)` → for-in early-exit. Drops the values array allocation; the early `return true` is hit by any responsive token so most calls bail out quickly.
  3. **`normalizeTheme`** (`responsive/normalizeTheme.ts`) — `Object.entries.forEach` → for-in. Avoids the entries-tuple array allocation per theme normalization.
  4. **`transformTheme`** (`responsive/transformTheme.ts`) — same pattern, applied to outer (`theme`) and inner (object-shape value) loops. Two entries-array allocations skipped per pivot.
  5. **`optimizeTheme/shallowEqual`** (`responsive/optimizeTheme.ts`) — two `Object.keys` allocations replaced with for-in counting (same pattern as rocketstyle's `isShallowEqualRocketstate`).
  6. **`alignContent` isReverted check** (`styles/alignContent.ts`) — `['inline', 'reverseInline'].includes(direction)` → direct `===` comparison. Avoids the per-call 2-element array allocation on a path that fires for every styled component with a `direction` prop.

  ## Measured deltas

  Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

  | Helper                                      | Old ops/s | New ops/s | Δ             |
  | ------------------------------------------- | --------- | --------- | ------------- |
  | `createMediaQueries` (5 breakpoints)        | 18.8M     | 21.6M     | **+15.9%**    |
  | `shouldNormalize` (5-prop theme)            | 20.2M     | 24.3M     | **+20.3%**    |
  | `shallowEqual` (5-key style objects, equal) | 23.2M     | 24.1M     | +4.0%         |
  | `alignContent isReverted` check             | 24.5M     | 24.6M     | +0.3% (noise) |

  The `shallowEqual` improvement is smaller than the rocketstyle equivalent because the early-exit `a === b` reference check dominates; the `alignContent` change is below noise but still a real allocation reduction. The structural argument stands for both — they just sit below tinybench's resolution for tiny inputs.

  ## Verification

  - 207 unistyle tests pass (existing suite covers all five helpers via the responsive pipeline)
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
