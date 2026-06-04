# @vitus-labs/attrs

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
