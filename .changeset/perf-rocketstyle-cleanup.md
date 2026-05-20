---
'@vitus-labs/rocketstyle': patch
---

Four small structural cleanups across the render path. No public API or behavioural changes.

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
