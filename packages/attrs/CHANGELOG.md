# @vitus-labs/attrs

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

- [#268](https://github.com/vitus-labs/ui-system/pull/268) [`a99742a`](https://github.com/vitus-labs/ui-system/commit/a99742a27279399f4533fb7f620ca036c7075c6f) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `omit()` now accepts a prebuilt `ReadonlySet` of keys in addition to an array, and the three per-render callers feed it a stable Set so the lookup Set is no longer rebuilt on every render.

  **Why**

  `omit` builds `new Set(keys)` internally for O(1) lookups. When the key list is stable for a component's lifetime — which it is at every render-path caller — that Set was being reconstructed every render for nothing. The Set construction dominates the call cost when the source object is small (the usual case for props).

  Three hot callers, all previously passing a stable key array and paying the rebuild:

  - **rocketstyle** (`rocketstyle.tsx`, `finalProps` assembly) — additionally rebuilt a 3-way `[...RESERVED_STYLING_PROPS_KEYS, ...PSEUDO_KEYS, ...options.filterAttrs]` array each render. Now memoized into a single `Set` via `useMemo` (all three sources are stable for the instance).
  - **elements/List** — built a module-scope `Set` from the constant `Iterator.RESERVED_PROPS`.
  - **attrs** — built the `Set` once in the factory closure from `options.filterAttrs` (fixed at component-config time).

  `omit` stays fully backward compatible: array callers hit the same `new Set(keys)` path as before; only the internal length check moved from `keys.length` to `keysSet.size`.

  **Measured delta**

  Head-to-head microbench (median of 5 passes), realistic `finalProps` call: ~18-key mergeProps (dimension keywords + DOM/component props), 18 stable omit keys. Outputs byte-identical across all three strategies.

  | Strategy                                 | V8 (Node)             | JSC (Bun)             |
  | ---------------------------------------- | --------------------- | --------------------- |
  | current (concat + `new Set` each render) | 1.6M ops/s            | 1.5M ops/s            |
  | memoized array (Set still rebuilt)       | 1.7M ops/s (+5%)      | 1.5M ops/s (+2%)      |
  | **prebuilt Set (this change)**           | **3.0M ops/s (+47%)** | **6.5M ops/s (+77%)** |

  Memoizing the array alone barely moves the needle — the per-render `new Set` rebuild is the real cost, and passing a prebuilt Set removes it entirely.

- [#279](https://github.com/vitus-labs/ui-system/pull/279) [`fd0a6ac`](https://github.com/vitus-labs/ui-system/commit/fd0a6ac19c8171db5d407cb29d337fccfda5649d) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Performance pass on `@vitus-labs/rocketstyle` and `@vitus-labs/attrs`:

  - `attrs` and `rocketstyle`: wrap the innermost `EnhancedComponent` in `memo()`. attrs' `attrsHoc` already stabilizes its output via `useStableValue` + `useMemo`; rocketstyle's `rocketstyleAttrsHoc` now follows the same pattern. With both, a content-equal parent re-render bails at the memo boundary instead of walking the HOC stack.
  - `rocketstyleAttrsHoc`: brought to parity with `attrsHoc` (PR [#170](https://github.com/vitus-labs/ui-system/issues/170) pattern). Adds `useStableValue` + `useMemo` + a fast path for "no `.attrs()` configured" — the common case for rocketstyle components built with `.theme()`/dimensions only, which previously rebuilt every prop merge on every render.
  - `usePseudoState`: handlers ref-captured. Consumers passing inline `onMouseEnter`/`onMouseLeave`/etc (the common React idiom) no longer churn the wrapped handler identities every render, so downstream memoization actually takes effect on interactive components.
  - `useTheme`: drop the pointless `useMemo` wrapping `{ theme, mode, isDark, isLight }`. All call sites destructure the primitives; the memo bookkeeping cost more than the recomputation.
  - `useRef` hooks (both packages): add empty `[]` deps to `useImperativeHandle` so the getter isn't re-registered every render.
  - `chainOrOptions` + `chainReservedKeyOptions` (rocketstyle): replace `reduce-with-spread-accumulator` (O(K²)) with single-pass mutation (O(K)).
  - `validateInit` (rocketstyle): replace nested `.some()` with module-level `Set` lookup (O(R + D) instead of O(R × D)).
  - `calculateChainOptions` (both): drop the dead `const result = {}` allocation in the early-return path.

  Dead code removed:

  - `rocketstyle/constants/booleanTags.ts`: 33-line constant array imported by nothing in production. Only its own test referenced it.
  - `rocketstyle/utils/theme.ts`: orphan `calculateChainOptions` (a 2-arg variant unused outside its own test; the live impl lives in `utils/attrs.ts`).
  - `rocketstyle.tsx`: duplicate `IS_ROCKETSTYLE` + `displayName` assignment block.

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
