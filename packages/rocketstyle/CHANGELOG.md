# @vitus-labs/rocketstyle

## 2.7.0

### Patch Changes

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

- [#266](https://github.com/vitus-labs/ui-system/pull/266) [`d61892e`](https://github.com/vitus-labs/ui-system/commit/d61892ea0010d91eba81dd6a214dcb9f91554641) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `calculateStylingAttrs`: drop per-render allocations on the dimension-resolution hot path. Replace `Object.keys(dimensions).forEach` and `Object.entries(result).forEach` with `for…in` loops, and replace the per-dimension `new Set(Object.keys(dimensions[key]))` keyword lookup with direct `Object.hasOwn` membership.

  **Why**

  `calculateStylingAttrs` runs in the `EnhancedComponent` render body (rocketstyle.tsx:351) — once per render of every rocketstyle-wrapped component, not memoized. The old implementation allocated, per render: a keys array + closure for `Object.keys(dimensions).forEach`, an entries array + closure for `Object.entries(result).forEach`, and — for each unresolved boolean dimension — a fresh `Set` plus its backing `Object.keys` array. The `Set` is rebuilt every render even though `dimensions[key]` is a stable config object, so the keyword membership was recomputed from scratch each time.

  `Object.hasOwn(dimensions[key], k)` is the exact equivalent of the prior `keywordSet.has(k)` (own enumerable keys of a plain config object) with zero allocation, and matches the `for…in` precedent already established by `pickStyledAttrs` directly above.

  **Measured delta**

  Head-to-head microbench (median of 5 passes, interleaved to neutralize drift), realistic fixture: 3 dimensions (~4–5 keywords each), `useBooleans` on, props = mix of dimension keywords + typical non-dimension props (`className`, `onClick`, `children`, `data-*`, `aria-*`, `style`, …). Outputs byte-identical between old and new.

  | Engine    | Old        | New        | Δ        |
  | --------- | ---------- | ---------- | -------- |
  | V8 (Node) | 2.0M ops/s | 2.3M ops/s | **+13%** |
  | JSC (Bun) | 1.7M ops/s | 8.6M ops/s | **+79%** |

  JavaScriptCore optimizes the `for…in` + `Object.hasOwn` form far better than `Object.keys`/`forEach`/`Set`; V8 gains are smaller but consistent. The rewrite is simpler code and faster on both engines.

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

- [#247](https://github.com/vitus-labs/ui-system/pull/247) [`00fdadc`](https://github.com/vitus-labs/ui-system/commit/00fdadc215bd2ddc67daad88e9294c496e148204) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Four small structural cleanups across the render path. No public API or behavioural changes.

  **Changes**

  1. **`pickStyledAttrs`** (`utils/attrs.ts`) — switch from `Object.keys(props).reduce(...)` to a direct `for...in` loop. Fires once per render of every rocketstyle-wrapped component; drops the intermediate `Object.keys` array allocation.
  2. **`isShallowEqualRocketstate`** (`rocketstyle.tsx`) — replace `Object.keys(a)` + `Object.keys(b)` with two `for...in` scans. Same key-walking semantics, two fewer transient string-array allocations per render.
  3. **`getThemeByMode`** (`utils/theme.ts`) — recursive theme walker: same `reduce` → `for...in` swap. Called inside cached `useMemo` blocks (one per theme/mode transition), so smaller payoff than per-render helpers but keeps the pattern consistent.
  4. **`PSEUDO_AND_META_KEYS` hoisted** (`constants/index.ts` + `rocketstyle.tsx`) — the render body was allocating a fresh `[...PSEUDO_KEYS, ...PSEUDO_META_KEYS]` 6-element array on every render to feed `pick()`. Pre-merged the constant at module scope.

  **Verification**

  - 236 rocketstyle tests pass (existing suite exhaustively covers `pickStyledAttrs`, `isShallowEqualRocketstate`'s shallow-equal contract, `getThemeByMode`'s recursive resolution, and the pseudo-state pickup path)
  - 2688 monorepo tests pass
  - `bun run lint`, `bun run typecheck` clean

  **Honest framing**

  Structural cleanup, **not a measurable headline perf win**. No microbench in-tree for rocketstyle, so no claimed delta. The wins are a handful of array allocations skipped per render — they compound across deep rocketstyle component trees (large design systems with many wrapped primitives) but live below single-component noise.

## 2.6.1

## 2.6.0

## 2.5.0

### Minor Changes

- [#227](https://github.com/vitus-labs/ui-system/pull/227) [`4114383`](https://github.com/vitus-labs/ui-system/commit/4114383abde75ce242fe38e2f08a67f17e567733) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `.attrs()` callback form now keeps literal narrowing — no more `as const` workarounds.

  **What changed**

  `.attrs()` is now an overloaded interface with two signatures:

  - **Object form**: `<P extends TObj = {}>(param: P & Partial<NoInfer<DFP>>, …)`.
  - **Callback form**: `<P extends TObj = {}>(param: AttrsCb<DFP & P, Theme<T>>, …)`.

  The callback signature uses `AttrsCb<DFP & P, …>` directly so the return literal narrows contextually against `DFP`. Previously the single branched signature combined with the `Partial<NoInfer<DFP>>` from the object path caused literals in the callback's return to widen — consumers had to write:

  ```ts
  .attrs(({ rootElement }) => ({
    tag: 'ul' as const,        // ← needed before
    contentAlignX: 'block' as const,
  }))
  ```

  After this change, the `as const` is no longer needed — `'ul'` contextually narrows to `HTMLTags`.

  ```ts
  .attrs(({ rootElement }) => ({
    tag: 'ul',           // ✓ narrows to literal 'ul' assignable to HTMLTags
    contentAlignX: 'block',
  }))
  ```

  **No behavioral change** for existing object-form `.attrs({…})` or explicit-`<P>` callback `.attrs<P>((props) => …)` patterns. The OA-overlapping widening and EA-key optionality from the previous release stay intact.

## 2.4.0

### Minor Changes

- [#225](https://github.com/vitus-labs/ui-system/pull/225) [`a2f4762`](https://github.com/vitus-labs/ui-system/commit/a2f47626a0e8cd23469ac697f048897d99fabde2) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `.attrs({ x: defaultValue })` now makes `x` optional at the JSX call site.

  Semantically, `.attrs()` provides a runtime default — so the consumer shouldn't be required to pass that prop. The previous types didn't reflect that: keys passed to `.attrs()` stayed required at the call site (especially when they overlapped with the wrapped component's required props, e.g. `component` on `List`).

  Two changes:

  - **DFP widening**: `IRocketStyleComponent`'s `DFP` now strips OA keys that EA defaults and re-adds them as `Partial`, and feeds `Partial<EA>` into the merge — every `.attrs()`-provided key becomes optional at the call site.
  - **`.attrs()` inference**: previously the object-form `.attrs({ … })` didn't update EA without an explicit `<P>` annotation (the param type `Partial<MergeTypes<[DFP, P]>>` defeated P inference). The new signature uses `P & Partial<NoInfer<DFP>>`, letting TS infer P from the param's keys while still accepting extra DFP defaults.

  Result on wrappers like:

  ```ts
  const CardList = rocketstyle()({ component: List, name: "CardList" }).attrs({
    component: Card,
    rootElement: false,
  });
  ```

  - `<CardList data={users} itemKey="id" />` — compiles (component default from .attrs).
  - `<CardList data={users} component={OtherCard} itemKey="id" />` — still compiles (override).
  - `<CardList data={users} valueName="x" />` — still rejected (per-mode narrowing from [#222](https://github.com/vitus-labs/ui-system/issues/222) preserved).

  **Behavior change to be aware of**: `.attrs<{ isRequired: boolean }>({ isRequired: true })` no longer requires `isRequired` at the JSX call site (it has a default). This is consistent with what `.attrs` means, but if anyone was relying on `.attrs()` keys being required JSX props, that no longer holds.

  Callback-form `.attrs((props) => …)` does not infer P; pass it explicitly (`.attrs<P>((props) => …)`) if you want callback-set defaults to widen the type surface.

## 2.3.0

### Minor Changes

- [#222](https://github.com/vitus-labs/ui-system/pull/222) [`5ec636e`](https://github.com/vitus-labs/ui-system/commit/5ec636e0a10eff4c72e414fe22a4ceb8e7ae0e05) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Preserve per-mode narrowing on overloaded components through `rocketstyle()` wrapping.

  PR [#199](https://github.com/vitus-labs/ui-system/issues/199) made `Iterator` and `List` overloaded interfaces so direct call sites get strict per-mode discrimination (e.g. `<List data={users} valueName="x" />` is rejected because `valueName?: never` on the object-array branch). Wrapping with `rocketstyle()({ component: List })` lost that — `ExtractProps<C>` picked the last overload, so the wrapper exposed only `ChildrenProps` and every iterator-style call errored.

  The fix is two-layered:

  - `ExtractProps` now pattern-matches against 1–4 callable overloads and returns the union of every overload's first-param type. Single-callable and plain-object inputs fall through to the previous behaviour unchanged.
  - `IRocketStyleComponent`'s `DFP` distributes over `OA`'s union branches and intersects each branch raw (not via `MergeTypes`), so `valueName?: never` markers survive — `MergeTypes`' `ExtractNullableKeys` would otherwise strip them.

  Result on wrapped components like `rocketstyle()({ component: List })`:

  - `<StyledList data={users} component={Card} />` — compiles (object-array branch).
  - `<StyledList data={users} valueName="x" component={Card} />` — rejected.
  - `<StyledList data={strings} component={Item} valueName="x" />` — compiles (string-array branch).
  - `<StyledList>{children}</StyledList>` — compiles (children branch).
  - `<StyledList data={strings}>{children}</StyledList>` — rejected (mode mixing).

  Trade-off: per-`T` narrowing inside `itemProps` / `wrapProps` callbacks is lost through the wrap (the callback's `item` argument is the constraint's upper bound, not the consumer's concrete `T`). Direct `<List data={users} itemProps={(u) => …} />` keeps full per-`T` narrowing. Wrapped consumers who need the concrete type in callbacks can annotate explicitly: `itemProps={(item: User) => …}`.

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

## 2.2.0

### Patch Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Two correctness fixes uncovered by the docs audit. Fix `isDark`/`isLight` swap in `getDefaultAttrs` mode helpers (`rocketstyle.tsx:532-533`) — runtime renders were correct via `useTheme`, but the static introspection path used by rocketstories fed `.attrs()` callbacks inverted helpers, so any story whose attrs branched on `helpers.isDark`/`helpers.isLight` showed wrong-mode-sensitive defaults. Tighten `IRocketStories.init` interface from a method (`() => {...}`) to a property literal — the runtime is an object literal, so `stories.init()` typechecked but threw `init is not a function` at runtime; now the type matches runtime. Includes regression tests for both.

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix component-swap leak in `.config({ component })`. When `cloneAndEnhance` swaps the underlying component, the prior `attrs`, `priorityAttrs`, `compose`, and `filterAttrs` chain values were silently carried forward — they were tailored to the previous component's prop shape and could leak invalid props onto the rendered output. Now those chain values reset on component change. Style-side state (themes, dimensions, statics, pseudo) is preserved. Same-component swaps remain a no-op for attrs.

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
