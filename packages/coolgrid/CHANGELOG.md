# @vitus-labs/coolgrid

## 2.7.0

### Patch Changes

- [#276](https://github.com/vitus-labs/ui-system/pull/276) [`d25e339`](https://github.com/vitus-labs/ui-system/commit/d25e3393a7af48c2367986a6e77f70b2812235c0) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements/Overlay`: strip `body.overflow` management from `useScrollReposition`. `useScrollLock` is now the sole owner, gated on `isContentLoaded`. Fixes a silent permanent scroll-lock on async-mount modals.

  - `elements/Overlay/useOverlay`: remove `prevFocusRef` (set, never read) and its dead effect.
  - `kinetic`: `Transition.tsx` honors the `delay` prop (was advertised, ignored on web).
  - `hooks`: drop `useFocus` and `useHover` from the native re-exports — they return DOM-only handler names that no RN component fires.
  - `coolgrid`: delete `Container/utils.ts:getContainerWidth` — exported but only consumed by its own tests.

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
