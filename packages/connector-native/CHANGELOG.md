# @vitus-labs/connector-native

## 2.7.2

### Patch Changes

- [#296](https://github.com/vitus-labs/ui-system/pull/296) [`d9af6fb`](https://github.com/vitus-labs/ui-system/commit/d9af6fb6eb39dee9970fe686945ed6b978c46286) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Deep repo audit: 6 parallel auditors (memory leaks / wasted re-renders / correctness bugs / perf / bundle / security) followed by verified fixes across 8 packages. 27 new regression tests; 2821 total pass.

  **Correctness bugs fixed**

  - **styler `normalizeCSS`**: the line-comment guard only protected `//` immediately after `:`, so protocol-relative URLs (`url(//cdn...)`), path double-slashes, and string contents (`content: "//"`, `content: "a  b"`) were truncated or collapsed. The scanner now tracks quoted-string and `url(...)` state and preserves those spans verbatim.
  - **styler `splitAtRules`/`splitRules`**: brace counting ignored quotes, so `content: "{"` corrupted depth tracking — an `@media` block after it was never extracted and its styles silently dropped in production (`insertRule` rejects the nested form). Both scanners now skip quoted spans (escape-aware).
  - **attrs + rocketstyle ref forwarding**: `useImperativeHandle(ref, () => internalRef.current, [])` snapshotted the node once at mount — after a host remount (e.g. `tag="div"` → `tag="button"`) the consumer's ref kept the detached old node. Replaced with a merged callback ref that re-fires per attach/detach, so refs always track the live node.
  - **connector-native `parseCSS`**: `!important` was not stripped — `margin: 10px !important` expanded to invalid RN styles like `{marginRight: "!important"}` (throws in dev). The suffix is now stripped before dispatch.
  - **hooks `useControllableState`**: functional updates computed from the render-captured value, so two `setValue(p => p+1)` in one event handler yielded +1, and stale closures computed from old values. Updates now route through React's functional setState in uncontrolled mode with a current-value ref for the controlled branch and `onChange`.

  **Wasted re-renders fixed**

  - **unistyle Provider**: the context value `{ ...theme, __VITUS_LABS__: {...} }` was rebuilt every render, re-rendering every theme consumer whenever the Provider's parent re-rendered. Now memoized.
  - **core Provider**: the external engine's ThemeProvider received the raw `theme` prop instead of the `useStableValue`-stabilized one, piercing every styled component's memo when consumers pass inline theme literals. Now passes the stabilized object.
  - **rocketstyle `useTheme`**: the `theme = {}` destructure default allocated a fresh object per render in no-Provider apps, missing the ThemeManager WeakMap caches and invalidating `finalProps` useMemo on every render of every rocketstyle component. Now a module-scope stable sentinel.
  - **hooks `useWindowResize`**: resize ticks resolving to unchanged dimensions re-rendered all consumers; now bails via functional-update comparison (mirrors `useElementSize`), and `onChange` only fires on real changes.
  - **connector-native `styled`**: every styled component subscribed to `useWindowDimensions()`, so rotation/resize re-rendered the entire tree — including fully static templates whose output can't change. Static templates now skip the hook entirely (variant chosen at creation time).
  - **kinetic `Transition`**: a ~12-key config object was allocated every render but only consumed inside a `[stage, delay]` effect; now built inside the effect. `TransitionGroup` also prunes its cached `onAfterLeave` closure when a leaving key reappears (web + native).

  **Bundle**

  - **unistyle −1 000 B gzipped (−8.9%)**: 238 property descriptors carried a `css` field that was always exactly `camelToKebab(key)`; the field is now derived in one pass at module load.

  **Security hardening** (audit found zero vulnerabilities — prototype-pollution guards, SHA-pinned actions, React 19 style-children escaping all verified)

  - npm provenance attestations enabled (`NPM_CONFIG_PROVENANCE`) — the workflow already granted `id-token: write`; now it's actually used.
  - `release.yml` passes `publishedPackages` through `env:` instead of inline `${{ }}` interpolation (injection-safe convention).
  - styler README documents the trusted-interpolation contract (same model as styled-components/Emotion) with do/don't examples.

  **Memory leaks**: full sweep found none — every module-level cache is bounded/weak, every listener/observer has cleanup (verified, not assumed).

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
