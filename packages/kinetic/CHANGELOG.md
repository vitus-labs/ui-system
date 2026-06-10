# @vitus-labs/kinetic

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

- [#274](https://github.com/vitus-labs/ui-system/pull/274) [`b4bba44`](https://github.com/vitus-labs/ui-system/commit/b4bba443b1cfb24dc350f99bba4fd2b2ca1818cd) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements`: `Overlay` (modal) auto-traps focus and locks page scroll while open. Focus selector widened to include `contenteditable`, `video[controls]`, `audio[controls]`, `summary`. Hooks inlined — no `@vitus-labs/hooks` peer.
  - `hooks`: add `useLocalStorage`, `useEventListener`, `useCopyToClipboard`, `useResizeObserver`.
  - `unistyle`: add `between(breakpoints, minKey, maxKey)` for closed-range media queries; dev warning for unknown theme keys; CI-enforced `ITheme` ↔ `propertyMap` parity test.
  - `styler`: hash-collision dev warning in `sheet`.
  - `kinetic`: fix `Stagger.native` dropping per-child `delay`; `Transition.native` honors `useReducedMotion`.
  - `connector-emotion` + `connector-styled-components`: per-connector smoke tests; broken `useCSS` shims removed (now styler-only).

## 2.6.2

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
