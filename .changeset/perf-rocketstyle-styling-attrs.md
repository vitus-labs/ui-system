---
'@vitus-labs/rocketstyle': patch
---

`calculateStylingAttrs`: drop per-render allocations on the dimension-resolution hot path. Replace `Object.keys(dimensions).forEach` and `Object.entries(result).forEach` with `for…in` loops, and replace the per-dimension `new Set(Object.keys(dimensions[key]))` keyword lookup with direct `Object.hasOwn` membership.

**Why**

`calculateStylingAttrs` runs in the `EnhancedComponent` render body (rocketstyle.tsx:351) — once per render of every rocketstyle-wrapped component, not memoized. The old implementation allocated, per render: a keys array + closure for `Object.keys(dimensions).forEach`, an entries array + closure for `Object.entries(result).forEach`, and — for each unresolved boolean dimension — a fresh `Set` plus its backing `Object.keys` array. The `Set` is rebuilt every render even though `dimensions[key]` is a stable config object, so the keyword membership was recomputed from scratch each time.

`Object.hasOwn(dimensions[key], k)` is the exact equivalent of the prior `keywordSet.has(k)` (own enumerable keys of a plain config object) with zero allocation, and matches the `for…in` precedent already established by `pickStyledAttrs` directly above.

**Measured delta**

Head-to-head microbench (median of 5 passes, interleaved to neutralize drift), realistic fixture: 3 dimensions (~4–5 keywords each), `useBooleans` on, props = mix of dimension keywords + typical non-dimension props (`className`, `onClick`, `children`, `data-*`, `aria-*`, `style`, …). Outputs byte-identical between old and new.

| Engine | Old | New | Δ |
|---|---|---|---|
| V8 (Node) | 2.0M ops/s | 2.3M ops/s | **+13%** |
| JSC (Bun) | 1.7M ops/s | 8.6M ops/s | **+79%** |

JavaScriptCore optimizes the `for…in` + `Object.hasOwn` form far better than `Object.keys`/`forEach`/`Set`; V8 gains are smaller but consistent. The rewrite is simpler code and faster on both engines.
