# @vitus-labs/connector-native

## 2.7.1

## 2.7.0

### Patch Changes

- [#271](https://github.com/vitus-labs/ui-system/pull/271) [`1e7e428`](https://github.com/vitus-labs/ui-system/commit/1e7e42887963b9cf81a9d07be18b2e33327d73ea) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix two correctness bugs that broke responsive and themed styling on React Native:

  1. **Array interpolations were stringified to garbage.** `unistyle`'s `makeItResponsive` emits an array of per-breakpoint results (`[CSSResult, '', CSSResult, …]`) and feeds it into the engine's `css` as an interpolation. The native `css` resolver had no array branch, so the array fell through to the object path and produced `"0: [object Object]; 1: ; …"` instead of merged styles — i.e. **every responsive (breakpoint-object) prop was broken on native**. Added array flattening (mirrors the web styler's `resolve.ts`), so entries resolve and cascade correctly with later breakpoints overriding earlier ones.

  2. **The context theme was never injected.** The native `styled` component resolved templates with the raw props only — it never called `useTheme()`, so `${(p) => p.theme.x}` interpolations resolved to `undefined`, and `makeItResponsive` (which reads `props.theme`) saw an empty theme. Now `styled` injects the context theme into the resolve props (mirroring the web styler), without forwarding `theme` to the underlying RN component. A consumer-passed `theme` prop still takes precedence.

  Both paths are now covered by tests, including an end-to-end responsive pipeline test (`createMediaQueries` → array → `css`) verifying the mobile-first breakpoint cascade.

- [#272](https://github.com/vitus-labs/ui-system/pull/272) [`da96aa9`](https://github.com/vitus-labs/ui-system/commit/da96aa96d807a3739414ac0d668a13a27735c988) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fundamentally fix the two remaining React Native styling gaps:

  1. **Multi-value box shorthands now expand correctly.** `padding: 8px 16px`, `margin: 0 auto`, `border-radius: 4px 8px 12px 16px`, etc. previously parsed to just their first token (`padding: 8`), because React Native has no multi-value shorthand. They now expand into RN longhands following the CSS box-model value rules: edge shorthands (`margin`/`padding`/`inset`/`border-width`) → `*Top/*Right/*Bottom/*Left`, `border-radius` → per-corner radii, and `gap: row col` → `rowGap`/`columnGap`. Single values are unchanged (RN supports them); `calc()` and elliptical (`/`) radii are left untouched.

  2. **Responsive breakpoints are now reactive to rotation / resize.** `createMediaQueries` deferred its `Dimensions.get('window').width` check from breakpoint-call time to `resolve()` time, so the current width is read on every resolve instead of being baked into upstream caches (e.g. `makeItResponsive`'s per-theme cache). The native `styled` component subscribes to `useWindowDimensions()` so a rotation/resize re-renders and re-resolves — matching how the browser re-evaluates `@media`. Previously a responsive component kept its first-render breakpoint until something else forced a re-render.

- [#273](https://github.com/vitus-labs/ui-system/pull/273) [`1ff9db0`](https://github.com/vitus-labs/ui-system/commit/1ff9db072b4e7c47dde960aefde7d3991944e834) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Perf + correctness audit, round 3 — seven fixes across five packages, identified by a multi-modal codebase audit with 3-judge adversarial verification per finding.

  **Correctness fix (kinetic)** — `nextFrame` now returns a canceller that aborts both rAFs. The prior implementation returned only the OUTER rAF id, so cleanup left the inner rAF live and the transition callback fired against potentially-stale or detached elements on fast toggles (open-while-closing, StrictMode double-invoke). All 6 call sites in `Transition` / `TransitionItem` / `TransitionRenderer` updated in lockstep.

  **Memory hygiene**

  - `styler`: `sheet.insertCache` and `sheet.prepareCache` were keyed by full cssText (200–5000 B per entry) and only cleared by HMR/SSR hooks — long-running SPAs accumulated every unique cssText forever. `evictIfNeeded()` now bounds all three caches via the existing `evictMapByPercent`.
  - `kinetic`: `splitCache` (className → string[] memoization) was unbounded module-level Map; now capped at 256 entries with the same oldest-10%-evict pattern.

  **Per-render allocations**

  - `coolgrid`: `omitCtxKeys` rebuilt a 10-key Set on every Container/Row/Col render (5 components, web + native). Now uses a module-scope `CONTEXT_KEYS_SET`, matching the `omitKeysSet`/`filterAttrsSet` pattern from PR [#268](https://github.com/vitus-labs/ui-system/issues/268).
  - `connector-native`: `styled` re-spread `forwardedProps` into `createElement` despite the object being freshly allocated one line earlier and held by no caller. Now mutates directly (mirrors the styler rawProps-mutation trick); also hoists the `shouldForwardProp` resolution to component-creation time.

  **Algorithmic / consistency**

  - `rocketstyle`: `removeNullableValues` was O(n²) (`.filter().reduce(spread)` allocates a fresh accumulator per step). Now O(n) single-pass, matching the sibling implementation in `@vitus-labs/attrs`.
  - `kinetic`: `parseTransformString` allocated a fresh stateful `RegExp` on every call. `TRANSFORM_RE` now hoisted to module scope (mirrors the existing `EASING_NAMES` pattern in the same file); `lastIndex` reset per use.

  Verified by 2-of-3 adversarial judges (correctness / perf / safety lenses) per finding, with 9 separate candidates refuted and excluded. Full suite 2730+ pass; 5 new lock-in tests covering the nextFrame canceller and the multi-cache eviction.

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
