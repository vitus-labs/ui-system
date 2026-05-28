---
'@vitus-labs/core': patch
'@vitus-labs/rocketstyle': patch
'@vitus-labs/elements': patch
'@vitus-labs/attrs': patch
---

`omit()` now accepts a prebuilt `ReadonlySet` of keys in addition to an array, and the three per-render callers feed it a stable Set so the lookup Set is no longer rebuilt on every render.

**Why**

`omit` builds `new Set(keys)` internally for O(1) lookups. When the key list is stable for a component's lifetime — which it is at every render-path caller — that Set was being reconstructed every render for nothing. The Set construction dominates the call cost when the source object is small (the usual case for props).

Three hot callers, all previously passing a stable key array and paying the rebuild:

- **rocketstyle** (`rocketstyle.tsx`, `finalProps` assembly) — additionally rebuilt a 3-way `[...RESERVED_STYLING_PROPS_KEYS, ...PSEUDO_KEYS, ...options.filterAttrs]` array each render. Now memoized into a single `Set` via `useMemo` (all three sources are stable for the instance).
- **elements/List** — built a module-scope `Set` from the constant `Iterator.RESERVED_PROPS`.
- **attrs** — built the `Set` once in the factory closure from `options.filterAttrs` (fixed at component-config time).

`omit` stays fully backward compatible: array callers hit the same `new Set(keys)` path as before; only the internal length check moved from `keys.length` to `keysSet.size`.

**Measured delta**

Head-to-head microbench (median of 5 passes), realistic `finalProps` call: ~18-key mergeProps (dimension keywords + DOM/component props), 18 stable omit keys. Outputs byte-identical across all three strategies.

| Strategy | V8 (Node) | JSC (Bun) |
|---|---|---|
| current (concat + `new Set` each render) | 1.6M ops/s | 1.5M ops/s |
| memoized array (Set still rebuilt) | 1.7M ops/s (+5%) | 1.5M ops/s (+2%) |
| **prebuilt Set (this change)** | **3.0M ops/s (+47%)** | **6.5M ops/s (+77%)** |

Memoizing the array alone barely moves the needle — the per-render `new Set` rebuild is the real cost, and passing a prebuilt Set removes it entirely.
