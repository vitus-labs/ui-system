---
'@vitus-labs/elements': patch
---

Performance and correctness pass on `@vitus-labs/elements`:

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
