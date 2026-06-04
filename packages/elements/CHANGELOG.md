# @vitus-labs/elements

## 2.7.0

### Minor Changes

- [#274](https://github.com/vitus-labs/ui-system/pull/274) [`b4bba44`](https://github.com/vitus-labs/ui-system/commit/b4bba443b1cfb24dc350f99bba4fd2b2ca1818cd) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements`: `Overlay` (modal) auto-traps focus and locks page scroll while open. Focus selector widened to include `contenteditable`, `video[controls]`, `audio[controls]`, `summary`. Hooks inlined — no `@vitus-labs/hooks` peer.
  - `hooks`: add `useLocalStorage`, `useEventListener`, `useCopyToClipboard`, `useResizeObserver`.
  - `unistyle`: add `between(breakpoints, minKey, maxKey)` for closed-range media queries; dev warning for unknown theme keys; CI-enforced `ITheme` ↔ `propertyMap` parity test.
  - `styler`: hash-collision dev warning in `sheet`.
  - `kinetic`: fix `Stagger.native` dropping per-child `delay`; `Transition.native` honors `useReducedMotion`.
  - `connector-emotion` + `connector-styled-components`: per-connector smoke tests; broken `useCSS` shims removed (now styler-only).

### Patch Changes

- [#278](https://github.com/vitus-labs/ui-system/pull/278) [`34e4994`](https://github.com/vitus-labs/ui-system/commit/34e499472d94c9b081be5af54a496d200b1fc6e4) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Performance and correctness pass on `@vitus-labs/elements`:

  - `Element` and `Wrapper` are now wrapped in `memo()` — parent re-renders no longer re-execute the full body when props are referentially stable. VL statics (`displayName`/`pkgName`/`VITUS_LABS__COMPONENT`) attach to the memoized wrapper so rocketstyle/attrs detection still works.
  - `Element` `WRAPPER_PROPS` literal removed — keys inlined into the JSX so the build-then-spread copy pass disappears. `Wrapper` `COMMON_PROPS` literal removed the same way.
  - `Wrapper`'s three separate `useMemo` calls (`normalElement`/`parentFixElement`/`childFixElement`) collapsed into one — each render previously paid the dep-array compare cost for all three even though only one shape is used.
  - `Element` `mergedRef` is now ref-stable. The previous `useCallback` listed `externalRef` in its deps, so an inline parent ref-callback caused React to detach/attach the DOM ref every render.
  - `useOverlay`: `onOpen`/`onClose` ref-captured. The previous dep array re-ran the lifecycle effect on every parent render and fired spurious `onClose`/`setUnblocked` cleanup callbacks while the overlay was still open.
  - `useOverlay`: `isNodeOrChild` curry replaced with two stable predicates allocated once. The old shape allocated two fresh closures per click event.
  - `useOverlay`: click listener uses `document` instead of `window` (one fewer propagation hop, matches `useFocusTrap`'s convention).
  - `useFocusTrap`: `for…of` over `NodeList` swapped for an index loop (no iterator-protocol allocation). MutationObserver refreshes coalesced via `requestAnimationFrame` so a burst of child mounts doesn't re-run `querySelectorAll` per mutation.
  - `Element/equalize`: skip the style write when both sides are already equal AND non-zero. Breaks a potential `ResizeObserver` loop in real browsers without affecting jsdom (where sizes always read 0).
  - `Overlay/component`: dropped two `useMemo` calls over primitive results (`passHandlers`, `ariaHasPopup`) where memo bookkeeping exceeded the recomputation cost. Replaced `...(cond ? { … } : {})` ternaries with conditional property assignment — no per-render `{}` allocation.
  - `Util/component`: dropped `useMemo` over a one-shot string `join(' ')`.
  - `positionMath`: hoisted `['dropdown', 'tooltip', 'popover'].includes(type)` into a module-level `Set` lookup. The array literal allocated per `computePosition` call (throttled scroll/resize hot path).
  - `Content/styled`: deduped identical `equalColsCSS` and `typeContentCSS` literals into one `FLEX_1` constant.

  Dead code removed:

  - `types.ts`: drop `SimpleHoc`, `CssCallback`, `isEmpty`, `Ref`, `ExtractProps`, `VLForwardedComponent` — zero monorepo consumers; `SimpleHoc`/`ExtractProps` were also drift hazards (different shapes in attrs/rocketstyle).
  - `Element/constants.ts`: drop `RESERVED_PROPS` (unused; `Iterator` has its own); drop `keygen` from `EMPTY_ELEMENTS` (removed from HTML5 spec in 2017).
  - `helpers/Wrapper/types.ts`: drop `Reference = unknown` (unused).

- [#276](https://github.com/vitus-labs/ui-system/pull/276) [`d25e339`](https://github.com/vitus-labs/ui-system/commit/d25e3393a7af48c2367986a6e77f70b2812235c0) Thanks [@vitbokisch](https://github.com/vitbokisch)! - - `elements/Overlay`: strip `body.overflow` management from `useScrollReposition`. `useScrollLock` is now the sole owner, gated on `isContentLoaded`. Fixes a silent permanent scroll-lock on async-mount modals.

  - `elements/Overlay/useOverlay`: remove `prevFocusRef` (set, never read) and its dead effect.
  - `kinetic`: `Transition.tsx` honors the `delay` prop (was advertised, ignored on web).
  - `hooks`: drop `useFocus` and `useHover` from the native re-exports — they return DOM-only handler names that no RN component fires.
  - `coolgrid`: delete `Container/utils.ts:getContainerWidth` — exported but only consumed by its own tests.

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

### Patch Changes

- [#244](https://github.com/vitus-labs/ui-system/pull/244) [`804dd0e`](https://github.com/vitus-labs/ui-system/commit/804dd0e2bd9709c61766abeb3b9f4519a0d949f1) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Three small structural cleanups in `elements`. No public API or behavioural changes.

  **Changes**

  1. **Iterator: fuse `filterValidItems` + `detectKind` into one scan** (`helpers/Iterator/component.tsx`). The previous code allocated an intermediate filtered array, then iterated it again to detect whether the surviving items were uniformly simple (string/number) or complex (objects). The new `filterAndDetectKind` builds the filtered array and detects kind in a single pass, then early-exits on mixed shape. Saves one full array allocation + traversal per data-driven Iterator render. The 48 existing Iterator tests cover the behaviour; all still pass.

  2. **Text: drop the per-render `renderContent` closure** (`Text/component.tsx`). The component was creating a wrapper function inside its render body and immediately calling it. Inlined the JSX directly — same output shape, one fewer function allocation per render.

  3. **Overlay: hoist the `closeOn` click-kinds array** (`Overlay/useOverlay.tsx`). The click-listener `useEffect` was allocating a fresh `['click', 'clickOnTrigger', 'clickOutsideContent']` array on every re-run for an `Array.includes` check. Replaced with a module-scoped `ReadonlySet` checked via `Set.has`. Same semantics, one fewer allocation per effect re-run.

  **Verification**

  - 271 elements tests pass (no new tests added — the existing suite covers all three changes)
  - 2694 monorepo tests pass
  - `bun run lint`, `bun run typecheck`, `bun run pkgs:build` all green

  **Honest framing**

  These are structural/allocation cleanups, not headline perf bumps. The package has no microbench in-tree, so I am not claiming a measurable delta — the wins are theoretical (fewer allocations per Iterator render, per Overlay effect re-run, per Text render). They compound at scale (long lists, frequent overlay state changes, large text-heavy trees) but are below the noise floor of any single-component scenario.

## 2.6.1

## 2.6.0

### Minor Changes

- [#229](https://github.com/vitus-labs/ui-system/pull/229) [`e2117c6`](https://github.com/vitus-labs/ui-system/commit/e2117c6fece6e0c70e1095c9b2c0897c0070343f) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Add a `LooseProps` fallback overload to `IteratorComponent` and `ListComponent`.

  **What changed**

  Iterator and List previously declared three call signatures (Simple, Object, Children). After 2.5.0 fixed the iterator-prop types for forwarding, one residual remained: `(typeof Wrapper)['$$types']['data']` — derived via rocketstyle's 4-overload-aware `ExtractProps` — is a wide union of every overload's `data`. Passing it back into `<List data={…}>` had no overload to bind to:

  - Simple wants `SimpleValue[]` — union too wide.
  - Object wants `ObjectValue[]` — union too wide.
  - Children doesn't take `data` and requires `children` — fails.

  A fourth `(props: LooseProps & extras) => ReactNode` overload gives the wide union a binding home. The narrow overloads still drive per-mode T-inference for direct callers; the loose fallback only matches when nothing narrower does.

  **Result**

  ```ts
  type Props = { list?: (typeof MyList)["$$types"]["data"] };
  const Component = ({ list }: Props) => <List data={list} component={Item} />;
  //                                            ^^^^^^^^^^
  // Pre-fix: no overload matches the wide union.
  // Post-fix: binds to LooseProps overload, compiles cleanly.
  ```

  **Trade-off**

  Heterogeneous arrays like `(string | User)[]` now compile (was rejected). Runtime handles per-item dispatch — the type-side fallback exists so forwarding round-trips work. If you want to reject mixed arrays, narrow your `data` type before passing it.

  **Why Option B (overload addition) over Option A (`children?` on ChildrenProps)**

  Option A would have made `<List />` (no data, no component, no children) type-allowed — that's a meaningful loss of "you must do something" enforcement. The added overload preserves Children's `children: ReactNode` requirement and only widens for legitimately-wide inputs.

## 2.5.0

### Minor Changes

- [#227](https://github.com/vitus-labs/ui-system/pull/227) [`4114383`](https://github.com/vitus-labs/ui-system/commit/4114383abde75ce242fe38e2f08a67f17e567733) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Relax `Iterator` / `List` iterator-prop types to support prop-forwarding patterns.

  **What changed**

  The per-mode discriminators on `SimpleProps` / `ObjectProps` / `ChildrenProps` previously used `?: never` markers to mutually exclude props across branches (PR [#199](https://github.com/vitus-labs/ui-system/issues/199)). Those markers broke any pattern that derives a `Props` type from a wrapper and forwards back to JSX:

  ```ts
  type Props = Partial<(typeof MyList)["$$types"]>;
  const Component: FC<Props> = (props) => <MyList {...props} data={contacts} />;
  //                                              ^^^^^^^^^^
  // TS errors: spread's `valueName: string | undefined` doesn't fit
  // ObjectProps's `valueName?: never` slot, because `Partial<union>`
  // merges branches' values and the `string` from SimpleProps leaks
  // through into the spread.
  ```

  The `?: never` markers are dropped. `valueName`, `children`, `data`, `component`, `itemKey`, `itemProps`, `wrapProps` now share compatible signatures across all three branches:

  - `valueName?: string` on every branch (was: `?: never` on Object/Children).
  - `children?: ReactNode` on Simple/Object (was: `?: never`).
  - `data?: Array<…>`, `component?: ElementType` on Children (was: `?: never`).
  - `itemKey` / `itemProps` / `wrapProps` unify on a loose `LooseItem = SimpleValue | ObjectValue | Record<string, SimpleValue>` callback param. Object branch keeps `keyof T` narrowing on `itemKey` for direct callers.

  **Trade-off (what's lost)**

  Direct call-site discrimination:

  - `<List data={users} valueName="x" />` no longer errors (was: rejected because `valueName` is meaningless on object iteration). Runtime still ignores valueName for object arrays; the call is type-safe but semantically a no-op.
  - `<List data={users}>{kids}</List>` no longer errors (was: rejected because data + children mode-mix). Runtime still picks data-iteration.
  - Per-`T` narrowing inside `itemProps` / `wrapProps` callbacks goes away (item is `LooseItem`, not `User`). Direct callers add an explicit annotation if they need concrete-T access: `itemProps={(item: User) => …}`.

  What's kept:

  - Discrimination via `data`'s element type (Simple vs Object) still applies — overload resolution picks the right branch.
  - ChildrenProps's `children: ReactNode` (required) still differentiates the children mode at call sites that provide it.
  - `keyof T` narrowing on `itemKey` for the Object branch (direct callers benefit from key-completion against concrete T).

  **Why**

  The forwarding pattern is broadly used (every parent component that exposes a wrapped iterator's surface). The discrimination caught a small class of no-op mistakes (`valueName` on object arrays). The cost / benefit favors forwarding.

## 2.4.0

## 2.3.0

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

## 2.2.0

### Minor Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Generic `Props<T>` on `Iterator` and `List` with discriminated branches — `T` is inferred at the JSX call site from the `data` array. Primitive arrays get `SimpleProps<T>` (`valueName` required), object arrays get `ObjectProps<T>` (`valueName` forbidden, `itemKey` typed against `keyof T`), no-data calls get `ChildrenProps`, and unparameterized callers fall back to the previous loose shape (`LooseProps`) for back-compat. Existing code keeps type-checking; new code gains stricter inference automatically.

### Patch Changes

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
