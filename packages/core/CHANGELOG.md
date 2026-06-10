# @vitus-labs/core

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

### Patch Changes

- [#285](https://github.com/vitus-labs/ui-system/pull/285) [`b9ae0ab`](https://github.com/vitus-labs/ui-system/commit/b9ae0abf8236cde48e8a4a6873e2353fa5c3d605) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix `Maximum call stack size exceeded` in `isEqual` when comparing objects that contain self-references or mutual references.

  Reproduced in the wild as a consumer-app crash:

  ```
  Uncaught RangeError: Maximum call stack size exceeded
      at isObjectEqual (index.js:156:23)
      at isEqual (index.js:170:9)
      at isObjectEqual …
  ```

  The recursion path is `isEqual → isObjectEqual → isEqual → …` with no termination. Root cause: `isEqual`'s docstring acknowledged it did not handle circular references, but `useStableValue` calls it on whatever props consumers pass — including props that may include React internals (fiber owners, refs), context-shaped objects with back-references, or any other graph that happens to cycle. Stack overflow.

  Fixed by threading a `WeakMap<object, object>` of "currently comparing" pairs through the recursion. When the same `(a, b)` pair is re-entered, the cycle returns `true` — the structural walk will still return `false` at any genuinely-differing leaf, so deep equality stays correct. Non-cyclic data is unaffected.

  Regression test coverage added:

  - Self-referential objects (`a.self = a`)
  - Mutually-referential object pairs (`a.other = b; b.other = a`)
  - Cyclic structures with a genuine difference (still returns false)
  - Self-referential arrays

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

### Minor Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Add augmentable `CSSEngineResult` interface — `css()`'s return type now follows whichever engine `init()`'d via TypeScript module declaration merging, replacing the previous engine-agnostic `any`. Connector packages declare their concrete result shape; consumer code automatically gets the right type without core depending on any specific engine package.

### Patch Changes

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
