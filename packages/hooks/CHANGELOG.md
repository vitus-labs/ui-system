# @vitus-labs/hooks

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

### Minor Changes

- [#274](https://github.com/vitus-labs/ui-system/pull/274) [`b4bba44`](https://github.com/vitus-labs/ui-system/commit/b4bba443b1cfb24dc350f99bba4fd2b2ca1818cd) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements`: `Overlay` (modal) auto-traps focus and locks page scroll while open. Focus selector widened to include `contenteditable`, `video[controls]`, `audio[controls]`, `summary`. Hooks inlined — no `@vitus-labs/hooks` peer.
  - `hooks`: add `useLocalStorage`, `useEventListener`, `useCopyToClipboard`, `useResizeObserver`.
  - `unistyle`: add `between(breakpoints, minKey, maxKey)` for closed-range media queries; dev warning for unknown theme keys; CI-enforced `ITheme` ↔ `propertyMap` parity test.
  - `styler`: hash-collision dev warning in `sheet`.
  - `kinetic`: fix `Stagger.native` dropping per-child `delay`; `Transition.native` honors `useReducedMotion`.
  - `connector-emotion` + `connector-styled-components`: per-connector smoke tests; broken `useCSS` shims removed (now styler-only).

### Patch Changes

- [#276](https://github.com/vitus-labs/ui-system/pull/276) [`d25e339`](https://github.com/vitus-labs/ui-system/commit/d25e3393a7af48c2367986a6e77f70b2812235c0) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements/Overlay`: strip `body.overflow` management from `useScrollReposition`. `useScrollLock` is now the sole owner, gated on `isContentLoaded`. Fixes a silent permanent scroll-lock on async-mount modals.
  - `elements/Overlay/useOverlay`: remove `prevFocusRef` (set, never read) and its dead effect.
  - `kinetic`: `Transition.tsx` honors the `delay` prop (was advertised, ignored on web).
  - `hooks`: drop `useFocus` and `useHover` from the native re-exports — they return DOM-only handler names that no RN component fires.
  - `coolgrid`: delete `Container/utils.ts:getContainerWidth` — exported but only consumed by its own tests.

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
